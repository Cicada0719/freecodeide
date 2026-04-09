import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IFile {
  id: string;
  name: string;
  content: string;
}

interface IIDEState {
  files: IFile[];
  activeFileId: string | null;
  outputLogs: string[];
  addFile: (name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActiveFile: (id: string) => void;
  deleteFile: (id: string) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
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
      outputLogs: [],

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
          };
        }),

      updateFileContent: (id, content) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, content } : file
          ),
        })),

      renameFile: (id, newName) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, name: newName } : file
          ),
        })),

      setActiveFile: (id) => set({ activeFileId: id }),

      deleteFile: (id) =>
        set((state) => {
          const newFiles = state.files.filter((file) => file.id !== id);
          return {
            files: newFiles,
            activeFileId: state.activeFileId === id ? (newFiles[0]?.id || null) : state.activeFileId,
          };
        }),

      addLog: (log) =>
        set((state) => ({
          outputLogs: [...state.outputLogs, log],
        })),

      clearLogs: () => set({ outputLogs: [] }),
    }),
    {
      name: 'freecode-ide-storage',
      partialize: (state) => ({ files: state.files, activeFileId: state.activeFileId }), // Only persist files and active file
    }
  )
);
