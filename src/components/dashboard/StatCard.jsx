import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:glow-yellow-sm group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${accent ? 'bg-primary/10' : 'bg-secondary'}`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </div>
      <p className="font-orbitron text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm font-inter text-muted-foreground">{label}</p>
    </motion.div>
  );
}