import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { codeExecute } from "../API/userAPI.js";
import BgDecor from "../shared/BgDecor.jsx";
export const languageBoilerplates = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to IDEas, C++ developer!" << endl;
    
    // Write your code here
    
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to IDEas, Java developer!");
        
        // Write your code here
        
    }
}`,

  python: `def main():
    print("Welcome to IDEas, Python developer!")
    
    # Write your code here

if __name__ == "__main__":
    main()`,

  c: `#include <stdio.h>

int main() {
    printf("Welcome to IDEas, C developer!\\n");
    
    // Write your code here
    
    return 0;
}`,

  javascript: `// Welcome to IDEas, JavaScript developer!

const startCoding = () => {
    console.log("Ready to compile and run.");
    
    // Write your code here
};

startCoding();`
};

const Compiler = () => {
  const [code, setCode] = useState(languageBoilerplates.cpp);
  const languages = ["cpp", "java", "python", "c", "javascript"];
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("//output here");

  const editorRef = useRef(null);

  const sendCodeToExecution = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const data = {
      code: code,
      language: language,
    };
    console.log(data);
    const opt = await codeExecute(data);

    if (opt.error) {
      setOutput(opt.data.error);
    } else {
      setOutput(opt.data.output);
    }
    console.log(opt);
    setLoading(false);
  };

  const handleCodeChange = (value) => {
    setCode(value || "");
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("my-futuristic-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "C586C0" },
        { token: "identifier", foreground: "9CDCFE" },
        { token: "string", foreground: "CE9178" },
      ],
      colors: {
        "editor.background": "#0D0914",
        "editor.lineHighlightBackground": "#2A1B38",
        "editorLineNumber.foreground": "#6B4A8E",
      },
    });

    monaco.editor.setTheme("my-futuristic-theme");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] w-full bg-[#faf9ff] font-sans text-[#1a1333]">
      <BgDecor/>
      {/* ── TOOLBAR ── */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#ede8ff] shadow-sm shrink-0">
        {/* Language Selector (Left aligned now for a cleaner look) */}
        <div className="flex gap-1 p-1 bg-[#faf9ff] rounded-xl border border-[#ede8ff] max-w-2xl overflow-x-auto no-scrollbar">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() =>{ setLanguage(l) ; setCode(languageBoilerplates[l])}}
              className={`px-4 py-1.5 rounded-lg text-[13.5px] font-semibold transition-all whitespace-nowrap ${
                language === l
                  ? "bg-white text-[#7c3aed] shadow-sm border border-[#ede8ff]"
                  : "text-[#6b5f8a] hover:text-[#1a1333] hover:bg-[#ede8ff]/50 border border-transparent"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Action Button (Right) */}
        <button
          onClick={sendCodeToExecution}
          disabled={loading}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#7c3aed] text-white text-[14px] font-bold cursor-pointer hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_#7c3aed30]"
        >
          {loading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {loading ? "Running..." : "Run Code"}
        </button>
      </header>

      {/* ── WORKSPACE (Split Pane) ── */}
      <main className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">
        
        {/* Editor Panel (Left) */}
        <section className="flex-[2] flex flex-col bg-[#1a1333] rounded-2xl border border-[#2d2060] overflow-hidden shadow-md relative">
          
          {/* Editor Header (Mac Window Style) */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#2d2060] bg-[#140e29]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-[#a78bfa] font-mono tracking-wide">
              main.{language.toLowerCase() === "python" ? "py" : language.toLowerCase() === "javascript" ? "js" : language.toLowerCase()}
            </span>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-2 pt-4 relative">
             {/* If you're using Monaco, you can leave height="100%" */}
            <Editor
              height="100%"
              value={code}
              language={language.toLowerCase()}
              theme="vs-dark"
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </section>

        {/* Output Panel (Right) */}
        <section className="flex-[1] flex flex-col bg-[#0f0a24] rounded-2xl border border-[#2d2060] overflow-hidden shadow-md">
          
          {/* Output Header */}
          <div className="flex items-center px-5 py-3 border-b border-[#2d2060] bg-[#140e29]">
            <svg
              className="mr-2 text-[#9d8cc4]"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <span className="text-[11px] font-bold text-[#9d8cc4] tracking-[1px] uppercase">
              Terminal
            </span>
          </div>

          {/* Output Area */}
          <div className="flex-1 p-5 overflow-auto font-mono text-[14px] leading-relaxed whitespace-pre-wrap">
            {output ? (
              <div className="text-[#34d399]">{output}</div>
            ) : (
              <div className="text-[#6b5f8a] italic">Waiting for output...</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Compiler;
