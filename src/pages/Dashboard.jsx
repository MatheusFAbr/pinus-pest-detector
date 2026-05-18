import React from 'react';
import api from '@/api';
import { useQuery } from '@tanstack/react-query';
import { ScanLine, TreePine, Bug, Brain, Trees } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { ResultsPieChart, TimelineChart } from '@/components/dashboard/DashboardCharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: analyses = [] } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
  const response = await api.get('/analyses');
  return response.data.sort(
    (a, b) => new Date(b.created_date) - new Date(a.created_date)
  );
},
  });

  const { data: plantations = [] } = useQuery({
    queryKey: ['plantations'],
    queryFn: async () => {
  const response = await api.get('/plantations');
  return response.data;
},
  });

  const healthy = analyses.filter(a => a.resultado === 'saudavel').length;
  const infested = analyses.filter(a => a.resultado === 'infestada').length;
  const avgConfidence = analyses.length > 0
    ? (analyses.reduce((s, a) => s + (a.confiancaIA || 0), 0) / analyses.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wide">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-inter mt-1">
          Monitoramento inteligente de plantações florestais
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total de Análises" value={analyses.length} icon={ScanLine} accent delay={0} />
        <StatCard label="Árvores Saudáveis" value={healthy} icon={TreePine} delay={0.05} />
        <StatCard label="Árvores Infestadas" value={infested} icon={Bug} delay={0.1} />
        <StatCard label="Precisão da IA" value={`${avgConfidence}%`} icon={Brain} accent delay={0.15} />
        <StatCard label="Plantações" value={plantations.length} icon={Trees} delay={0.2} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <ResultsPieChart healthy={healthy} infested={infested} />
        <TimelineChart analyses={analyses} />
      </div>

      {/* Recent Analyses */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Últimas Análises
        </h3>
        {analyses.length === 0 ? (
          <p className="text-sm text-muted-foreground font-inter text-center py-8">
            Nenhuma análise realizada ainda. Comece uma nova análise.
          </p>
        ) : (
          <div className="space-y-3">
            {analyses.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {a.urlImagem ? (
                    <img src={a.urlImagem} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <ScanLine className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-inter font-medium">{a.plantacaoNome || 'Sem plantação'}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.dataHora ? new Date(a.dataHora).toLocaleString('pt-BR') : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-rajdhani font-semibold px-2.5 py-1 rounded-full ${
                    a.resultado === 'saudavel'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {a.resultado === 'saudavel' ? 'SAUDÁVEL' : 'INFESTADA'}
                  </span>
                  <span className="text-xs text-muted-foreground font-rajdhani">
                    {a.confiancaIA ? `${a.confiancaIA}%` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}