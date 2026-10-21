import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Tabs from './Tabs.jsx'; // Context-driven Tabs import

export const languageBoilerplates = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to IDEas, C++ developer!" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to IDEas, Java developer!");\n    }\n}`,
  python: `def main():\n    print("Welcome to IDEas, Python developer!")\n\nif __name__ == "__main__":\n    main()`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Welcome to IDEas, C developer!\\n");\n    return 0;\n}`,
  javascript: `const startCoding = () => {\n    console.log("Ready to compile and run.");\n};\n\nstartCoding();`
};

function EditorPanel({ fileName, content, language }) {
  const [code, setCode] = useState(content);
  const editorRef = useRef(null);

  useEffect(() => {
    setCode(content);
  }, [content]);

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
        "editor.background": "#1a1333",
        "editor.lineHighlightBackground": "#2d2060",
        "editorLineNumber.foreground": "#6b5f8a",
      },
    });

    monaco.editor.setTheme("my-futuristic-theme");
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full min-h-0">
      <section className="flex-1 flex flex-col bg-[#1a1333] rounded-2xl border border-[#2d2060] overflow-hidden shadow-md relative">
        
        {/* VS Code Style Header with Integrated Tabs */}
        <div className="flex items-center bg-[#140e29] border-b border-[#2d2060] min-h-[40px]">
          
          {/* Traffic Light Dots */}
          <div className="flex gap-2 px-4 py-3 shrink-0 border-r border-[#2d2060]">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>

          {/* Tabs render right next to the dots */}
          <Tabs />
        </div>

        {/* Monaco Editor Code Area */}
        <div className="flex-1 p-2 pt-2 relative">
          <Editor
            height="100%"
            value={code}
            language={language?.toLowerCase()}
            theme="my-futuristic-theme"
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
    </div>
  );
}

export default EditorPanel;