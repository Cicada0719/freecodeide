import React from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Console from '../components/layout/Console';
import CodeEditor from '../components/editor/CodeEditor';
import { useIDEStore } from '../store/useIDEStore';

const IDE: React.FC = () => {
  const { files, activeFileId, addLog, clearLogs } = useIDEStore();

  const handleRun = () => {
    clearLogs();
    const activeFile = files.find((f) => f.id === activeFileId);
    if (!activeFile) {
      addLog('Error: No file selected to run.');
      return;
    }

    addLog(`> Running ${activeFile.name}...`);
    try {
      // Very basic mock execution environment for "freecode"
      // We will parse `print("something")` statements
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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#181818] text-gray-200">
      <Header onRun={handleRun} />
      
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup orientation="horizontal" className="h-full">
          {/* Sidebar */}
          <Panel defaultSize={20} minSize={10} maxSize={30} className="h-full relative bg-[#181818]">
            <Sidebar />
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-[#2D2D2D] hover:bg-green-500 hover:opacity-50 transition-colors cursor-col-resize shrink-0 z-10" />

          {/* Main Area */}
          <Panel defaultSize={80} className="h-full flex flex-col bg-[#1E1E1E]">
            <PanelGroup orientation="vertical">
              {/* Code Editor */}
              <Panel defaultSize={70} minSize={30} className="h-full relative">
                <CodeEditor />
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="h-1 bg-[#2D2D2D] hover:bg-green-500 hover:opacity-50 transition-colors cursor-row-resize shrink-0 z-10" />

              {/* Console Output */}
              <Panel defaultSize={30} minSize={10} className="h-full relative bg-[#0D0D0D]">
                <Console />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default IDE;
