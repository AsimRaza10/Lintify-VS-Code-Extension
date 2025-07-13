# Publishing Lintify VS Code Extension

This guide will walk you through the process of publishing your Lintify extension to the VS Code Marketplace.

## Prerequisites

1. **Microsoft Account**: You need a Microsoft account to publish extensions
2. **Publisher Account**: Create a publisher account on the VS Code Marketplace
3. **Personal Access Token (PAT)**: Generate a PAT for authentication

## Step 1: Create a Publisher Account

1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
2. Click "Sign in" and use your Microsoft account
3. Click "Publish extensions"
4. Create a new publisher account:
   - Choose a unique publisher name (this will be your extension's namespace)
   - Fill in your details
   - Accept the terms

## Step 2: Update package.json

Before publishing, update the following fields in `package.json`:

```json
{
  "publisher": "your-actual-publisher-name",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-actual-username/lintify-vs.git"
  },
  "bugs": {
    "url": "https://github.com/your-actual-username/lintify-vs/issues"
  },
  "homepage": "https://github.com/your-actual-username/lintify-vs#readme"
}
```

## Step 3: Generate Personal Access Token

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Sign in with your Microsoft account
3. Go to User Settings → Personal Access Tokens
4. Click "New Token"
5. Set the following:
   - **Name**: VS Code Extension Publishing
   - **Organization**: All accessible organizations
   - **Expiration**: Choose appropriate duration
   - **Scopes**: Custom defined
   - **Marketplace**: Manage
6. Copy the generated token (you'll need this for authentication)

## Step 4: Login to vsce

```bash
npx vsce login your-publisher-name
```

When prompted, enter your Personal Access Token.

## Step 5: Package the Extension

```bash
npm run package
```

This creates a `.vsix` file that you can test locally.

## Step 6: Test the Package

1. In VS Code, go to Extensions (Ctrl+Shift+X)
2. Click the "..." menu and select "Install from VSIX..."
3. Choose the generated `.vsix` file
4. Test all functionality

## Step 7: Publish the Extension

```bash
npm run publish
```

Or for the first time:

```bash
npx vsce publish --packagePath lintify-vs-0.0.1.vsix
```

## Step 8: Update the Extension

For future updates:

1. Update the version in `package.json`
2. Make your changes
3. Run `npm run compile`
4. Run `npm run publish`

## Important Notes

### Version Management
- Use semantic versioning (e.g., 1.0.0, 1.0.1, 1.1.0)
- Each published version must have a unique version number
- You cannot unpublish or replace a published version

### Marketplace Guidelines
- Ensure your extension follows the [Marketplace Policies](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#marketplace-policies)
- Provide clear documentation
- Test thoroughly before publishing
- Include appropriate keywords and descriptions

### Security Considerations
- Never commit your Personal Access Token to version control
- Use environment variables for sensitive data
- Keep your API keys secure

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure your PAT has the correct permissions
   - Check if the token has expired
   - Verify your publisher name is correct

2. **Package Validation Errors**
   - Check that all required fields are filled in `package.json`
   - Ensure the extension compiles without errors
   - Verify all dependencies are properly listed

3. **Publishing Fails**
   - Check your internet connection
   - Ensure you're logged in with the correct publisher account
   - Verify the version number is unique

### Getting Help

- [VS Code Extension API Documentation](https://code.visualstudio.com/api)
- [Marketplace Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [VS Code Extension Community](https://github.com/microsoft/vscode-extension-samples)

## Post-Publishing

After successful publication:

1. **Monitor Reviews**: Check user feedback and ratings
2. **Respond to Issues**: Address bug reports and feature requests
3. **Update Regularly**: Keep the extension up-to-date with VS Code releases
4. **Promote**: Share your extension on social media and developer communities

## Example Commands

```bash
# Install vsce locally
npm install --save-dev @vscode/vsce

# Login to publisher account
npx vsce login your-publisher-name

# Package extension
npm run package

# Publish extension
npm run publish

# Check extension info
npx vsce show lintify-vs

# List published versions
npx vsce show lintify-vs --versions
```

Good luck with publishing your extension! 🚀 