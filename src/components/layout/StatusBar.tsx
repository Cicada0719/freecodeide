import React, { useState } from 'react';
import { GitBranch, XCircle, AlertTriangle, CheckCheck, Server, Wifi, WifiOff, RefreshCw, Bot, Settings2 } from 'lucide-react';
import { useIDEStore } from '../../store/useIDEStore';

const StatusBar: React.FC = () => {
  const { engineStatus, apiUrl, setApiUrl, aiConfig, setAIConfig } = useIDEStore();
  const [showAIConfig, setShowAIConfig] = useState(false);

  const handleChangeApi = () => {
    const newUrl = prompt('Configure FreeCode Engine API URL:', apiUrl);
    if (newUrl !== null && newUrl.trim() !== '') {
      setApiUrl(newUrl.trim());
    }
  };

  return (
    <>
      <div className="h-[22px] bg-[#09090b] border-t border-[#27272a] text-zinc-500 flex items-center justify-between px-3 text-[10px] font-mono shrink-0 select-none z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 hover:text-zinc-200 cursor-pointer transition-colors">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>
          <div className="flex items-center space-x-1.5 hover:text-zinc-200 cursor-pointer transition-colors">
            <XCircle className="w-3 h-3" />
            <span>0</span>
            <AlertTriangle className="w-3 h-3 ml-1" />
            <span>0</span>
          </div>
          
          {/* Engine Status */}
          <div 
            className="flex items-center space-x-1.5 hover:text-zinc-200 cursor-pointer transition-colors border-l border-[#27272a] pl-4 ml-2" 
            onClick={handleChangeApi}
            title={`API: ${apiUrl}\nNote: free-code is a CLI tool. This URL should point to a local proxy server that wraps the CLI.\nClick to change`}
          >
            {engineStatus === 'checking' && <RefreshCw className="w-3 h-3 animate-spin text-yellow-500" />}
            {engineStatus === 'connected' && <Wifi className="w-3 h-3 text-green-500" />}
            {(engineStatus === 'disconnected' || engineStatus === 'unknown') && <WifiOff className="w-3 h-3 text-red-500" />}
            
            <span className={engineStatus === 'connected' ? 'text-green-500/80' : engineStatus === 'checking' ? 'text-yellow-500/80' : 'text-red-500/80'}>
              {engineStatus === 'connected' ? 'FreeCode Proxy' : engineStatus === 'checking' ? 'Connecting...' : 'Proxy Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* AI Settings */}
          <div 
            className="flex items-center space-x-1.5 hover:text-zinc-200 cursor-pointer transition-colors border-r border-[#27272a] pr-4 mr-2"
            onClick={() => setShowAIConfig(!showAIConfig)}
            title="Configure AI Settings"
          >
            <Bot className="w-3 h-3 text-blue-400" />
            <span>{aiConfig.model}</span>
          </div>
          
          <div className="flex items-center space-x-1.5 hover:text-zinc-200 cursor-pointer transition-colors">
            <CheckCheck className="w-3 h-3 text-green-500/70" />
            <span>FreeCode Prettier</span>
          </div>
          <div className="hover:text-zinc-200 cursor-pointer transition-colors">UTF-8</div>
          <div className="hover:text-zinc-200 cursor-pointer transition-colors">LF</div>
          <div className="hover:text-zinc-200 cursor-pointer transition-colors">FreeCode</div>
        </div>
      </div>

      {/* AI Config Modal Overlay */}
      {showAIConfig && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center font-sans backdrop-blur-sm">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl w-[400px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] bg-[#09090b]">
              <div className="flex items-center text-zinc-200 text-sm font-medium">
                <Settings2 className="w-4 h-4 mr-2 text-blue-400" />
                AI Configuration
              </div>
              <button onClick={() => setShowAIConfig(false)} className="text-zinc-500 hover:text-zinc-300">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 text-sm text-zinc-300">
              <div className="space-y-1.5">
                <label className="block text-xs text-zinc-500 font-medium">Base URL</label>
                <input 
                  type="text" 
                  value={aiConfig.baseUrl}
                  onChange={(e) => setAIConfig({ baseUrl: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 focus:outline-none focus:border-blue-500/50 text-zinc-200 font-mono text-xs"
                  placeholder="https://api.openai.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs text-zinc-500 font-medium">API Key</label>
                <input 
                  type="password" 
                  value={aiConfig.apiKey}
                  onChange={(e) => setAIConfig({ apiKey: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 focus:outline-none focus:border-blue-500/50 text-zinc-200 font-mono text-xs"
                  placeholder="sk-..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs text-zinc-500 font-medium">Model</label>
                <input 
                  type="text" 
                  value={aiConfig.model}
                  onChange={(e) => setAIConfig({ model: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-1.5 focus:outline-none focus:border-blue-500/50 text-zinc-200 font-mono text-xs"
                  placeholder="gpt-4"
                />
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-[#27272a] bg-[#09090b] flex justify-end">
              <button 
                onClick={() => setShowAIConfig(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusBar;