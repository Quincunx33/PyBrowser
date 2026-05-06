
export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size: string;
  date: string;
  content?: string;
}

const STORAGE_KEY = 'REAL_FILE_MANAGER_DATA';

export const getFiles = (): FileItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFile = (file: FileItem) => {
  const files = getFiles();
  const index = files.findIndex(f => f.id === file.id);
  if (index !== -1) {
    files[index] = file;
  } else {
    files.push(file);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
};

export const deleteFile = (id: string) => {
  const files = getFiles().filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
};
