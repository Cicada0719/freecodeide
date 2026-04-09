import React from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Extensions from '../components/layout/Extensions';
import ActivityBar from '../components/layout/ActivityBar';
import Console from '../components/layout/Console';
import CodeEditor from '../components/editor/CodeEditor';
import AIChat from '../components/layout/AIChat';
import StatusBar from '../components/layout/StatusBar';
import { useIDEStore } from '../store/useIDEStore';

const IDE: React.FC = () => {
  const { files, activeFileId, addLog, clearLogs, activeSidePanel } = useIDEStore();

  const handleRun = () => {
    clearLogs();
    const activeFile = files.find((f) => f.id === activeFileId);
    if (!activeFile) {
      addLog('Error: No file selected to run.');
      return;
    }

    addLog(`> Running ${activeFile.name}...`);
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
        addLog('Execution completed with no output.');
      }
    } catch (error: any) {
      addLog(`Execution Error: ${error.message}`);
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
    </div>
  );
};

export default IDE;