import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 glow-yellow-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-orbitron text-xl font-bold text-foreground">Sylva</span>
              <span className="font-orbitron text-xl font-bold text-primary">AI</span>
              <p className="font-rajdhani text-xs text-muted-foreground tracking-widest uppercase">Forest Inteligence</p>
            </div>
          </div>
        </div>

        <h1 className="font-orbitron text-2xl font-bold text-center text-foreground mb-1">Recuperar senha</h1>
        <p className="font-inter text-sm text-muted-foreground text-center mb-6">
          Digite seu e-mail para receber o link de recuperação
        </p>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-primary fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="font-inter text-sm text-foreground">
              Link de recuperação enviado para <span className="text-primary font-semibold">{email}</span>
            </p>
            <p className="font-inter text-xs text-muted-foreground">
              Verifique sua caixa de entrada e spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-inter text-sm text-foreground mb-1.5 block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-orbitron font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed tracking-wider"
            >
              {loading ? 'ENVIANDO...' : 'Enviar link de recuperação'}
            </button>
          </form>
        )}

        <p className="font-inter text-sm text-muted-foreground text-center mt-6">
          Lembrou sua senha?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
