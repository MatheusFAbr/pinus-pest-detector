import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 glow-yellow-sm">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-orbitron text-6xl font-bold text-primary mb-2">404</h1>
        <p className="font-inter text-muted-foreground mb-8">Página não encontrada</p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-inter glow-yellow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}