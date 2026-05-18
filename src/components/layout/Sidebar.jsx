import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  ScanLine,
  FileText,
  Trees,
  Brain,
  User,
  LogOut,
  X 
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/nova-analise', label: 'Nova Análise', icon: ScanLine },
  { path: '/registros', label: 'Registros', icon: FileText },
  { path: '/plantacoes', label: 'Plantações', icon: Trees },
  { path: '/ia', label: 'IA', icon: Brain },
  { path: '/perfil', label: 'Perfil', icon: User },
];

export default function Sidebar({ isOpen, onClose, userName }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    window.location.href = '/';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-border">

      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-yellow-sm">
              <Brain className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h1 className="font-orbitron text-lg font-bold tracking-wider text-foreground">
                Sylva<span className="text-primary">AI</span>
              </h1>

              <p className="text-[10px] font-rajdhani text-muted-foreground tracking-widest uppercase">
                Forest Intelligence
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-inter transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 glow-yellow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon
                className={`w-4.5 h-4.5 ${
                  isActive
                    ? 'text-primary'
                    : 'group-hover:text-primary/70'
                }`}
              />

              <span className="font-medium">{item.label}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">

          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-orbitron text-primary font-bold">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-inter text-foreground truncate">
              {userName || 'Usuário'}
            </p>

            <p className="text-[10px] text-muted-foreground font-rajdhani">
              Online
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-inter"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}