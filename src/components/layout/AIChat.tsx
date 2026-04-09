import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, Loader2, Settings, Paperclip, Code2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useIDEStore } from '../../store/useIDEStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  contextFiles?: { name: string; content: string }[];
}

const AIChat: React.FC = () => {
  const { aiConfig, files, openFiles } = useIDEStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI assistant. I can help you write, debug, or explain freecode. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const contextFiles = includeContext 
      ? openFiles.map(id => files.find(f => f.id === id)).filter(Boolean) as {name: string, content: string}[]
      : [];
      
    setMessages(prev => [...prev, { role: 'user', content: userMessage, contextFiles }]);
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      let systemPrompt = 'You are a helpful coding assistant for the "freecode" programming language.';
      if (contextFiles.length > 0) {
        systemPrompt += '\n\nHere are the files currently open in the editor for context:\n' + 
          contextFiles.map(f => `--- ${f.name} ---\n${f.content}\n`).join('\n');
      }
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
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          stream: true
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              const content = data.choices[0]?.delta?.content || '';
              if (content) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content += content;
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error: any) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = `Error: ${error.message}. Please check your API configuration in the status bar.`;
        return newMessages;
      });
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
              {msg.role === 'user' && msg.contextFiles && msg.contextFiles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {msg.contextFiles.map((f, i) => (
                    <div key={i} className="flex items-center bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-sm">
                      <Code2 className="w-3 h-3 mr-1" />
                      {f.name}
                    </div>
                  ))}
                </div>
              )}
              <div className="leading-relaxed break-words ai-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeContent = String(children).replace(/\n$/, '');
                      const blockId = Math.random().toString(36).substr(2, 9);
                      
                      return !inline && match ? (
                        <div className="relative group mt-2 mb-2 rounded-md overflow-hidden bg-[#09090b] border border-[#3f3f46]/50">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#27272a]/50 border-b border-[#3f3f46]/50">
                            <span className="text-[10px] text-zinc-400 font-mono">{match[1]}</span>
                            <button
                              onClick={() => handleCopy(codeContent, blockId)}
                              className="text-zinc-500 hover:text-zinc-300 transition-colors"
                              title="Copy code"
                            >
                              {copiedId === blockId ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <pre className="p-3 overflow-x-auto custom-scrollbar text-[12px] text-zinc-300 font-mono m-0">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code className="bg-[#27272a]/80 text-blue-300 px-1 py-0.5 rounded text-[11px] font-mono mx-0.5" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return <p className="mb-2 last:mb-0">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="list-disc pl-4 mb-2">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
                    },
                    li({ children }) {
                      return <li className="mb-1">{children}</li>;
                    },
                    a({ children, href }) {
                      return <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">{children}</a>;
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
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
        <div className="bg-[#27272a]/50 border border-[#3f3f46]/50 rounded-lg flex flex-col focus-within:border-blue-500/50 focus-within:bg-[#27272a]/80 transition-all shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#3f3f46]/30 bg-[#27272a]/20">
            <button 
              onClick={() => setIncludeContext(!includeContext)}
              className={`flex items-center text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                includeContext 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#3f3f46]/50'
              }`}
            >
              <Paperclip className="w-3 h-3 mr-1" />
              {includeContext ? 'Context Included' : 'No Context'}
            </button>
          </div>
          
          <div className="p-2 flex items-end">
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
    </div>
  );
}

export default AIChat;