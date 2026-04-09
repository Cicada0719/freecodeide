import React, { useState } from 'react';
import { useIDEStore } from '../../store/useIDEStore';
import { Download, Check, Sparkles, Filter, Search } from 'lucide-react';

const MOCK_EXTENSIONS = [
  {
    id: 'freecode-linter',
    name: 'FreeCode Linter',
    description: 'Advanced static analysis for FreeCode to catch errors early.',
    author: 'FreeCode Team',
    downloads: '1.2M',
    type: 'extension',
    icon: '🔍'
  },
  {
    id: 'ai-autocomplete',
    name: 'Cursor AI Autocomplete',
    description: 'Intelligent code completion powered by latest LLM models.',
    author: 'AI Labs',
    downloads: '850K',
    type: 'skill',
    icon: '✨'
  },
  {
    id: 'freecode-snippets',
    name: 'FreeCode Snippets',
    description: 'Collection of useful code snippets for daily development.',
    author: 'Community',
    downloads: '420K',
    type: 'extension',
    icon: '📦'
  },
  {
    id: 'data-analysis-skill',
    name: 'Data Analysis Skill',
    description: 'Agent skill to generate data visualization and analysis scripts.',
    author: 'DataOps',
    downloads: '120K',
    type: 'skill',
    icon: '📊'
  },
  {
    id: 'docker-integration',
    name: 'Docker Integration',
    description: 'Build, manage, and deploy containerized applications.',
    author: 'Microsoft',
    downloads: '3.5M',
    type: 'extension',
    icon: '🐳'
  }
];

const Extensions: React.FC = () => {
  const { installedExtensions, toggleExtension } = useIDEStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExtensions = MOCK_EXTENSIONS.filter(
    ext => ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-[#18181b] flex flex-col text-zinc-300 w-full overflow-hidden select-none">
      {/* Header */}
      <div className="px-4 py-3 shrink-0">
        <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Extensions & Skills</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search extensions in Marketplace"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#27272a]/50 border border-[#3f3f46]/50 rounded-md py-1.5 pl-7 pr-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2 top-2" />
          <Filter className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2 cursor-pointer hover:text-zinc-300" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar pb-4 space-y-1">
        {filteredExtensions.length === 0 ? (
          <div className="text-center text-xs text-zinc-600 mt-10">
            No extensions found.
          </div>
        ) : (
          filteredExtensions.map((ext) => {
            const isInstalled = installedExtensions.includes(ext.id);
            return (
              <div 
                key={ext.id} 
                className="flex p-2 hover:bg-[#27272a]/40 rounded-md cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#27272a] to-[#18181b] border border-[#3f3f46]/50 flex items-center justify-center text-xl shrink-0 shadow-inner">
                  {ext.icon}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-[13px] font-medium text-zinc-200 truncate">{ext.name}</span>
                      {ext.type === 'skill' && (
                        <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 rounded-full border border-blue-500/30 flex items-center">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                          Skill
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5" title={ext.description}>{ext.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3 text-[10px] text-zinc-600">
                      <span className="truncate max-w-[80px]">{ext.author}</span>
                      <span className="flex items-center"><Download className="w-2.5 h-2.5 mr-0.5" />{ext.downloads}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExtension(ext.id);
                      }}
                      className={`text-[10px] px-2.5 py-0.5 rounded transition-all font-medium flex items-center space-x-1 ${
                        isInstalled 
                          ? 'bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 border border-[#3f3f46]/50' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Check className="w-3 h-3 mr-0.5" />
                          <span>Installed</span>
                        </>
                      ) : (
                        <span>Install</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Extensions;