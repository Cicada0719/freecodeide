import React, { useState } from 'react';
import { FileCode2, Plus, Trash, Edit2, Check, X, ChevronDown } from 'lucide-react';
import { useIDEStore, IFile } from '../../store/useIDEStore';

const Sidebar: React.FC = () => {
  const { files, activeFileId, setActiveFile, addFile, deleteFile, renameFile } = useIDEStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCreate = () => {
    if (newFileName.trim()) {
      const finalName = newFileName.endsWith('.fc') ? newFileName : `${newFileName}.fc`;
      addFile(finalName);
      setNewFileName('');
      setIsCreating(false);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      const finalName = editName.endsWith('.fc') ? editName : `${editName}.fc`;
      renameFile(id, finalName);
      setEditingId(null);
    }
  };

  return (
    <div className="h-full bg-[#18181b] flex flex-col text-zinc-300 w-full overflow-hidden select-none">
      <div 
        className="flex items-center justify-between px-4 py-2 hover:bg-[#27272a]/30 cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${!isExpanded && '-rotate-90'}`} />
          <span>Explorer</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
            setIsCreating(true);
          }}
          className="p-1 hover:bg-[#27272a] rounded text-zinc-500 hover:text-zinc-200 transition-colors"
          title="New File"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto py-1 space-y-[1px] custom-scrollbar px-2">
          {isCreating && (
            <div className="flex items-center space-x-2 bg-[#27272a]/50 p-1.5 rounded-md text-[13px] mb-1 border border-blue-500/30">
              <FileCode2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                onBlur={() => setIsCreating(false)}
                placeholder="filename.fc"
                className="bg-transparent border-none outline-none w-full text-zinc-200 placeholder-zinc-600"
              />
            </div>
          )}

          {files.map((file: IFile) => (
            <div
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={`group flex items-center justify-between p-1.5 rounded-md cursor-pointer text-[13px] transition-all ${
                activeFileId === file.id
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'hover:bg-[#27272a]/50 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {editingId === file.id ? (
                <div className="flex items-center space-x-2 w-full" onClick={(e) => e.stopPropagation()}>
                  <FileCode2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                    className="bg-[#18181b] border border-blue-500/50 outline-none w-full text-zinc-200 px-1.5 rounded-sm text-xs py-0.5"
                  />
                  <button onClick={() => handleRename(file.id)} className="text-zinc-400 hover:text-green-400">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${activeFileId === file.id ? 'text-blue-400' : 'text-zinc-500 group-hover:text-blue-400/70 transition-colors'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditName(file.name);
                        setEditingId(file.id);
                      }}
                      className="p-1 hover:bg-[#3f3f46]/50 rounded text-zinc-500 hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className="p-1 hover:bg-[#3f3f46]/50 rounded text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {files.length === 0 && !isCreating && (
            <div className="text-center text-xs text-zinc-600 mt-10">
              No files found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;