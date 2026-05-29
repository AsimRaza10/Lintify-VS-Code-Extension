# 🧠 Lintify VS Code Extension

AI-powered code review and fixing for Visual Studio Code, powered by Google Gemini. Lintify helps you write better code, find bugs, and improve code quality in seconds—right inside your editor.

---

## ✨ Features
- **AI Code Review**: Get detailed, actionable reviews for your code in any supported language.
- **AI Code Fixing**: Instantly fix bugs, syntax errors, and bad practices with a single click.
- **Diff View**: See a side-by-side diff before applying AI-generated fixes.
- **Review Whole File**: Review an entire file, not just a selection.
- **Add Code**: Generate a function, class, component, test, or helper from a short prompt.
- **Welcome Page**: Helpful onboarding for new users.
- **Undo Support**: All fixes are undoable (Ctrl+Z).
- **Output Channel**: Dedicated "Lintify" output channel for logs and troubleshooting.
- **Emoji Branding**: 🧠 Modern, friendly look and feel.

---

## 🚀 Installation

1. **From the VS Code Marketplace**
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for `Lintify`
   - Click **Install**

2. **From a VSIX File**
   - Download `lintify-vs-1.0.0.vsix`
   - In VS Code, open Extensions (`Ctrl+Shift+X`)
   - Click the `...` menu → `Install from VSIX...`
   - Select the `.vsix` file

---

## 🛠️ Setup

1. **Get a Google AI API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in and generate an API key

2. **Configure Lintify in VS Code**
   - Open Settings (`Ctrl+,`)
   - Search for `Lintify`
   - Paste your API key into **Lintify: Api Key**
   - Lintify currently uses `gemini-1.5-flash` internally for review and fix requests.

---

## 📝 Usage

### 1. **Review or Fix Selected Code**
- Open any code file
- Select the code you want to review or fix
- Right-click and choose:
  - `Lintify: Review Code` (for a detailed AI review)
  - `Lintify: Fix Code` (for automatic code fixing)
- Or use the Command Palette (`Ctrl+Shift+P`) and type `Lintify`

### 2. **Review the Whole File**
- Open the file you want to review
- Open the Command Palette (`Ctrl+Shift+P`)
- Type `Lintify: Review Whole File` and run the command

### 3. **Diff View for Fixes**
- When you use `Lintify: Fix Code`, a side-by-side diff will appear
- Review the changes and confirm before applying

### 4. **Add AI Suggested Code**
- Open a supported source file
- Run `Lintify: Add Code` from the Command Palette
- Choose the kind of code to generate, then describe what it should do
- Review the generated code before inserting it

### 5. **Welcome Page**
- On first install, a welcome page will guide you through setup and usage
- To see it again, run `Lintify: Open Panel` from the Command Palette

---

## ⚙️ Settings

- **Lintify: Api Key**: Your Google AI API key (required)

---

## 💡 Tips & Best Practices
- Use the **Output Channel** (`View > Output > Lintify`) for logs and troubleshooting
- All fixes are undoable—just press `Ctrl+Z` if you want to revert
- If you see a warning about unsupported languages, results may be less accurate
- For best results, keep your API key secure and do not share it

---

## 🐞 Troubleshooting

- **No API Key / Invalid Key**: Set your API key in settings
- **Model Not Supported**: Change the model in settings to one your API key supports
- **Quota Exceeded**: Check your Google AI usage/quota
- **Extension Not Working**: Reload VS Code, check the Output Channel, and ensure your API key is valid
- **Still Stuck?**: Open an issue on [GitHub](https://github.com/AsimRaza10/Lintify-VS-Code-Extension)

---

## 📝 Changelog
See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

## 🙋‍♂️ Support & Feedback
- **GitHub Issues**: [Lintify-VS-Code-Extension](https://github.com/AsimRaza10/Lintify-VS-Code-Extension/issues)
- **Email**: asimraza10@gmail.com
- **Marketplace**: [Lintify on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=asimraza10.lintify)

---

## 📄 License
MIT License

---

**Thank you for using Lintify! If you love it, please rate and review on the VS Code Marketplace.**
