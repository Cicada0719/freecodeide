import React, { useState, useEffect, useRef } from 'react';
import { Search, FileCode2, TerminalSquare, Play, Sparkles, Settings } from 'lucide-react';
import { useIDEStore } from '../../store/useIDEStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onRun }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, setActiveFile, setActiveSidePanel } = useIDEStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = [
    { id: 'run', name: 'Run Active File', icon: Play, action: () => { onRun(); onClose(); } },
    { id: 'chat', name: 'Focus AI Chat', icon: Sparkles, action: () => { /* Handle later */ onClose(); } },
    { id: 'explorer', name: 'Show Explorer', icon: FileCode2, action: () => { setActiveSidePanel('explorer'); onClose(); } },
    { id: 'extensions', name: 'Show Extensions', icon: Settings, action: () => { setActiveSidePanel('extensions'); onClose(); } },
    { id: 'clear-logs', name: 'Clear Terminal Logs', icon: TerminalSquare, action: () => { useIDEStore.getState().clearLogs(); onClose(); } },
    ...files.map(f => ({
      id: `file-${f.id}`,
      name: `Open: ${f.name}`,
      icon: FileCode2,
      action: () => { setActiveFile(f.id); onClose(); }
    }))
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] font-sans">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="bg-[#18181b] border border-[#3f3f46]/50 rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden relative flex flex-col transform transition-all">
        <div className="flex items-center px-4 py-3 border-b border-[#27272a] bg-[#18181b]">
          <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-zinc-200 placeholder-zinc-500 text-[15px]"
            placeholder="Type a command or search..."
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center text-sm text-zinc-500 py-6">No matching commands</div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedIndex === idx 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-zinc-300 hover:bg-[#27272a]/50'
                }`}
              >
                <cmd.icon className={`w-4 h-4 mr-3 ${selectedIndex === idx ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span className="text-[13px]">{cmd.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;