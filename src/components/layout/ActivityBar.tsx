import React from 'react';
import { Files, Search, Blocks, Settings, UserCircle } from 'lucide-react';
import { useIDEStore, SidePanelType } from '../../store/useIDEStore';

const ActivityBar: React.FC = () => {
  const { activeSidePanel, setActiveSidePanel } = useIDEStore();

  const renderIcon = (type: SidePanelType, Icon: React.ElementType, tooltip: string) => {
    const isActive = activeSidePanel === type;
    return (
      <div 
        className="relative group flex justify-center w-full py-3 cursor-pointer"
        onClick={() => setActiveSidePanel(type)}
        title={tooltip}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${isActive ? 'bg-blue-500' : 'bg-transparent'}`} />
        <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
      </div>
    );
  };

  return (
    <div className="w-12 h-full bg-[#18181b] border-r border-[#27272a] flex flex-col items-center py-2 shrink-0 select-none z-40">
      {/* Top Icons */}
      <div className="flex flex-col items-center w-full space-y-2">
        {renderIcon('explorer', Files, 'Explorer (⇧⌘E)')}
        {renderIcon('search', Search, 'Search (⇧⌘F)')}
        {renderIcon('extensions', Blocks, 'Extensions & Skills (⇧⌘X)')}
      </div>

      {/* Bottom Icons */}
      <div className="mt-auto flex flex-col items-center w-full space-y-4 pb-2">
        <div className="relative group flex justify-center w-full cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors" title="Accounts">
          <UserCircle className="w-6 h-6" />
        </div>
        <div className="relative group flex justify-center w-full cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors" title="Manage">
          <Settings className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ActivityBar;