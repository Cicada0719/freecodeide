import React from 'react';
import { PanelLeft, PanelRight, Search, Play } from 'lucide-react';

interface HeaderProps {
  onRun: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRun }) => {
  return (
    <header className="h-[38px] bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-3 shrink-0 text-zinc-300 select-none z-50">
       {/* Left: Window Controls / Brand */}
       <div className="flex items-center space-x-4 w-1/4">
         <div className="flex items-center space-x-2 text-zinc-100 opacity-60 hover:opacity-100 transition-opacity">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-500/50"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-500/50"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-500/50"></div>
         </div>
       </div>

       {/* Center: Command Palette Input */}
       <div className="flex-1 max-w-lg mx-4 flex justify-center">
         <div 
           className="w-full bg-[#27272a]/30 hover:bg-[#27272a]/60 border border-[#3f3f46]/30 rounded-md px-3 py-1 flex items-center text-zinc-400 text-xs transition-all cursor-pointer shadow-sm group"
           onClick={() => {
             const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
             window.dispatchEvent(event);
           }}
         >
           <Search className="w-3 h-3 mr-2 opacity-70 group-hover:opacity-100" />
           <span className="flex-1 truncate">Search or type a command...</span>
           <div className="flex items-center space-x-1 opacity-70">
             <span className="text-[9px] font-mono bg-[#3f3f46]/40 px-1 rounded text-zinc-400 border border-[#3f3f46]">⌘</span>
             <span className="text-[9px] font-mono bg-[#3f3f46]/40 px-1 rounded text-zinc-400 border border-[#3f3f46]">K</span>
           </div>
         </div>
       </div>

       {/* Right: Actions */}
       <div className="flex items-center justify-end w-1/4 space-x-3">
         <button 
           onClick={onRun} 
           className="flex items-center text-[11px] bg-zinc-200 hover:bg-white text-zinc-900 px-2.5 py-1 rounded shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all font-medium active:scale-95"
           title="Run Code"
         >
           <Play className="w-3 h-3 mr-1 fill-current" />
           Run
         </button>
         <div className="w-px h-4 bg-[#3f3f46]/50 mx-1"></div>
         <button className="text-zinc-500 hover:text-zinc-200 transition-colors" title="Toggle Sidebar">
           <PanelLeft className="w-4 h-4" />
         </button>
         <button className="text-zinc-500 hover:text-zinc-200 transition-colors" title="Toggle AI Chat">
           <PanelRight className="w-4 h-4" />
         </button>
       </div>
    </header>
  );
};

export default Header;