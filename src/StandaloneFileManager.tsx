import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  RefreshCw,
  X,
  Save,
  ArrowLeft,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { FileItem } from './fileService';

export default function StandaloneFileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [activeFile, setActiveFile] = useState<{ path: string; content: string; name: string } | null>(null);
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newName, setNewName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel('pybrowser-fs');
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'FILES') {
        setIsConnected(true);
        // Map TerminalOS's FileNode[] to FileItem[]
        setFiles(payload.map((f: any) => ({
          id: f.path,
          name: f.name,
          type: f.isDir ? 'folder' : 'file',
          size: f.isDir ? '0 items' : '?',
          date: 'Modified'
        })));
      }
      if (type === 'FILE_CONTENT') {
        setActiveFile({
          path: payload.path,
          content: payload.content,
          name: payload.path.split('/').pop() || 'Untitled'
        });
      }
    };

    const interval = setInterval(() => {
      channel.postMessage({ type: 'GET_FILES' });
    }, 2000);

    return () => {
      channel.close();
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    channelRef.current?.postMessage({ type: 'GET_FILES' });
  };

  const handleCreate = () => {
    if (!newName) return;
    channelRef.current?.postMessage({ type: 'CREATE_FILE', payload: { name: newName } });
    setNewName('');
    setIsCreating(null);
  };

  const handleDeleteFile = (path: string) => {
    if (confirm(`Delete ${path}?`)) {
      channelRef.current?.postMessage({ type: 'DELETE_FILE', payload: { path } });
    }
  };

  const handleOpenFile = (file: FileItem) => {
    if (file.type === 'file') {
      channelRef.current?.postMessage({ type: 'READ_FILE', payload: { path: file.id } });
    }
  };

  const handleSaveFile = () => {
    if (activeFile) {
      channelRef.current?.postMessage({ 
        type: 'WRITE_FILE', 
        payload: { path: activeFile.path, content: activeFile.content } 
      });
      alert('File saved to Terminal OS!');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-100/50 border-r border-neutral-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-lg tracking-tight">PyBrowser FM</span>
        </div>

        <nav className="flex-1 space-y-6">
          <section>
            <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-3">Locations</h2>
            <div className="space-y-1">
              <NavItem icon={<HardDrive size={18}/>} label="Terminal Storage" active />
              <NavItem icon={<Cloud size={18}/>} label="Cloud Sync" disabled />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-3">Favorites</h2>
            <div className="space-y-1">
              <NavItem icon={<Star size={18}/>} label="Starred" />
              <NavItem icon={<Clock size={18}/>} label="Recent" />
            </div>
          </section>
        </nav>

        {!isConnected && (
          <div className="mt-auto p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-[11px] font-medium leading-tight">
              Terminal OS is not active. Please open Terminal OS in another tab to manage files.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Toolbar */}
        <div className="h-16 border-b border-neutral-200 flex items-center px-6 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {activeFile && (
              <button onClick={() => setActiveFile(null)} className="p-2 hover:bg-neutral-100 rounded-full">
                <ArrowLeft size={18} />
              </button>
            )}
            <h1 className="text-sm font-bold truncate">
              {activeFile ? activeFile.path : 'Standalone File Manager'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {activeFile ? (
              <>
                <button 
                  onClick={handleSaveFile}
                  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold uppercase rounded-lg transition-all"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button onClick={handleRefresh} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"><RefreshCw size={18} /></button>
                <div className="w-[1px] h-6 bg-neutral-200 mx-1" />
                <button onClick={() => setIsCreating('file')} className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase rounded-lg transition-all">
                  <Plus size={14} />
                  New File
                </button>
              </>
            )}
          </div>
        </div>

        {/* View Area */}
        <div className="flex-1 overflow-y-auto">
          {activeFile ? (
            <div className="h-full flex flex-col">
              <textarea
                autoFocus
                className="flex-1 p-8 font-mono text-sm leading-relaxed outline-none w-full bg-white text-neutral-800 resize-none"
                value={activeFile.content}
                onChange={(e) => setActiveFile({ ...activeFile, content: e.target.value })}
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="p-6">
              {isCreating && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-neutral-200 flex items-center justify-center text-emerald-500">
                      <Plus size={20} />
                    </div>
                    <div className="flex-1">
                      <input 
                        autoFocus
                        placeholder="Enter filename (e.g. main.py)"
                        className="w-full bg-transparent border-none outline-none font-bold text-lg"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setIsCreating(null)} className="p-2 text-neutral-400 hover:text-neutral-600"><X size={20} /></button>
                      <button onClick={handleCreate} className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm">Create</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{files.length} Items</span>
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                   <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}><LayoutGrid size={16}/></button>
                   <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}><List size={16}/></button>
                </div>
              </div>

              <div className={`grid ${view === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'}`}>
                {files.map(file => (
                  <div 
                    key={file.id} 
                    onClick={() => handleOpenFile(file)}
                    className={`group relative flex items-center bg-white border border-transparent hover:border-neutral-200 hover:shadow-xl hover:shadow-neutral-200/50 rounded-2xl transition-all cursor-pointer ${view === 'list' ? 'p-3 mb-2 border-neutral-100 hover:bg-neutral-50' : 'flex-col p-6 text-center'}`}
                  >
                    <div className={`${view === 'list' ? 'w-10 h-10 mr-4' : 'w-20 h-20 mb-4'} rounded-2xl bg-neutral-50 flex items-center justify-center transition-colors group-hover:bg-white`}>
                      {file.type === 'folder' ? 
                        <Folder className="text-blue-500" size={view === 'list' ? 20 : 32} /> : 
                        <FileText className="text-emerald-500" size={view === 'list' ? 20 : 32} />
                      }
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="font-bold text-sm truncate text-neutral-800">{file.name}</div>
                      <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-tighter mt-0.5">{file.size} • {file.type}</div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                      className="absolute right-3 opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {files.length === 0 && !isCreating && (
                <div className="flex flex-col items-center justify-center py-24 text-neutral-300">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <p className="font-bold tracking-tight">No files found</p>
                  <p className="text-sm">Start by creating a new file from the toolbar</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, disabled }: { icon: React.ReactNode, label: string, active?: boolean, disabled?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
      active ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/20' : 
      disabled ? 'opacity-30 cursor-not-allowed' : 'text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-800'
    }`}>
      <span className={active ? 'text-emerald-400' : ''}>{icon}</span>
      <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
    </div>
  );
}
