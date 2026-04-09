import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IFile {
  id: string;
  name: string;
  content: string;
  isDirty?: boolean;
}

export type SidePanelType = 'explorer' | 'search' | 'extensions';
export type EngineStatus = 'checking' | 'connected' | 'disconnected' | 'unknown';

interface IAIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface IIDEState {
  files: IFile[];
  activeFileId: string | null;
  openFiles: string[]; // List of file IDs currently open in tabs
  outputLogs: string[];
  activeSidePanel: SidePanelType;
  installedExtensions: string[];
  
  apiUrl: string;
  engineStatus: EngineStatus;
  
  aiConfig: IAIConfig;
  
  addFile: (name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActiveFile: (id: string) => void;
  deleteFile: (id: string) => void;
  closeFile: (id: string) => void;
  saveFile: (id: string) => void;
  
  addLog: (log: string) => void;
  appendLastLog: (chunk: string) => void;
  clearLogs: () => void;
  
  setActiveSidePanel: (panel: SidePanelType) => void;
  toggleExtension: (id: string) => void;
  
  setApiUrl: (url: string) => void;
  setEngineStatus: (status: EngineStatus) => void;
  setAIConfig: (config: Partial<IAIConfig>) => void;
}

const defaultFiles: IFile[] = [
  {
    id: '1',
    name: 'main.fc',
    content: '// Welcome to FreeCode Web IDE\n// Write your freecode here\n\nprint("Hello, FreeCode!");\n',
  },
];

export const useIDEStore = create<IIDEState>()(
  persist(
    (set) => ({
      files: defaultFiles,
      activeFileId: '1',
      openFiles: ['1'],
      outputLogs: [],
      activeSidePanel: 'explorer',
      installedExtensions: ['freecode-linter'],
      apiUrl: 'http://localhost:8080/api',
      engineStatus: 'unknown',
      
      aiConfig: {
        baseUrl: 'https://sub.ai6.me',
        apiKey: 'sk-6ca22604fd7f30be89484acc6e466fc86511fc861a205efd0f4f0ff7863eeb01',
        model: 'gpt-5.4',
      },

      addFile: (name) =>
        set((state) => {
          const newFile: IFile = {
            id: crypto.randomUUID(),
            name,
            content: '',
          };
          return {
            files: [...state.files, newFile],
            activeFileId: newFile.id,
            openFiles: [...state.openFiles, newFile.id],
          };
        }),

      updateFileContent: (id, content) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, content, isDirty: true } : file
          ),
        })),

      renameFile: (id, newName) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, name: newName } : file
          ),
        })),

      setActiveFile: (id) => set((state) => {
        const newOpenFiles = state.openFiles.includes(id) 
          ? state.openFiles 
          : [...state.openFiles, id];
        return { activeFileId: id, openFiles: newOpenFiles };
      }),

      deleteFile: (id) =>
        set((state) => {
          const newFiles = state.files.filter((file) => file.id !== id);
          const newOpenFiles = state.openFiles.filter(fid => fid !== id);
          let newActiveId = state.activeFileId;
          
          if (state.activeFileId === id) {
            newActiveId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
          }
          
          return {
            files: newFiles,
            openFiles: newOpenFiles,
            activeFileId: newActiveId,
          };
        }),

      closeFile: (id) => 
        set((state) => {
          const newOpenFiles = state.openFiles.filter(fid => fid !== id);
          let newActiveId = state.activeFileId;
          
          if (state.activeFileId === id) {
            newActiveId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
          }
          
          return {
            openFiles: newOpenFiles,
            activeFileId: newActiveId,
          };
        }),

      saveFile: (id) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, isDirty: false } : file
          ),
        })),

      addLog: (log) =>
        set((state) => ({
          outputLogs: [...state.outputLogs, log],
        })),

      appendLastLog: (chunk) =>
        set((state) => {
          if (state.outputLogs.length === 0) {
            return { outputLogs: [chunk] };
          }
          const newLogs = [...state.outputLogs];
          newLogs[newLogs.length - 1] += chunk;
          return { outputLogs: newLogs };
        }),

      clearLogs: () => set({ outputLogs: [] }),

      setActiveSidePanel: (panel) => set({ activeSidePanel: panel }),
      
      toggleExtension: (id) =>
        set((state) => {
          const isInstalled = state.installedExtensions.includes(id);
          return {
            installedExtensions: isInstalled
              ? state.installedExtensions.filter((e) => e !== id)
              : [...state.installedExtensions, id],
          };
        }),

      setApiUrl: (apiUrl) => set({ apiUrl }),
      setEngineStatus: (engineStatus) => set({ engineStatus }),
      setAIConfig: (config) => set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),
    }),
    {
      name: 'freecode-ide-storage',
      partialize: (state) => ({ 
        files: state.files, 
        activeFileId: state.activeFileId,
        openFiles: state.openFiles,
        installedExtensions: state.installedExtensions,
        apiUrl: state.apiUrl,
        aiConfig: state.aiConfig
      }),
    }
  )
);
