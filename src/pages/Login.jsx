import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Brain } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
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

        <h1 className="font-orbitron text-2xl font-bold text-center text-foreground mb-1">Entrar</h1>
        <p className="font-inter text-sm text-muted-foreground text-center mb-6">
          Acesse sua conta para continuar
        </p>

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

          <div>
            <label className="font-inter text-sm text-foreground mb-1.5 block">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 pr-11 font-inter text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/recuperar-senha"
              className="font-inter text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {error && (
            <p className="font-inter text-sm text-destructive text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-orbitron font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed tracking-wider"
          >
            {loading ? 'ENTRANDO...' : 'Entrar'}
          </button>
        </form>

        <p className="font-inter text-sm text-muted-foreground text-center mt-6">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-primary font-semibold hover:text-primary/80 transition-colors">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
