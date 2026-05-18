import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#FFD600', '#3b82f6', '#ef4444', '#22c55e'];

export function ResultsPieChart({ healthy, infested }) {
  const data = [
    { name: 'Saudáveis', value: healthy || 0 },
    { name: 'Infestadas', value: infested || 0 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Distribuição de Resultados
      </h3>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={index === 0 ? '#22c55e' : '#ef4444'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1a1a1a',
                border: '1px solid #2d2d2d',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#b3b3b3' }}
              labelStyle={{ color: '#b3b3b3' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground font-inter">Saudáveis ({healthy})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground font-inter">Infestadas ({infested})</span>
        </div>
      </div>
    </div>
  );
}

export function TimelineChart({ analyses }) {
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayAnalyses = analyses.filter(a => a.dataHora?.startsWith(dateStr));
    last7.push({
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      total: dayAnalyses.length,
      infestadas: dayAnalyses.filter(a => a.resultado === 'infestada').length,
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-exo text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Análises nos Últimos 7 Dias
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={last7}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#b3b3b3' }} axisLine={{ stroke: '#2d2d2d' }} />
          <YAxis tick={{ fontSize: 11, fill: '#b3b3b3' }} axisLine={{ stroke: '#2d2d2d' }} />
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #2d2d2d',
              borderRadius: '8px',
              color: '#b3b3b3',
              fontSize: '12px',
            }}
          />
          <Line type="monotone" dataKey="total" stroke="#FFD600" strokeWidth={2} dot={{ fill: '#FFD600', r: 4 }} />
          <Line type="monotone" dataKey="infestadas" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground font-inter">Total</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground font-inter">Infestadas</span>
        </div>
      </div>
    </div>
  );
}