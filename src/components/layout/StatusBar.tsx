import React from 'react';
import { GitBranch, XCircle, AlertTriangle, CheckCheck, Server, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useIDEStore } from '../../store/useIDEStore';

const StatusBar: React.FC = () => {
  const { engineStatus, apiUrl, setApiUrl } = useIDEStore();

  const handleChangeApi = () => {
    const newUrl = prompt('Configure FreeCode Engine API URL:', apiUrl);
    if (newUrl !== null && newUrl.trim() !== '') {
      setApiUrl(newUrl.trim());
    }
  };

  return (
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
          title={`API: ${apiUrl}\nClick to change`}
        >
          {engineStatus === 'checking' && <RefreshCw className="w-3 h-3 animate-spin text-yellow-500" />}
          {engineStatus === 'connected' && <Wifi className="w-3 h-3 text-green-500" />}
          {(engineStatus === 'disconnected' || engineStatus === 'unknown') && <WifiOff className="w-3 h-3 text-red-500" />}
          
          <span className={engineStatus === 'connected' ? 'text-green-500/80' : engineStatus === 'checking' ? 'text-yellow-500/80' : 'text-red-500/80'}>
            {engineStatus === 'connected' ? 'FreeCode Engine' : engineStatus === 'checking' ? 'Connecting...' : 'Engine Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 hover:text-zinc-200 cursor-pointer transition-colors">
          <CheckCheck className="w-3 h-3 text-green-500/70" />
          <span>FreeCode Prettier</span>
        </div>
        <div className="hover:text-zinc-200 cursor-pointer transition-colors">UTF-8</div>
        <div className="hover:text-zinc-200 cursor-pointer transition-colors">LF</div>
        <div className="hover:text-zinc-200 cursor-pointer transition-colors">FreeCode</div>
      </div>
    </div>
  );
};

export default StatusBar;