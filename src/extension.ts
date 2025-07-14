import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';

let panel: vscode.WebviewPanel | undefined;
let outputChannel: vscode.OutputChannel;

const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'ruby', 'php', 'swift', 'kotlin', 'rust'
];

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Lintify');
    outputChannel.appendLine('Lintify extension activated.');

    // Show welcome page on first install
    const hasShownWelcome = context.globalState.get('lintify.welcomeShown');
    if (!hasShownWelcome) {
        showWelcomePage();
        context.globalState.update('lintify.welcomeShown', true);
    }

    // Register commands
    let reviewCodeCommand = vscode.commands.registerCommand('lintify.reviewCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const code = editor.document.getText(selection);
        const language = editor.document.languageId;
        
        if (!code.trim()) {
            vscode.window.showWarningMessage('Please select some code to review.');
            return;
        }
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            vscode.window.showWarningMessage(`The language '${language}' is not officially supported by Lintify. Results may be less accurate.`);
        }
        await reviewCode(code, language);
    });

    let fixCodeCommand = vscode.commands.registerCommand('lintify.fixCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const code = editor.document.getText(selection);
        const language = editor.document.languageId;
        const documentUri = editor.document.uri.toString();
        
        if (!code.trim()) {
            vscode.window.showWarningMessage('Please select some code to fix.');
            return;
        }
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            vscode.window.showWarningMessage(`The language '${language}' is not officially supported by Lintify. Results may be less accurate.`);
        }
        
        // Store document info for potential reopening
        const documentInfo = {
            uri: editor.document.uri,
            language: language,
            originalText: code,
            selection: selection
        };
        
        await fixCode(code, language, editor, selection, documentInfo);
    });

    let reviewFileCommand = vscode.commands.registerCommand('lintify.reviewFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }
        const code = editor.document.getText();
        const language = editor.document.languageId;
        if (!code.trim()) {
            vscode.window.showWarningMessage('The file is empty.');
            return;
        }
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            vscode.window.showWarningMessage(`The language '${language}' is not officially supported by Lintify. Results may be less accurate.`);
        }
        await reviewCode(code, language);
    });

    let addCodeCommand = vscode.commands.registerCommand('lintify.addCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const language = editor.document.languageId;
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            vscode.window.showWarningMessage(`The language '${language}' is not officially supported by Lintify. Results may be less accurate.`);
        }
        
        // Store document info for potential reopening
        const documentInfo = {
            uri: editor.document.uri,
            language: language
        };
        
        await addCode(language, editor, documentInfo);
    });

    let openPanelCommand = vscode.commands.registerCommand('lintify.openPanel', () => {
        createOrShowPanel(context.extensionUri);
    });

    context.subscriptions.push(reviewCodeCommand, fixCodeCommand, reviewFileCommand, addCodeCommand, openPanelCommand, outputChannel);
}

function showWelcomePage() {
    const panel = vscode.window.createWebviewPanel(
        'lintifyWelcome',
        '🧠 Welcome to Lintify',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );
    panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Lintify</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 32px; background: #18181b; color: #f4f4f5; }
        .container { max-width: 600px; margin: 0 auto; background: #232326; border-radius: 12px; padding: 32px; box-shadow: 0 2px 16px #0002; }
        h1 { text-align: center; font-size: 2.2em; margin-bottom: 0.2em; }
        .emoji { font-size: 2.5em; display: block; text-align: center; margin-bottom: 0.5em; }
        ul { margin-top: 1.5em; }
        li { margin-bottom: 0.7em; }
        .tip { color: #fb7185; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🧠</div>
        <h1>Welcome to Lintify!</h1>
        <p>AI-powered code review and fixing for VS Code.</p>
        <ul>
            <li>✨ <span class="tip">Select code</span> and right-click for <b>Lintify: Review Code</b> or <b>Lintify: Fix Code</b></li>
            <li>✨ Use the <b>Command Palette</b> (Ctrl+Shift+P) for all Lintify commands</li>
            <li>✨ <b>Set your Google AI API key</b> in settings (search for <b>Lintify</b>)</li>
            <li>✨ <b>Review the whole file</b> with <b>Lintify: Review Whole File</b></li>
            <li>✨ <b>Add AI suggested code</b> with <b>Lintify: Add Code</b></li>
        </ul>
        <p style="margin-top:2em; text-align:center;">Thank you for using Lintify! 🚀</p>
    </div>
</body>
</html>`;
}

async function reviewCode(code: string, language: string) {
    const apiKey = vscode.workspace.getConfiguration('lintify').get<string>('apiKey');
    
    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your Google AI API key in settings.');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Lintify: Reviewing code... 🧠',
        cancellable: false
    }, async (progress) => {
        try {
            outputChannel.appendLine('Reviewing code...');
            progress.report({ message: 'Contacting Gemini AI...' });

            const prompt = `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.

I'm sharing a piece of code written in ${language}.

Your job is to deeply review this code and provide a professional, structured analysis with the following sections:

## 📊 Quality Assessment
- Rate the code quality: Excellent, Good, Fair, or Poor
- Provide a brief summary of overall code health

## 🔍 Code Analysis
- Explain what the code does, step by step
- Identify the main purpose and functionality

## ⚠️ Issues Found
- List any potential bugs or logical errors
- Identify syntax errors or runtime issues
- Note any security vulnerabilities

## 💡 Improvement Suggestions
- Provide specific, actionable suggestions for improvement
- Include best practices and advanced alternatives
- Suggest performance optimizations if applicable

## 🛠️ Solutions
- Provide clear solutions for each identified issue
- Include code examples where helpful

## 📝 Summary
- Brief summary of key findings and recommendations

Analyze it like a senior developer reviewing a pull request. Be thorough but concise.

Code to review:
\`\`\`${language}
${code}
\`\`\``;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Show the review in a new document with professional formatting
            const document = await vscode.workspace.openTextDocument({
                content: `# 🧠 Lintify Code Review

**Language:** ${language}  
**Review Date:** ${new Date().toLocaleDateString()}  
**Code Length:** ${code.split('\n').length} lines

---

## 📋 Original Code

\`\`\`${language}
${code}
\`\`\`

---

## 📊 AI Analysis

${text}

---

*Review generated by Lintify - AI-powered code review for VS Code*`,
                language: 'markdown'
            });
            
            await vscode.window.showTextDocument(document);
            vscode.window.showInformationMessage('Lintify: Code review completed!');
            outputChannel.appendLine('Code review completed.');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Lintify: Error reviewing code: ${error.message || error}`);
            outputChannel.appendLine(`Error reviewing code: ${error.stack || error}`);
        }
    });
}

async function fixCode(code: string, language: string, editor: vscode.TextEditor, selection: vscode.Selection, documentInfo?: { uri: vscode.Uri, language: string, originalText: string, selection: vscode.Selection }) {
    const apiKey = vscode.workspace.getConfiguration('lintify').get<string>('apiKey');
    
    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your Google AI API key in settings.');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Lintify: Fixing code... 🧠',
        cancellable: false
    }, async (progress) => {
        try {
            outputChannel.appendLine('Fixing code...');
            progress.report({ message: 'Contacting Gemini AI...' });

            const prompt = `You are an expert-level software developer.

Fix any bugs, syntax errors, or bad practices in the following ${language} code. 
Return ONLY the corrected code, with NO comments or explanations, and do NOT add any comments to the code.

Code to fix:
\`\`\`${language}
${code}
\`\`\``;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let fixedCode = response.text().trim();

            // Remove markdown code blocks if present
            if (fixedCode.startsWith('```')) {
                fixedCode = fixedCode.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
            }

            // Show diff and ask for confirmation
            const tempDoc = await vscode.workspace.openTextDocument({
                content: fixedCode,
                language: language
            });

            // Create a diff view
            await vscode.commands.executeCommand('vscode.diff', 
                editor.document.uri, 
                tempDoc.uri, 
                'Lintify: Original ↔ Fixed Code'
            );

            // Ask user to confirm applying the fix
            const apply = await vscode.window.showInformationMessage(
                'Do you want to apply these changes to your code?', 
                'Accept', 
                'Reject'
            );
            
            if (apply === 'Accept') {
                // Check if the editor is still valid and the document is open
                const currentEditor = vscode.window.activeTextEditor;
                if (!currentEditor || currentEditor.document.uri.toString() !== editor.document.uri.toString()) {
                    // Try to reopen the document
                    try {
                        const reopenedDoc = await vscode.workspace.openTextDocument(editor.document.uri);
                        const reopenedEditor = await vscode.window.showTextDocument(reopenedDoc);

                        // Find the selection in the reopened document
                        const documentText = reopenedDoc.getText();
                        const originalText = editor.document.getText(selection);
                        const startPos = documentText.indexOf(originalText);

                        if (startPos !== -1) {
                            const start = reopenedDoc.positionAt(startPos);
                            const end = reopenedDoc.positionAt(startPos + originalText.length);
                            const newSelection = new vscode.Selection(start, end);

                            await reopenedEditor.edit(editBuilder => {
                                editBuilder.replace(newSelection, fixedCode);
                            }, { undoStopBefore: true, undoStopAfter: true });

                            vscode.window.showInformationMessage('Lintify: Code fixed successfully! You can undo (Ctrl+Z) if needed.');
                            outputChannel.appendLine('Code fixed successfully.');
                        } else {
                            // Fallback: try to use the original selection offsets
                            try {
                                const start = selection.start;
                                const end = selection.end;
                                const newSelection = new vscode.Selection(start, end);
                                await reopenedEditor.edit(editBuilder => {
                                    editBuilder.replace(newSelection, fixedCode);
                                }, { undoStopBefore: true, undoStopAfter: true });
                                vscode.window.showWarningMessage('Lintify: Could not find the original code, but replaced the original selection range. Please verify the result.');
                                outputChannel.appendLine('Fallback: replaced original selection range.');
                            } catch (fallbackError) {
                                // As a last resort, insert at the top
                                await reopenedEditor.edit(editBuilder => {
                                    editBuilder.insert(new vscode.Position(0, 0), fixedCode + '\n');
                                }, { undoStopBefore: true, undoStopAfter: true });
                                vscode.window.showWarningMessage('Lintify: Could not find the original code or selection. Inserted the fixed code at the top of the document. Please move it to the correct location.');
                                outputChannel.appendLine('Fallback: inserted fixed code at top of document.');
                            }
                        }
                    } catch (reopenError) {
                        vscode.window.showErrorMessage('Lintify: Could not reopen the document to apply changes.');
                        outputChannel.appendLine(`Error reopening document: ${reopenError}`);
                    }
                } else {
                    // Editor is still valid, apply the fix
                    await editor.edit(editBuilder => {
                        editBuilder.replace(selection, fixedCode);
                    }, { undoStopBefore: true, undoStopAfter: true });

                    vscode.window.showInformationMessage('Lintify: Code fixed successfully! You can undo (Ctrl+Z) if needed.');
                    outputChannel.appendLine('Code fixed successfully.');
                }
            } else {
                vscode.window.showInformationMessage('Lintify: No changes applied.');
                outputChannel.appendLine('Fix rejected by user.');
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Lintify: Error fixing code: ${error.message || error}`);
            outputChannel.appendLine(`Error fixing code: ${error.stack || error}`);
        }
    });
}

async function addCode(language: string, editor: vscode.TextEditor, documentInfo?: { uri: vscode.Uri, language: string }) {
    const apiKey = vscode.workspace.getConfiguration('lintify').get<string>('apiKey');
    
    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your Google AI API key in settings.');
        return;
    }

    // Ask user what kind of code they want to add
    const codeType = await vscode.window.showQuickPick([
        'Function',
        'Class',
        'Component',
        'Utility/Helper',
        'Configuration',
        'Test',
        'Documentation',
        'Other'
    ], {
        placeHolder: 'What type of code would you like to add?'
    });

    if (!codeType) {
        return;
    }

    // Ask for additional context
    const context = await vscode.window.showInputBox({
        prompt: 'Describe what you want the code to do (optional)',
        placeHolder: 'e.g., "a function to validate email addresses"'
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Lintify: Generating code... 🧠',
        cancellable: false
    }, async (progress) => {
        try {
            outputChannel.appendLine('Generating code...');
            progress.report({ message: 'Contacting Gemini AI...' });

            const prompt = `You are an expert-level software developer.

Generate ${codeType.toLowerCase()} code in ${language}${context ? ` for: ${context}` : ''}.

Requirements:
- Write clean, professional, production-ready code
- Follow best practices for ${language}
- Include appropriate comments and documentation
- Make it reusable and maintainable
- Return ONLY the code, no explanations

${context ? `Context: ${context}` : ''}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let generatedCode = response.text().trim();

            // Remove markdown code blocks if present
            if (generatedCode.startsWith('```')) {
                generatedCode = generatedCode.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
            }

            // Show the generated code in a preview
            const tempDoc = await vscode.workspace.openTextDocument({
                content: generatedCode,
                language: language
            });

            await vscode.window.showTextDocument(tempDoc, { preview: true });

            // Ask user if they want to insert the code
            const insert = await vscode.window.showInformationMessage(
                'Do you want to insert this code at the cursor position?', 
                'Insert', 
                'Cancel'
            );
            
            if (insert === 'Insert') {
                // Check if the editor is still valid and the document is open
                const currentEditor = vscode.window.activeTextEditor;
                if (!currentEditor || currentEditor.document.uri.toString() !== editor.document.uri.toString()) {
                    // Try to reopen the document
                    try {
                        const reopenedDoc = await vscode.workspace.openTextDocument(editor.document.uri);
                        const reopenedEditor = await vscode.window.showTextDocument(reopenedDoc);
                        
                        await reopenedEditor.edit(editBuilder => {
                            editBuilder.insert(reopenedEditor.selection.active, generatedCode);
                        }, { undoStopBefore: true, undoStopAfter: true });
                        
                        vscode.window.showInformationMessage('Lintify: Code inserted successfully!');
                        outputChannel.appendLine('Code inserted successfully.');
                    } catch (reopenError) {
                        vscode.window.showErrorMessage('Lintify: Could not reopen the document to insert code.');
                        outputChannel.appendLine(`Error reopening document: ${reopenError}`);
                    }
                } else {
                    // Editor is still valid, insert the code
                    await editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, generatedCode);
                    }, { undoStopBefore: true, undoStopAfter: true });

                    vscode.window.showInformationMessage('Lintify: Code inserted successfully!');
                    outputChannel.appendLine('Code inserted successfully.');
                }
            } else {
                vscode.window.showInformationMessage('Lintify: Code not inserted.');
                outputChannel.appendLine('Code insertion cancelled by user.');
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Lintify: Error generating code: ${error.message || error}`);
            outputChannel.appendLine(`Error generating code: ${error.stack || error}`);
        }
    });
}

function createOrShowPanel(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

    if (panel) {
        panel.reveal(column);
        return;
    }

    panel = vscode.window.createWebviewPanel(
        'lintifyPanel',
        'Lintify',
        column || vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getWebviewContent(panel.webview, extensionUri);

    panel.onDidDispose(
        () => {
            panel = undefined;
        },
        null,
        []
    );
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lintify</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: var(--vscode-textLink-foreground);
            margin: 0;
        }
        .content {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
        }
        .info {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 15px;
            margin-bottom: 20px;
        }
        .commands {
            display: grid;
            gap: 15px;
        }
        .command {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .command:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .command:disabled {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 Lintify</h1>
            <p>AI-powered code review and fixing</p>
        </div>
        
        <div class="content">
            <div class="info">
                <strong>How to use:</strong>
                <ul>
                    <li>Select code in your editor</li>
                    <li>Right-click and choose "Lintify: Review Code" or "Lintify: Fix Code"</li>
                    <li>Or use the command palette (Ctrl+Shift+P)</li>
                </ul>
            </div>
            
            <div class="commands">
                <button class="command" onclick="reviewCode()">Review Selected Code</button>
                <button class="command" onclick="fixCode()">Fix Selected Code</button>
                <button class="command" onclick="reviewFile()">Review Whole File</button>
                <button class="command" onclick="addCode()">Add AI Suggested Code</button>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: var(--vscode-descriptionForeground);">
                <p><strong>Note:</strong> Make sure to set your Google AI API key in VS Code settings (lintify.apiKey)</p>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function reviewCode() {
            vscode.postMessage({ command: 'reviewCode' });
        }
        
        function fixCode() {
            vscode.postMessage({ command: 'fixCode' });
        }
        
        function reviewFile() {
            vscode.postMessage({ command: 'reviewFile' });
        }
        
        function addCode() {
            vscode.postMessage({ command: 'addCode' });
        }
    </script>
</body>
</html>`;
}

export function deactivate() {} 