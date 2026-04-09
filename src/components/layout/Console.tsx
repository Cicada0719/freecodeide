import React, { useRef, useEffect } from 'react';
import { useIDEStore } from '../../store/useIDEStore';
import { TerminalSquare } from 'lucide-react';

const Console: React.FC = () => {
  const { outputLogs, clearLogs } = useIDEStore();
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [outputLogs]);

  return (
    <div className="h-full bg-[#181818] flex flex-col font-mono text-sm border-t border-[#2D2D2D] text-gray-300">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2D2D2D] bg-[#1E1E1E] shrink-0">
        <div className="flex items-center space-x-2">
          <TerminalSquare className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-xs tracking-wide uppercase text-gray-400">终端输出</span>
        </div>
        <button
          onClick={clearLogs}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          清空
        </button>
      </div>

      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#0D0D0D] custom-scrollbar"
      >
        {outputLogs.length === 0 ? (
          <div className="text-gray-600 italic">No output yet. Run your code to see results...</div>
        ) : (
          outputLogs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap break-words leading-relaxed text-gray-300">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Console;
