# 🧠 Lintify - AI-Powered Code Review & Fix Tool

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC.svg)](https://tailwindcss.com/)
[![Google GenAI](https://img.shields.io/badge/Google%20GenAI-1.9.0-green.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, responsive web application that leverages Google's Gemini AI to provide intelligent code review, analysis, and automated code fixing capabilities. Built with React, Vite, and Tailwind CSS for a seamless developer experience.

## ✨ Features

### 🤖 AI-Powered Code Analysis
- **Intelligent Code Review**: Get detailed analysis of your code quality, potential bugs, and improvement suggestions
- **Automated Code Fixing**: Automatically fix syntax errors, bugs, and bad practices
- **Multi-Language Support**: Supports 12+ programming languages including JavaScript, Python, Java, C++, TypeScript, and more
- **Quality Rating System**: Receive quality ratings (Better, Good, Normal, Bad) with detailed explanations

### 🎨 Modern User Interface
- **Responsive Design**: Fully responsive layout that works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes for comfortable coding
- **Monaco Editor Integration**: Professional code editor with syntax highlighting and IntelliSense
- **Real-time Feedback**: Instant notifications and loading states for better user experience

### 🛠️ Developer Experience
- **Fast Development**: Built with Vite for lightning-fast development and hot module replacement
- **Modern Stack**: React 19, Tailwind CSS 4, and latest web technologies
- **Type Safety**: Full TypeScript support with proper type definitions
- **Code Quality**: ESLint configuration for maintaining code quality

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Google AI API key (for Gemini integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsimRaza10/Lintify-AI-Powered-Code-Reviewer.git
   cd Lintify-AI-Powered-Code-Reviewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up your API key**
   
   Get your Google AI API key from [Google AI Studio](https://aistudio.google.com/) and create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file and replace `your_google_ai_api_key_here` with your actual API key:
   ```env
   VITE_GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application in action.

## 📖 Usage Guide

### Code Review Process

1. **Select Programming Language**
   - Choose your programming language from the dropdown menu
   - Supports JavaScript, Python, Java, C#, C++, TypeScript, Go, Ruby, PHP, Swift, Kotlin, and Rust

2. **Write or Paste Your Code**
   - Use the Monaco editor to write your code
   - Paste existing code from your projects
   - The editor provides syntax highlighting and IntelliSense

3. **Get AI Analysis**
   - Click the "Review" button to get comprehensive code analysis
   - Receive detailed feedback including:
     - Quality rating and assessment
     - Potential bugs and issues
     - Best practices recommendations
     - Performance optimization suggestions
     - Security considerations

4. **Auto-Fix Code Issues**
   - Click the "Fix Code" button to automatically fix detected issues
   - The AI will correct syntax errors, bugs, and bad practices
   - Review the changes before implementing

### Features in Detail

#### 🔍 Code Review Analysis
- **Quality Assessment**: Get ratings from "Better" to "Bad" with detailed explanations
- **Bug Detection**: Identify potential runtime errors and logical issues
- **Best Practices**: Receive suggestions for code improvements and optimizations
- **Security Analysis**: Detect security vulnerabilities and unsafe practices
- **Performance Tips**: Get recommendations for better performance

#### 🛠️ Code Fixing
- **Syntax Correction**: Fix syntax errors automatically
- **Bug Resolution**: Correct logical errors and edge cases
- **Code Optimization**: Improve code efficiency and readability
- **Best Practice Implementation**: Apply industry-standard coding practices

#### 🎨 User Interface Features
- **Responsive Design**: Works seamlessly across all device sizes
- **Theme Toggle**: Switch between dark and light themes
- **Real-time Notifications**: Get instant feedback on actions
- **Loading States**: Visual indicators during AI processing
- **Markdown Rendering**: Beautiful formatting of AI responses

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **Vite 7.0.4** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Monaco Editor** - Professional code editor component
- **Lucide React** - Beautiful icon library

### AI & APIs
- **Google GenAI 1.9.0** - Google's Gemini AI for code analysis
- **React Markdown** - Markdown rendering for AI responses

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **TypeScript** - Type safety and better development experience
- **React Select** - Enhanced select dropdowns
- **React Spinners** - Loading animations

## 📁 Project Structure

```
lintify/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx     # Navigation component
│   │   └── Notification.jsx # Toast notifications
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_AI_API_KEY=your_api_key_here
```

### API Key Setup
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the key to your environment variables or directly in the code
4. Ensure you have sufficient API quota for your usage

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Add proper TypeScript types where applicable
- Ensure responsive design works on all screen sizes
- Test thoroughly before submitting PRs
- Update documentation for new features

## 🐛 Troubleshooting

### Common Issues

**API Key Errors**
- Ensure your Google AI API key is valid and has sufficient quota
- Check that the API key is properly configured in the application

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check Node.js version compatibility

**Responsive Issues**
- Test on different screen sizes
- Check browser developer tools for responsive design issues
- Ensure all components use Tailwind's responsive classes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for providing the Gemini AI API
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the excellent code editing experience
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the amazing UI library

## 📞 Support

If you encounter any issues or have questions:

- **Create an issue** on GitHub
- **Check the documentation** for common solutions
- **Review the troubleshooting section** above

---

**Made with ❤️ by the Lintify Team**

*Empowering developers with AI-powered code analysis and improvement tools.* 