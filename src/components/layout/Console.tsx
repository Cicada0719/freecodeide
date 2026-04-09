import React, { useRef, useEffect } from 'react';
import { useIDEStore } from '../../store/useIDEStore';
import { X, ChevronRight } from 'lucide-react';

const Console: React.FC = () => {
  const { outputLogs, clearLogs } = useIDEStore();
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [outputLogs]);

  return (
    <div className="h-full bg-[#09090b] flex flex-col font-mono text-[13px] text-zinc-300">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#09090b] shrink-0 select-none border-b border-[#27272a]/50">
        <div className="flex items-center space-x-6">
          <button className="text-[11px] tracking-wide font-medium text-zinc-200 border-b border-zinc-200 pb-0.5">TERMINAL</button>
          <button className="text-[11px] tracking-wide font-medium text-zinc-600 hover:text-zinc-300 pb-0.5 transition-colors">OUTPUT</button>
          <button className="text-[11px] tracking-wide font-medium text-zinc-600 hover:text-zinc-300 pb-0.5 transition-colors">PROBLEMS</button>
        </div>
        <div className="flex items-center space-x-2 text-zinc-500">
          <button onClick={clearLogs} className="hover:text-zinc-300 transition-colors p-1 rounded hover:bg-[#27272a]/50" title="Clear Console">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar"
      >
        {outputLogs.length === 0 ? (
          <div className="flex items-center text-zinc-600">
            <ChevronRight className="w-3.5 h-3.5 mr-1" />
            <span className="italic">Ready to execute.</span>
          </div>
        ) : (
          outputLogs.map((log, index) => (
            <div key={index} className="flex items-start group">
              <ChevronRight className="w-3.5 h-3.5 mr-2 mt-0.5 text-zinc-600 group-hover:text-blue-500 transition-colors shrink-0" />
              <div className="whitespace-pre-wrap break-words leading-relaxed text-zinc-300">
                {log}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Console;