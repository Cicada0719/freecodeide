import React, { useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useIDEStore } from '../../store/useIDEStore';

const CodeEditor: React.FC = () => {
  const { files, activeFileId, updateFileContent } = useIDEStore();
  const monaco = useMonaco();
  const activeFile = files.find((f) => f.id === activeFileId);

  useEffect(() => {
    if (monaco) {
      // Define a custom theme
      monaco.editor.defineTheme('freecode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
          { token: 'string', foreground: 'ce9178' },
          { token: 'number', foreground: 'b5cea8' },
          { token: 'operator', foreground: 'd4d4d4' },
        ],
        colors: {
          'editor.background': '#1E1E1E',
          'editor.foreground': '#D4D4D4',
          'editor.lineHighlightBackground': '#2A2D2E',
          'editorLineNumber.foreground': '#858585',
          'editorIndentGuide.background': '#404040',
        },
      });

      // Register basic freecode language
      monaco.languages.register({ id: 'freecode' });
      monaco.languages.setMonarchTokensProvider('freecode', {
        tokenizer: {
          root: [
            [/\/\/.*$/, 'comment'],
            [/\b(if|else|while|for|function|return|let|const|var|print|class)\b/, 'keyword'],
            [/"([^"\\]|\\.)*"/, 'string'],
            [/'([^'\\]|\\.)*'/, 'string'],
            [/\b\d+\b/, 'number'],
            [/[{}()[\]]/, '@brackets'],
            [/[<>+\-*/=]/, 'operator'],
          ],
        },
      });
    }
  }, [monaco]);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1E1E1E] text-gray-500 flex-col space-y-4">
        <div className="text-4xl">⚡️</div>
        <p className="text-lg font-light tracking-wide">Select a file to start coding</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
      {/* File Tabs Area */}
      <div className="flex bg-[#181818] overflow-x-auto shrink-0 custom-scrollbar border-b border-[#2D2D2D]">
        <div className="flex items-center px-4 py-2 bg-[#1E1E1E] border-t-2 border-green-500 text-gray-200 text-xs font-mono">
          <span className="truncate">{activeFile.name}</span>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language="freecode"
          theme="freecode-dark"
          value={activeFile.content}
          onChange={(value) => updateFileContent(activeFile.id, value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          loading={
            <div className="flex h-full items-center justify-center text-gray-500">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;
