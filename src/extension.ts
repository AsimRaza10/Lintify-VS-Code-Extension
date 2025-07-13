import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';

let panel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Lintify extension is now active!');

    // Register commands
    let reviewCodeCommand = vscode.commands.registerCommand('lintify.reviewCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const code = editor.document.getText(selection);
        
        if (!code.trim()) {
            vscode.window.showErrorMessage('Please select some code to review');
            return;
        }

        reviewCode(code, editor.document.languageId);
    });

    let fixCodeCommand = vscode.commands.registerCommand('lintify.fixCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const code = editor.document.getText(selection);
        
        if (!code.trim()) {
            vscode.window.showErrorMessage('Please select some code to fix');
            return;
        }

        fixCode(code, editor.document.languageId, editor, selection);
    });

    let openPanelCommand = vscode.commands.registerCommand('lintify.openPanel', () => {
        createOrShowPanel(context.extensionUri);
    });

    context.subscriptions.push(reviewCodeCommand, fixCodeCommand, openPanelCommand);
}

async function reviewCode(code: string, language: string) {
    const apiKey = vscode.workspace.getConfiguration('lintify').get<string>('apiKey');
    
    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your Google AI API key in settings');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    try {
        vscode.window.showInformationMessage('Reviewing code...');
        
        const prompt = `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I'm sharing a piece of code written in ${language}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Show the review in a new document
        const document = await vscode.workspace.openTextDocument({
            content: `# Code Review\n\n**Language:** ${language}\n\n**Code:**\n\`\`\`${language}\n${code}\n\`\`\`\n\n**Review:**\n\n${text}`,
            language: 'markdown'
        });
        
        await vscode.window.showTextDocument(document);
        vscode.window.showInformationMessage('Code review completed!');

    } catch (error) {
        vscode.window.showErrorMessage(`Error reviewing code: ${error}`);
    }
}

async function fixCode(code: string, language: string, editor: vscode.TextEditor, selection: vscode.Selection) {
    const apiKey = vscode.workspace.getConfiguration('lintify').get<string>('apiKey');
    
    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your Google AI API key in settings');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    try {
        vscode.window.showInformationMessage('Fixing code...');
        
        const prompt = `You are an expert-level software developer.
Fix any bugs, syntax errors, or bad practices in the following ${language} code. 
Return ONLY the corrected code, with NO comments or explanations, and do NOT add any comments to the code.

Code:
${code}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let fixedCode = response.text().trim();

        // Remove markdown code blocks if present
        if (fixedCode.startsWith('```')) {
            fixedCode = fixedCode.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
        }

        // Replace the selected code with the fixed version
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, fixedCode);
        });

        vscode.window.showInformationMessage('Code fixed successfully!');

    } catch (error) {
        vscode.window.showErrorMessage(`Error fixing code: ${error}`);
    }
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
    </script>
</body>
</html>`;
}

export function deactivate() {} 