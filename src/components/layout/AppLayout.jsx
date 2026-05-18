import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    setUserName(
      savedUser?.full_name ||
      savedUser?.email ||
      'Usuário'
    );
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userName={userName}
      />
      
      <div className="lg:pl-64 min-h-screen">
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="font-orbitron text-sm font-bold tracking-wider">
              Sylva<span className="text-primary">AI</span>
            </h1>

            <div className="w-9" />
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}