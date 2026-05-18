import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Trees, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const emptyForm = { nome: '', cidade: '', endereco: '', areaM2: '', dataCadastro: '' };

export default function Plantations() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const [plantations, setPlantations] = useState(() => {
    const saved = localStorage.getItem('plantations');
    return saved ? JSON.parse(saved) : [];
  });

  const queryClient = useQueryClient();

  const { data = plantations, isLoading } = useQuery({
    queryKey: ['plantations'],
    queryFn: async () => plantations,
  });

  const savePlantations = (updated) => {
    setPlantations(updated);
    localStorage.setItem('plantations', JSON.stringify(updated));
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const newPlantation = {
        id: crypto.randomUUID(),
        ...data,
      };

      const updated = [newPlantation, ...plantations];
      savePlantations(updated);

      return newPlantation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantations'] });
      closeModal();
      toast.success('Plantação criada!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const updated = plantations.map((p) =>
        p.id === id ? { ...p, ...data } : p
      );

      savePlantations(updated);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantations'] });
      closeModal();
      toast.success('Plantação atualizada!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const updated = plantations.filter((p) => p.id !== id);
      savePlantations(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantations'] });
      toast.success('Plantação excluída!');
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openEdit = (p) => {
    setForm({
      nome: p.nome || '',
      cidade: p.cidade || '',
      endereco: p.endereco || '',
      areaM2: p.areaM2 || '',
      dataCadastro: p.dataCadastro || '',
    });

    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...form,
      areaM2: form.areaM2 ? Number(form.areaM2) : null,
      dataCadastro:
        form.dataCadastro || new Date().toISOString().split('T')[0],
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = data.filter(
    (p) =>
      !search ||
      p.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.cidade?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wide">
            Plantações
          </h1>

          <p className="text-sm text-muted-foreground font-inter mt-1">
            Gerencie suas plantações de pinus
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-inter glow-yellow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Plantação
        </Button>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        <Input
          placeholder="Buscar plantação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border font-inter"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12 font-inter">
          Carregando...
        </p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Trees className="w-12 h-12 text-muted-foreground mx-auto mb-3" />

          <p className="text-muted-foreground font-inter">
            Nenhuma plantação cadastrada.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:glow-yellow-sm group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Trees className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(p.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-exo text-lg font-semibold mb-1">
                  {p.nome}
                </h3>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-inter">{p.cidade}</span>
                </div>

                {p.endereco && (
                  <p className="text-xs text-muted-foreground font-inter mb-2">
                    {p.endereco}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground font-rajdhani">
                  {p.areaM2 && (
                    <span>
                      {Number(p.areaM2).toLocaleString('pt-BR')} m²
                    </span>
                  )}

                  <span>{p.dataCadastro || '—'}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={(v) => !v && closeModal()}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-lg">
              {editingId ? 'Editar Plantação' : 'Nova Plantação'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-inter text-sm">Nome *</Label>

              <Input
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
                required
                className="bg-secondary border-border font-inter mt-1"
              />
            </div>

            <div>
              <Label className="font-inter text-sm">Cidade *</Label>

              <Input
                value={form.cidade}
                onChange={(e) =>
                  setForm({ ...form, cidade: e.target.value })
                }
                required
                className="bg-secondary border-border font-inter mt-1"
              />
            </div>

            <div>
              <Label className="font-inter text-sm">Endereço</Label>

              <Input
                value={form.endereco}
                onChange={(e) =>
                  setForm({ ...form, endereco: e.target.value })
                }
                className="bg-secondary border-border font-inter mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-inter text-sm">Área (m²)</Label>

                <Input
                  type="number"
                  value={form.areaM2}
                  onChange={(e) =>
                    setForm({ ...form, areaM2: e.target.value })
                  }
                  className="bg-secondary border-border font-inter mt-1"
                />
              </div>

              <div>
                <Label className="font-inter text-sm">
                  Data Cadastro
                </Label>

                <Input
                  type="date"
                  value={form.dataCadastro}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dataCadastro: e.target.value,
                    })
                  }
                  className="bg-secondary border-border font-inter mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1 border-border font-inter"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-inter"
              >
                {editingId ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}