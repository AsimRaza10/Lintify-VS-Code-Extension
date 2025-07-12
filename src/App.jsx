// React aur zaroori libraries import kar rahe hain
import React, { useState } from 'react';
import "./App.css";
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { CircleLoader } from "react-spinners";
import Notification from './components/Notification';

// React Select ke custom styles, taki dropdown ka look dark mode ke sath match kare
const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#18181b', // dark background
    borderColor: state.isFocused ? '#4b5563' : '#27272a',
    boxShadow: state.isFocused ? '0 0 0 1px #4b5563' : 'none',
    '&:hover': {
      borderColor: '#4b5563',
    },
    width: '100%',
  }),
  menu: base => ({
    ...base,
    backgroundColor: '#18181b',
    borderRadius: '0.5rem',
    marginTop: '4px',
    zIndex: 50,
    width: '100%',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? '#4b5563'
      : isFocused
      ? '#3f3f46'
      : '#18181b',
    color: '#f4f4f5',
    cursor: 'pointer',
  }),
  singleValue: base => ({
    ...base,
    color: '#f4f4f5',
    width: '100%',
  }),
  input: base => ({
    ...base,
    color: '#f4f4f5',
    width: '100%',
  }),
  placeholder: base => ({
    ...base,
    color: '#a1a1aa',
    width: '100%',
  }),
  dropdownIndicator: base => ({
    ...base,
    color: '#a1a1aa',
    '&:hover': {
      color: '#f4f4f5',
      width: '100%',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};

// Language options ki list
const options = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
];

// React component shuru ho raha hai
const App = () => {
  // State variables
  // Language select karne ke liye
  const [selectLanguage, setSelectLanguage] = useState(options[0]);
  // Code editor ka data
  const [code, setCode] = useState("");
  // Google GenAI ka instance
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });
  // Loading spinner dikhane ke liye
  const [loading, setLoading] = useState(false);
  // Review ka response
  const [response, setresponse] = useState("");
  // Theme (light/dark) handle karne ke liye
  const [theme, setTheme] = useState('dark');
  // Theme toggle karne ka function
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const [notification, setNotification] = useState(""); // Notification ke liye state

  // Notification dikhane ka function
  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000); // 3 second baad hide
  }

  // Code review karne ka function
  // AI ko code bhej kar review mangte hain
  async function reviewCode() {
    setresponse(""); // Purana response clear karo
    setLoading(true); // Spinner chalao
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: ` You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.\nI'm sharing a piece of code written in ${selectLanguage.value}.\nYour job is to deeply review this code and provide the following:\n\n1️⃣ A quality rating: Better, Good, Normal, or Bad.\n2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.\n3️⃣ A clear explanation of what the code does, step by step.\n4️⃣ A list of any potential bugs or logical errors, if found.\n5️⃣ Identification of syntax errors or runtime errors, if present.\n6️⃣ Solutions and recommendations on how to fix each identified issue.\n\nAnalyze it like a senior developer reviewing a pull request.\n\nCode: ${code} ")`,
    });
    setresponse(response.text); // AI ka jawab set karo
    setLoading(false); // Spinner band karo
  }

  // Code ko fix karne ka function
  // AI ko code bhej kar sirf sahi code mangte hain
  async function fixCode() {
    if (code.trim() === "") {
      showNotification("Please enter some code to fix.");
      return;
    }
    setLoading(true);
    setresponse("");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software developer.\nFix any bugs, syntax errors, or bad practices in the following ${selectLanguage.value} code. Return ONLY the corrected code, with NO comments or explanations, and do NOT add any comments to the code.\n\nCode:\n${code}`,
    });
    // Markdown code block ko remove karne ka logic
    let fixed = response.text.trim();
    if (fixed.startsWith('```')) {
      fixed = fixed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
    }
    setCode(fixed);
    setLoading(false);
  }

  // Main UI render ho raha hai
  return (
    <div className={theme}>
      {/* Notification Toast */}
      <Notification message={notification} onClose={() => setNotification("")} />
      {/* Navbar upar dikh rahi hai, theme toggle ke sath */}
      <Navbar onToggleTheme={toggleTheme} theme={theme} />
      <div
        className="main flex flex-col lg:flex-row justify-between h-full min-h-0 flex-1"
        style={{ height: 'calc(100vh - 60px)' }}
      >
        {/* Left section: Language select, buttons, aur code editor */}
        <div className="left flex flex-col w-full lg:w-1/2 min-h-0 h-full">
          <div className="tabs !mt-5 !px-5px !mb-3 w-full flex flex-col sm:flex-row items-center bg-zinc-800 gap-2 sm:gap-0 flex-shrink-0">
            {/* Language select dropdown */}
            <Select
              value={selectLanguage}
              onChange={setSelectLanguage}
              options={options}
              styles={customStyles}
              className="text-sm rounded-md w-full sm:w-64"
              classNamePrefix="react-select"
            />
            {/* Button container for mobile */}
            <div className="flex gap-2 sm:gap-0 w-full sm:w-auto">
              {/* Fix Code button */}
              <button
                className="btnNormal fix-code bg-zinc-900 min-w-[100px] transition-all hover:bg-zinc-800 sm:!ml-20 flex-1 sm:flex-none"
                onClick={fixCode}
                disabled={loading}
              >
                Fix Code
              </button>
              {/* Review button */}
              <button
                onClick={() => {
                  if (code.trim() === "") {
                    showNotification("Please enter some code to review.");
                    return;
                  } else {
                    reviewCode();
                  }
                }}
                className="btnNormal bg-zinc-900 min-w-[100px] transition-all hover:bg-zinc-800 sm:!ml-20 flex-1 sm:flex-none"
                disabled={loading}
              >
                Review
              </button>
            </div>
          </div>
          {/* Code editor (Monaco) */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              language={selectLanguage.value}
              value={code}
              onChange={(e) => {
                setCode(e);
              }}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>
        {/* Right section: Response panel */}
        <div className="right !p-[10px] bg-zinc-900 w-full lg:w-1/2 flex flex-col min-h-0 h-full">
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justify-between h-[60px] flex-shrink-0">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>
          {/* Loading spinner ya AI ka jawab dikhana */}
          <div className="response-content flex-1 overflow-y-auto">
            {loading && <CircleLoader color='#fb7185'/>}
            <Markdown>{response}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
