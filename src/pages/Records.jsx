import React, { useState, useMemo, useRef, useEffect } from 'react';
import api from "@/api";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search, FileDown, ChevronLeft, ChevronRight, ScanLine,
  AlignJustify, Pencil, RotateCcw, Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// ── Menu de ações por linha ──────────────────────────────────────────────────
function RowMenu({ analysis, onEdit, onReanalyze, onDeleteRequest }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right - 176 });
    }
    setOpen(v => !v);
  };

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
            className="z-[9999] w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            <button
              onClick={() => { setOpen(false); onEdit(analysis); }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-inter text-foreground hover:bg-secondary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              Editar
            </button>
            <button
              onClick={() => { setOpen(false); onReanalyze(analysis); }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-inter text-foreground hover:bg-secondary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
              Refazer análise
            </button>
            <div className="border-t border-border" />
            <button
              onClick={() => { setOpen(false); onDeleteRequest(analysis); }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-inter text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Modal de edição ──────────────────────────────────────────────────────────
function EditModal({ analysis, onClose, onSave }) {
  const [form, setForm] = useState({
    plantacaoNome: analysis?.plantacaoNome || '',
    coordenada: analysis?.coordenada || '',
    resultado: analysis?.resultado || 'saudavel',
    confiancaIA: analysis?.confiancaIA || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(analysis.id, { ...form, confiancaIA: Number(form.confiancaIA) });
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-lg">Editar Registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="font-inter text-sm">Plantação</Label>
            <Input value={form.plantacaoNome} onChange={e => setForm({ ...form, plantacaoNome: e.target.value })} className="bg-secondary border-border font-inter mt-1" />
          </div>
          <div>
            <Label className="font-inter text-sm">Coordenadas</Label>
            <Input value={form.coordenada} onChange={e => setForm({ ...form, coordenada: e.target.value })} className="bg-secondary border-border font-inter mt-1" />
          </div>
          <div>
            <Label className="font-inter text-sm">Resultado</Label>
            <Select value={form.resultado} onValueChange={v => setForm({ ...form, resultado: v })}>
              <SelectTrigger className="bg-secondary border-border font-inter mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saudavel">Saudável</SelectItem>
                <SelectItem value="infestada">Infestada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-inter text-sm">Nível de Infestação (%)</Label>
            <Input type="number" min="0" max="100" value={form.confiancaIA} onChange={e => setForm({ ...form, confiancaIA: e.target.value })} className="bg-secondary border-border font-inter mt-1" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-border font-inter">Cancelar</Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-inter">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Modal de confirmação de exclusão ─────────────────────────────────────────
function DeleteModal({ analysis, onClose, onConfirm }) {
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <p className="text-sm font-inter text-muted-foreground">
            Tem certeza que deseja excluir o registro da plantação{' '}
            <span className="text-foreground font-semibold">{analysis?.plantacaoNome || 'N/A'}</span>?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border font-inter">Cancelar</Button>
            <Button onClick={() => onConfirm(analysis.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-inter">
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function Records() {
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [page, setPage] = useState(0);
  const [editingAnalysis, setEditingAnalysis] = useState(null);
  const [deletingAnalysis, setDeletingAnalysis] = useState(null);
  const perPage = 10;
  const queryClient = useQueryClient();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const res = await api.get('/analyses');
      return res.data;
    },
  });

  const filtered = useMemo(() => {
    return analyses.filter(a => {
      const matchSearch = !search ||
        a.plantacaoNome?.toLowerCase().includes(search.toLowerCase()) ||
        a.coordenada?.includes(search);
      const matchFilter = filterResult === 'all' || a.resultado === filterResult;
      return matchSearch && matchFilter;
    });
  }, [analyses, search, filterResult]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDelete = async (id) => {
    await api.delete(`/analyses/${id}`);
    queryClient.invalidateQueries({ queryKey: ['analyses'] });
    setDeletingAnalysis(null);
    toast.success('Registro excluído.');
  };

  const handleEdit = async (id, data) => {
    await api.put(`/analyses/${id}`, data);
    queryClient.invalidateQueries({ queryKey: ['analyses'] });
    setEditingAnalysis(null);
    toast.success('Registro atualizado.');
  };

  const handleReanalyze = (analysis) => {
    toast.info('Redirecionando para nova análise...');
    setTimeout(() => { window.location.href = '/nova-analise'; }, 800);
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('SylvaAI — Relatório de Análises', 14, 20);
    doc.setFontSize(10);
    let y = 35;
    filtered.forEach((a, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(
        `${i + 1}. ${a.plantacaoNome || 'N/A'} | ${a.resultado?.toUpperCase()} | ${a.confiancaIA || 0}% | ${a.dataHora ? new Date(a.dataHora).toLocaleDateString('pt-BR') : '—'} | ${a.coordenada || 'N/A'}`,
        14, y
      );
      y += 8;
    });
    doc.save('sylvaai-relatorio.pdf');
    toast.success('PDF exportado!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wide">Registros</h1>
        <p className="text-sm text-muted-foreground font-inter mt-1">
          Histórico de todas as análises realizadas
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por plantação ou coordenada..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-10 bg-card border-border font-inter"
          />
        </div>
        <Select value={filterResult} onValueChange={(v) => { setFilterResult(v); setPage(0); }}>
          <SelectTrigger className="w-40 bg-card border-border font-inter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="saudavel">Saudável</SelectItem>
            <SelectItem value="infestada">Infestada</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportPDF} className="border-border font-inter">
          <FileDown className="w-4 h-4 mr-2" /> Exportar PDF
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-inter">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider">Imagem</th>
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider">Data</th>
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider">Resultado</th>
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider hidden md:table-cell">Plantação</th>
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider hidden lg:table-cell">Coordenadas</th>
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider">Infestação</th>
                <th className="text-left p-4 text-muted-foreground font-exo uppercase text-xs tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">Carregando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">Nenhum registro encontrado.</td></tr>
              ) : (
                paginated.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      {a.urlImagem ? (
                        <img src={a.urlImagem} alt="" className="w-10 h-10 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <ScanLine className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {a.dataHora ? new Date(a.dataHora).toLocaleString('pt-BR') : '—'}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-rajdhani font-semibold px-2.5 py-1 rounded-full ${
                        a.resultado === 'saudavel'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {a.resultado === 'saudavel' ? 'SAUDÁVEL' : 'INFESTADA'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{a.plantacaoNome || '—'}</td>
                    <td className="p-4 text-muted-foreground text-xs hidden lg:table-cell font-mono">{a.coordenada || '—'}</td>
                    <td className="p-4">
                      {a.confiancaIA != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${a.resultado === 'infestada' ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(a.confiancaIA, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-rajdhani font-semibold text-muted-foreground">
                            {a.confiancaIA}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <RowMenu
                        analysis={a}
                        onEdit={setEditingAnalysis}
                        onReanalyze={handleReanalyze}
                        onDeleteRequest={setDeletingAnalysis}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-inter">
              Mostrando {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} de {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="border-border">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="border-border">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingAnalysis && (
        <EditModal
          analysis={editingAnalysis}
          onClose={() => setEditingAnalysis(null)}
          onSave={handleEdit}
        />
      )}
      {deletingAnalysis && (
        <DeleteModal
          analysis={deletingAnalysis}
          onClose={() => setDeletingAnalysis(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}