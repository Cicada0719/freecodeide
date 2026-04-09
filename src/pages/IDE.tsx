import React, { useEffect } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Extensions from '../components/layout/Extensions';
import ActivityBar from '../components/layout/ActivityBar';
import Console from '../components/layout/Console';
import CodeEditor from '../components/editor/CodeEditor';
import AIChat from '../components/layout/AIChat';
import StatusBar from '../components/layout/StatusBar';
import CommandPalette from '../components/layout/CommandPalette';
import { useIDEStore } from '../store/useIDEStore';

const IDE: React.FC = () => {
  const { files, activeFileId, addLog, appendLastLog, clearLogs, activeSidePanel, apiUrl, setEngineStatus, aiConfig } = useIDEStore();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const checkEngine = async () => {
      setEngineStatus('checking');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const res = await fetch(`${apiUrl}/info`, { 
          signal: controller.signal,
          method: 'GET',
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('API not reachable');
        
        const data = await res.json();
        // Check if the underlying engine is "free-code"
        if (data && data.engine === 'free-code') {
          setEngineStatus('connected');
        } else {
          setEngineStatus('disconnected');
        }
      } catch (error) {
        setEngineStatus('disconnected');
      }
    };

    checkEngine();
  }, [apiUrl, setEngineStatus]);

  const handleRun = async () => {
    clearLogs();
    const activeFile = files.find((f) => f.id === activeFileId);
    if (!activeFile) {
      addLog('Error: No file selected to run.');
      return;
    }

    addLog(`> Running ${activeFile.name} via external API...`);
    addLog(''); // Initialize empty log for streaming
    
    try {
      const res = await fetch(`${apiUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: activeFile.content, 
          filename: activeFile.name,
          aiConfig 
        })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'stdout' || data.type === 'stderr') {
                appendLastLog(data.content);
              } else if (data.type === 'close') {
                appendLastLog(`\n\nProcess exited with code ${data.code}`);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error: any) {
      appendLastLog(`\nExecution Error: Could not connect to external API. (${error.message})`);
      addLog('---');
      addLog('Fallback to local mock execution...');
      
      try {
        const code = activeFile.content;
        const printRegex = /print\((['"])(.*?)\1\)/g;
        let match;
        let output = false;

        while ((match = printRegex.exec(code)) !== null) {
          addLog(match[2]);
          output = true;
        }

        if (!output) {
          addLog('Local execution completed with no output.');
        }
      } catch (localError: any) {
        addLog(`Local Execution Error: ${localError.message}`);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#09090b] text-zinc-200 font-sans">
      <Header onRun={handleRun} />
      
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar />
        <PanelGroup orientation="horizontal" className="h-full">
          {/* Left Sidebar */}
          <Panel defaultSize={15} minSize={10} maxSize={30} className="h-full relative bg-[#18181b] border-r border-[#27272a]">
            {activeSidePanel === 'explorer' && <Sidebar />}
            {activeSidePanel === 'extensions' && <Extensions />}
            {activeSidePanel === 'search' && (
              <div className="p-4 text-xs text-zinc-500">Search coming soon...</div>
            )}
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-transparent hover:bg-blue-500/50 transition-colors cursor-col-resize shrink-0 z-10" />

          {/* Main Area */}
          <Panel defaultSize={60} className="h-full flex flex-col bg-[#09090b]">
            <PanelGroup orientation="vertical">
              {/* Code Editor */}
              <Panel defaultSize={75} minSize={30} className="h-full relative">
                <CodeEditor />
              </Panel>

              <PanelResizeHandle className="h-[1px] bg-[#27272a]/50 hover:bg-blue-500/50 transition-colors cursor-row-resize shrink-0 z-10" />

              {/* Console Output */}
              <Panel defaultSize={25} minSize={10} className="h-full relative bg-[#09090b]">
                <Console />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-[#27272a]/50 hover:bg-blue-500/50 transition-colors cursor-col-resize shrink-0 z-10" />

          {/* Right Sidebar - AI Chat */}
          <Panel defaultSize={25} minSize={15} maxSize={40} className="h-full relative bg-[#18181b]">
            <AIChat />
          </Panel>
        </PanelGroup>
      </div>
      
      <StatusBar />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onRun={handleRun} 
      />
    </div>
  );
};

export default IDE;