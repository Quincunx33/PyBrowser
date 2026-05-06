import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Search, 
  MoreHorizontal, 
  ChevronRight, 
  HardDrive,
  Cloud,
  Star,
  Clock,
  LayoutGrid,
  List,
  Plus
} from 'lucide-react';
import { FileItem } from './fileService';

export default function StandaloneFileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const channel = new BroadcastChannel('pybrowser-fs');
    channel.onmessage = (event) => {
      if (event.data.type === 'FILES') {
        // Map TerminalOS's FileNode[] to FileItem[]
        setFiles(event.data.payload.map((f: any) => ({
          id: f.path,
          name: f.name,
          type: f.isDir ? 'folder' : 'file',
          size: f.isDir ? '0 items' : '?',
          date: 'Unknown'
        })));
      }
    };
    channel.postMessage({ type: 'GET_FILES' });
    return () => channel.close();
  }, []);

  const handleAddFile = () => {
    const name = `NewFile_${Date.now()}.txt`;
    new BroadcastChannel('pybrowser-fs').postMessage({ type: 'CREATE_FILE', payload: { name } });
  };
  
  const handleDeleteFile = (path: string) => {
    new BroadcastChannel('pybrowser-fs').postMessage({ type: 'DELETE_FILE', payload: { path } });
  };


  return (
    <div className="min-h-screen bg-white text-neutral-900 flex font-sans">
      {/* Sidebar - Simplified */}
      <div className="w-64 bg-neutral-100/50 border-r border-neutral-200 p-4 space-y-6">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider px-2">Locations</h2>
        <div className="space-y-1">
          <NavItem icon={<HardDrive size={20}/>} label="On My Computer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-neutral-200 flex items-center px-6 justify-between">
          <h1 className="text-xl font-bold">Standalone File Manager</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleAddFile} className="p-2 rounded bg-neutral-100 hover:bg-neutral-200"><Plus size={20} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-neutral-200' : ''}`}><List size={20} /></button>
            <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-neutral-200' : ''}`}><LayoutGrid size={20} /></button>
          </div>
        </div>

        {/* Files Area */}
        <div className="flex-1 p-6">
          <div className={`grid ${view === 'list' ? 'grid-cols-1' : 'grid-cols-4 gap-4'}`}>
            {files.map(file => (
              <div key={file.id} className={`flex items-center p-2 rounded-lg hover:bg-neutral-100 transition ${view === 'list' ? 'border-b border-neutral-100' : 'flex-col gap-2 p-4'}`}>
                {file.type === 'folder' ? <Folder className="text-blue-500" size={view === 'list' ? 24 : 48} /> : <FileText className="text-neutral-400" size={view === 'list' ? 24 : 48} />}
                <div className="flex-1 px-3">
                  <div className="font-medium">{file.name}</div>
                  {view === 'list' && <div className="text-xs text-neutral-500">{file.date} • {file.size}</div>}
                </div>
                {view === 'list' && <ChevronRight size={16} className="text-neutral-400" />}
                <button onClick={() => handleDeleteFile(file.id)} className="text-red-500 text-xs">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-200/50 cursor-pointer text-neutral-700 transition">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}
