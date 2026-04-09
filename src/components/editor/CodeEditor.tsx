import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useIDEStore } from '../../store/useIDEStore';
import { FileCode2 } from 'lucide-react';

const CodeEditor: React.FC = () => {
  const { files, activeFileId, updateFileContent } = useIDEStore();
  const monaco = useMonaco();
  const activeFile = files.find((f) => f.id === activeFileId);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('cursor-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '71717A', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'C084FC', fontStyle: 'bold' },
          { token: 'string', foreground: 'A7F3D0' },
          { token: 'number', foreground: 'FCD34D' },
          { token: 'operator', foreground: 'D4D4D8' },
        ],
        colors: {
          'editor.background': '#09090B',
          'editor.foreground': '#E4E4E7',
          'editor.lineHighlightBackground': '#27272A50',
          'editorLineNumber.foreground': '#52525B',
          'editorLineNumber.activeForeground': '#D4D4D8',
          'editorIndentGuide.background': '#27272A',
          'editor.selectionBackground': '#3F3F4680',
        },
      });

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
      <div className="flex-1 flex items-center justify-center bg-[#09090B] text-zinc-500 flex-col space-y-4 select-none">
        <div className="text-4xl opacity-40">⌘</div>
        <p className="text-sm font-medium tracking-wide opacity-60">Press ⌘K to open commands, ⌘L to chat</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090B]">
      {/* Sleek Tab Bar */}
      <div className="flex bg-[#18181b] overflow-x-auto shrink-0 custom-scrollbar select-none relative">
        <div className="flex items-center px-4 py-2 bg-[#09090B] border-t border-blue-500/50 text-zinc-200 text-xs font-mono min-w-[140px] relative group border-r border-[#27272a]">
          <FileCode2 className="w-3.5 h-3.5 mr-2 text-blue-400/80 group-hover:text-blue-400 transition-colors" />
          <span className="truncate">{activeFile.name}</span>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#09090B] to-transparent pointer-events-none" />
        </div>
        <div className="flex-1 border-b border-[#27272a]"></div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="px-4 py-1.5 flex items-center text-[11px] text-zinc-500 font-mono bg-[#09090B] border-b border-[#27272a]/30 select-none">
        <span className="hover:text-zinc-300 cursor-pointer transition-colors">freecode-workspace</span>
        <span className="mx-2 opacity-50">›</span>
        <span className="text-zinc-300">{activeFile.name}</span>
      </div>
      
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language="freecode"
          theme="cursor-dark"
          value={activeFile.content}
          onChange={(value) => updateFileContent(activeFile.id, value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', monospace",
            fontLigatures: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            padding: { top: 16, bottom: 16 },
            lineHeight: 1.6,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              verticalSliderSize: 4,
              horizontalSliderSize: 4,
            },
          }}
          loading={
            <div className="flex h-full items-center justify-center text-zinc-600 text-sm">
              Initializing workspace...
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;