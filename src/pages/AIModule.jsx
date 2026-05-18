import React from 'react';
import api from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Brain, Cpu, Activity, BarChart3, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export default function AIModule() {
  const { data: analyses = [] } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
  const response = await api.get('/analyses');
  return response.data;
},
  });

  const totalAnalyses = analyses.length;
  const avgConfidence = totalAnalyses > 0
    ? (analyses.reduce((s, a) => s + (a.confiancaIA || 0), 0) / totalAnalyses).toFixed(1)
    : 0;

  const models = [
    { name: 'TensorFlow.js', version: '4.x', status: 'Ativo', icon: Brain },
    { name: 'YOLO v8', version: '8.0', status: 'Integrado', icon: Cpu },
    { name: 'Visão Computacional', version: '2.1', status: 'Online', icon: Activity },
  ];

  const metrics = [
    { label: 'Análises Processadas', value: totalAnalyses, max: 1000, color: 'bg-primary' },
    { label: 'Precisão Média', value: Number(avgConfidence), max: 100, color: 'bg-green-500' },
    { label: 'Treinamento Modelo', value: 87, max: 100, color: 'bg-blue-500' },
    { label: 'Otimização', value: 94, max: 100, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wide">
          Módulo <span className="text-primary text-glow">IA</span>
        </h1>
        <p className="text-sm text-muted-foreground font-inter mt-1">
          Monitoramento dos modelos de inteligência artificial
        </p>
      </motion.div>

      {/* AI Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-primary/20 rounded-xl p-8 glow-yellow overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative flex items-center gap-6 flex-wrap">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
            <Brain className="w-10 h-10 text-primary ai-pulse" />
          </div>
          <div>
            <h2 className="font-orbitron text-xl font-bold mb-1">SylvaAI Engine</h2>
            <p className="text-sm text-muted-foreground font-inter">
              Sistema de detecção de pragas florestais com visão computacional
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-rajdhani text-green-400 uppercase tracking-wider">Sistema Operacional</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Models */}
      <div>
        <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Modelos Ativos
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {models.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all hover:glow-yellow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs font-rajdhani text-green-400">{m.status}</span>
                </div>
              </div>
              <h4 className="font-exo font-semibold text-base">{m.name}</h4>
              <p className="text-xs text-muted-foreground font-inter mt-1">Versão {m.version}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div>
        <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Métricas de Performance
        </h3>
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-inter text-muted-foreground">{m.label}</span>
                <span className="text-sm font-rajdhani font-semibold text-foreground">
                  {m.label.includes('Precisão') || m.label.includes('Treinamento') || m.label.includes('Otimização')
                    ? `${m.value}%`
                    : m.value}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.value / m.max) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  className={`h-full rounded-full ${m.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Stack Tecnológica
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['TensorFlow.js', 'YOLO v8', 'Computer Vision', 'Deep Learning'].map((tech, i) => (
            <div key={tech} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/30 transition-all">
              <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs font-inter font-medium">{tech}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}