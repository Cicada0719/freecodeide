import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, Loader2, Settings } from 'lucide-react';
import { useIDEStore } from '../../store/useIDEStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC = () => {
  const { aiConfig } = useIDEStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI assistant. I can help you write, debug, or explain freecode. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const url = aiConfig.baseUrl.endsWith('/') ? aiConfig.baseUrl : `${aiConfig.baseUrl}/`;
      const res = await fetch(`${url}v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [
            { role: 'system', content: 'You are a helpful coding assistant for the "freecode" programming language.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          stream: false
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage = data.choices?.[0]?.message?.content || "No response received.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}. Please check your API configuration in the status bar.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-[#18181b] flex flex-col font-sans relative">
      {/* Header */}
      <div className="p-3 border-b border-[#27272a] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center text-zinc-200 text-xs font-medium tracking-wide uppercase">
          <Bot className="w-3.5 h-3.5 mr-2 text-blue-400" />
          AI Chat
        </div>
        <div className="text-[10px] text-zinc-500 bg-[#27272a]/50 px-1.5 py-0.5 rounded truncate max-w-[100px]" title={aiConfig.model}>
          {aiConfig.model}
        </div>
      </div>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 text-[13px] text-zinc-300 flex flex-col space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600/20 border border-blue-500/30 text-zinc-200' 
                : 'bg-[#27272a]/30 border border-[#27272a] shadow-sm'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center mb-2 select-none">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  <span className="text-zinc-200 font-medium text-xs">FreeCode Assistant</span>
                </div>
              )}
              <div className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-[#27272a]/30 p-3 rounded-lg border border-[#27272a] shadow-sm flex items-center text-zinc-400 text-xs">
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-blue-400" />
              Thinking...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-[#27272a] bg-[#18181b] shrink-0">
        <div className="bg-[#27272a]/50 border border-[#3f3f46]/50 rounded-lg p-2 flex items-end focus-within:border-blue-500/50 focus-within:bg-[#27272a]/80 transition-all shadow-inner">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-[13px] text-zinc-200 placeholder-zinc-500 outline-none resize-none min-h-[40px] max-h-[150px] custom-scrollbar overflow-y-auto" 
            placeholder="Ask anything (⏎ to send)..."
            rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 5) : 1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-1.5 ml-2 bg-blue-600/80 hover:bg-blue-500 disabled:bg-zinc-700/50 disabled:text-zinc-500 text-white rounded-md transition-colors" 
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;