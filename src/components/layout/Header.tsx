import React from 'react';
import { Play, Save, Trash2, Settings, Terminal } from 'lucide-react';
import { useIDEStore } from '../../store/useIDEStore';

interface HeaderProps {
  onRun: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRun }) => {
  const { clearLogs } = useIDEStore();

  return (
    <header className="h-12 bg-[#181818] border-b border-[#2D2D2D] flex items-center justify-between px-4 shrink-0 text-gray-300">
      <div className="flex items-center space-x-2">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="font-bold text-sm tracking-wide text-gray-100">FreeCode IDE</span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRun}
          className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
          title="Run Code"
        >
          <Play className="w-3.5 h-3.5" />
          <span>运行</span>
        </button>
        <button
          className="p-1.5 hover:bg-[#2D2D2D] rounded text-gray-400 hover:text-gray-200 transition-colors"
          title="Save (Auto-saved)"
        >
          <Save className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-[#2D2D2D] mx-1"></div>
        <button
          onClick={clearLogs}
          className="p-1.5 hover:bg-[#2D2D2D] rounded text-gray-400 hover:text-gray-200 transition-colors"
          title="Clear Console"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 hover:bg-[#2D2D2D] rounded text-gray-400 hover:text-gray-200 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
