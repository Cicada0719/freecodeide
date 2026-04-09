import React, { useEffect, useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useIDEStore } from '../../store/useIDEStore';
import { FileCode2, X, Sparkles, Send } from 'lucide-react';

const CodeEditor: React.FC = () => {
  const { files, activeFileId, updateFileContent, openFiles, setActiveFile, closeFile, saveFile } = useIDEStore();
  const [inlineAI, setInlineAI] = useState<{ visible: boolean, top: number, left: number, prompt: string }>({ visible: false, top: 0, left: 0, prompt: '' });
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (activeFileId) saveFile(activeFileId);
      }
      
      // Inline AI (Cmd/Ctrl + I)
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        if (editorRef.current) {
          const selection = editorRef.current.getSelection();
          const position = editorRef.current.getScrolledVisiblePosition(selection.getStartPosition());
          
          if (position) {
            setInlineAI({
              visible: true,
              top: position.top + 30, // Offset below cursor
              left: position.left + 50,
              prompt: ''
            });
          }
        }
      }
      
      if (e.key === 'Escape' && inlineAI.visible) {
        setInlineAI(prev => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, saveFile, inlineAI.visible]);
  const monaco = useMonaco();
  const activeFile = files.find((f) => f.id === activeFileId);
  const openedFiles = openFiles.map(id => files.find(f => f.id === id)).filter(Boolean) as typeof files;

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
        {openedFiles.map(file => (
          <div 
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`flex items-center px-4 py-2 border-r border-[#27272a] text-xs font-mono min-w-[140px] max-w-[200px] relative group cursor-pointer transition-colors ${
              activeFileId === file.id 
                ? 'bg-[#09090B] border-t border-t-blue-500 text-zinc-200' 
                : 'bg-[#18181b] border-t border-t-transparent text-zinc-500 hover:bg-[#09090B]/50 hover:text-zinc-300'
            }`}
          >
            <FileCode2 className={`w-3.5 h-3.5 mr-2 shrink-0 transition-colors ${
              activeFileId === file.id ? 'text-blue-400' : 'text-zinc-600 group-hover:text-blue-400/50'
            }`} />
            <span className={`truncate flex-1 ${file.isDirty ? 'italic text-zinc-300' : ''}`}>{file.name}</span>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className={`p-0.5 rounded-md ml-2 shrink-0 transition-all ${
                activeFileId === file.id || file.isDirty ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } hover:bg-[#3f3f46] text-zinc-500 hover:text-zinc-200`}
            >
              {file.isDirty ? <div className="w-2 h-2 rounded-full bg-blue-400 m-0.5" /> : <X className="w-3 h-3" />}
            </button>
          </div>
        ))}
        <div className="flex-1 border-b border-[#27272a] bg-[#18181b]"></div>
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
          onMount={(editor) => { editorRef.current = editor; }}
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

        {/* Inline AI Widget */}
        {inlineAI.visible && (
          <div 
            className="absolute z-50 w-[450px] bg-[#18181b] border border-[#3f3f46]/80 rounded-lg shadow-2xl flex items-center px-3 py-2 transition-all transform animate-in fade-in zoom-in-95 duration-200"
            style={{ top: inlineAI.top, left: inlineAI.left }}
          >
            <Sparkles className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
            <input
              autoFocus
              type="text"
              value={inlineAI.prompt}
              onChange={(e) => setInlineAI(prev => ({ ...prev, prompt: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inlineAI.prompt) {
                  // Simulate AI editing
                  setInlineAI(prev => ({ ...prev, visible: false }));
                  alert('Inline AI editing is currently a UI concept mock. You requested: ' + inlineAI.prompt);
                }
              }}
              placeholder="Generate or edit code..."
              className="flex-1 bg-transparent text-[13px] text-zinc-200 placeholder-zinc-500 outline-none"
            />
            <div className="flex items-center space-x-1.5 ml-2 shrink-0">
              <span className="text-[10px] text-zinc-500 bg-[#27272a]/50 px-1 rounded border border-[#3f3f46]/30">Esc</span>
              <button 
                onClick={() => {
                  setInlineAI(prev => ({ ...prev, visible: false }));
                  alert('Inline AI editing is currently a UI concept mock.');
                }}
                className="p-1 hover:bg-blue-600 rounded bg-blue-500/20 text-blue-400 hover:text-white transition-colors"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;