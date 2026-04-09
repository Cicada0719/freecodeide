import React from 'react';
import { Sparkles, Send, Bot } from 'lucide-react';

const AIChat: React.FC = () => {
  return (
    <div className="h-full bg-[#18181b] flex flex-col font-sans">
      {/* Header */}
      <div className="p-3 border-b border-[#27272a] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center text-zinc-200 text-xs font-medium tracking-wide uppercase">
          <Bot className="w-3.5 h-3.5 mr-2 text-blue-400" />
          AI Chat
        </div>
      </div>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 text-sm text-zinc-400 flex flex-col space-y-4 custom-scrollbar">
        <div className="bg-[#27272a]/30 p-3 rounded-lg border border-[#27272a] shadow-sm">
          <div className="flex items-center mb-2">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            <span className="text-zinc-200 font-medium">FreeCode Assistant</span>
          </div>
          <p className="leading-relaxed">Hello! I'm your AI assistant. I can help you write, debug, or explain freecode. How can I help you today?</p>
        </div>
        <div className="text-xs text-zinc-600 text-center italic mt-auto pt-4">
          Press ⌘L to focus chat
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-[#27272a] bg-[#18181b] shrink-0">
        <div className="bg-[#27272a]/50 border border-[#3f3f46]/50 rounded-lg p-2 flex items-end focus-within:border-blue-500/50 focus-within:bg-[#27272a]/80 transition-all shadow-inner">
          <textarea 
            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-500 outline-none resize-none min-h-[40px] max-h-[150px] custom-scrollbar overflow-y-auto" 
            placeholder="Ask anything (⌘L)..."
            rows={1}
          />
          <button className="p-1.5 ml-2 bg-zinc-700/50 hover:bg-blue-500 hover:text-white text-zinc-400 rounded-md transition-colors" title="Send (⏎)">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;