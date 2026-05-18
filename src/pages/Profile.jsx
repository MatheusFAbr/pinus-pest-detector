import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedUser) {
      setUser(savedUser);
    } else {
      setUser({
        full_name: 'Usuário SylvaAI',
        email: 'usuario@sylvaai.com',
        role: 'Administrador',
        created_date: new Date().toISOString(),
      });
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wide">
          Perfil
        </h1>

        <p className="text-sm text-muted-foreground font-inter mt-1">
          Suas informações de conta
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-8 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-4 glow-yellow-sm">
          <span className="font-orbitron text-2xl text-primary font-bold">
            {user?.full_name?.charAt(0)?.toUpperCase() ||
              user?.email?.charAt(0)?.toUpperCase() ||
              'U'}
          </span>
        </div>

        <h2 className="font-exo text-xl font-semibold">
          {user?.full_name || 'Usuário'}
        </h2>

        <p className="text-sm text-muted-foreground font-inter mt-1">
          {user?.email}
        </p>

        <div className="flex items-center justify-center gap-2 mt-3">
          <Shield className="w-3.5 h-3.5 text-primary" />

          <span className="text-xs font-rajdhani text-primary uppercase tracking-wider">
            {user?.role || 'Usuário'}
          </span>
        </div>
      </motion.div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Informações
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
            <User className="w-5 h-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground font-inter">
                Nome
              </p>

              <p className="text-sm font-inter font-medium">
                {user?.full_name || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
            <Mail className="w-5 h-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground font-inter">
                Email
              </p>

              <p className="text-sm font-inter font-medium">
                {user?.email || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
            <Calendar className="w-5 h-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground font-inter">
                Membro desde
              </p>

              <p className="text-sm font-inter font-medium">
                {user?.created_date
                  ? new Date(user.created_date).toLocaleDateString('pt-BR')
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 font-inter py-5"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sair da conta
      </Button>
    </div>
  );
}