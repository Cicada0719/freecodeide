import React, { useState } from 'react';
import { FileCode2, Plus, Trash, Edit2, X, Check } from 'lucide-react';
import { useIDEStore, IFile } from '../../store/useIDEStore';

const Sidebar: React.FC = () => {
  const { files, activeFileId, setActiveFile, addFile, deleteFile, renameFile } = useIDEStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

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
    <div className="h-full bg-[#181818] flex flex-col text-gray-300 w-full overflow-hidden border-r border-[#2D2D2D]">
      <div className="flex items-center justify-between p-3 border-b border-[#2D2D2D] shrink-0">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">资源管理器</span>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-[#2D2D2D] rounded text-gray-400 hover:text-gray-100 transition-colors"
          title="New File"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isCreating && (
          <div className="flex items-center space-x-2 bg-[#2D2D2D] p-1.5 rounded text-sm mb-2">
            <FileCode2 className="w-4 h-4 text-green-500 shrink-0" />
            <input
              autoFocus
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              onBlur={() => setIsCreating(false)}
              placeholder="filename.fc"
              className="bg-transparent border-none outline-none w-full text-gray-200 placeholder-gray-500"
            />
          </div>
        )}

        {files.map((file: IFile) => (
          <div
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`group flex items-center justify-between p-1.5 rounded cursor-pointer text-sm transition-colors ${
              activeFileId === file.id
                ? 'bg-[#2D2D2D] text-white'
                : 'hover:bg-[#252525] text-gray-400 hover:text-gray-200'
            }`}
          >
            {editingId === file.id ? (
              <div className="flex items-center space-x-2 w-full" onClick={(e) => e.stopPropagation()}>
                <FileCode2 className="w-4 h-4 text-green-500 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                  className="bg-[#181818] border border-[#3D3D3D] outline-none w-full text-gray-200 px-1 rounded text-xs py-0.5"
                />
                <button onClick={() => handleRename(file.id)} className="text-green-500 hover:text-green-400">
                  <Check className="w-3 h-3" />
                </button>
                <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2 truncate">
                  <FileCode2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditName(file.name);
                      setEditingId(file.id);
                    }}
                    className="p-1 hover:bg-[#3D3D3D] rounded text-gray-400 hover:text-blue-400"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="p-1 hover:bg-[#3D3D3D] rounded text-gray-400 hover:text-red-400"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {files.length === 0 && !isCreating && (
          <div className="text-center text-xs text-gray-500 mt-10">
            暂无文件，点击 "+" 创建
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
