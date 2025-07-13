# Lintify VS Code Extension

An AI-powered code review and fixing extension for Visual Studio Code that uses Google's Gemini AI to analyze and improve your code.

## Features

- **Code Review**: Get detailed analysis of your code including quality ratings, improvement suggestions, and bug identification
- **Code Fixing**: Automatically fix syntax errors, bugs, and improve code quality
- **Multiple Languages**: Supports JavaScript, TypeScript, Python, Java, C#, C++, Go, Ruby, PHP, Swift, Kotlin, Rust, and more
- **Context Menu Integration**: Right-click on selected code to review or fix
- **Command Palette**: Access all features through VS Code's command palette
- **Dedicated Panel**: Open a dedicated Lintify panel for easy access

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` in VS Code to launch the extension in a new Extension Development Host window

## Setup

1. Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open VS Code settings (Ctrl+,)
3. Search for "lintify"
4. Enter your API key in the "Lintify: Api Key" field

## Usage

### Code Review
1. Select the code you want to review
2. Right-click and choose "Lintify: Review Code"
3. Or use the command palette (Ctrl+Shift+P) and search for "Lintify: Review Code"
4. The review will open in a new markdown document

### Code Fixing
1. Select the code you want to fix
2. Right-click and choose "Lintify: Fix Code"
3. Or use the command palette (Ctrl+Shift+P) and search for "Lintify: Fix Code"
4. The fixed code will replace your selection

### Open Panel
1. Use the command palette (Ctrl+Shift+P) and search for "Lintify: Open Panel"
2. Or click the Lintify icon in the activity bar

## Commands

- `lintify.reviewCode`: Review selected code
- `lintify.fixCode`: Fix selected code
- `lintify.openPanel`: Open the Lintify panel

## Configuration

- `lintify.apiKey`: Your Google AI API key (required)

## Development

### Prerequisites
- Node.js
- VS Code
- TypeScript

### Building
```bash
npm install
npm run compile
```

### Running
Press `F5` in VS Code to launch the extension in a new Extension Development Host window.

### Testing
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 