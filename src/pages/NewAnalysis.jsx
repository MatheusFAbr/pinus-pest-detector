import React, { useState, useRef } from 'react';
import api from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, ScanLine, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Mapa simulado: nome do arquivo → resultado
const SIMULATED_RESULTS = {
  'img1.png': {
    resultado: 'saudavel',
    confianca: 96.4,
    detalhes: 'Análise: nenhuma evidência de infestação detectada. Árvores com aparência saudável, sem sinais de oviposição ou resina anormal.',
  },
  'img2.png': {
    resultado: 'infestada',
    confianca: 91.8,
    detalhes: 'Análise: presença de marcas características da vespa-da-madeira (Sirex noctilio) detectada. Recomenda-se inspeção presencial imediata.',
  },
};

export default function NewAnalysis() {
  const [selectedPlantation, setSelectedPlantation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: plantations = [] } = useQuery({
    queryKey: ['plantations'],
    queryFn: async () => {
  const response = await api.get('/plantations');
  return response.data;
},
  });

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const getCoordinates = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`),
          () => resolve('N/A')
        );
      } else {
        resolve('N/A');
      }
    });
  };

  const processAnalysis = async () => {
    if (!imageFile) {
      toast.error('Selecione uma imagem primeiro.');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Simula tempo de processamento
    await new Promise((r) => setTimeout(r, 2000));

    const coordenada = await getCoordinates();

    // Resultado simulado baseado no nome do arquivo
    const fileName = imageFile.name.toLowerCase();
    const simulated = SIMULATED_RESULTS[fileName];

    const aiResult = simulated ?? {
      resultado: Math.random() > 0.5 ? 'saudavel' : 'infestada',
      confianca: Number((70 + Math.random() * 25).toFixed(1)),
      detalhes: 'Análise: resultado gerado com base em parâmetros padrão do modelo beta.',
    };

    // Upload da imagem
    let file_url = '';

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      file_url = uploadResponse.data.file_url;
    } catch (_) {}

    const plantation = plantations.find(p => p.id === selectedPlantation);

    try {
      await api.post('/analyses', {
        plantacaoId: selectedPlantation || '',
        plantacaoNome: plantation?.nome || 'Não especificada',
        nomeImagem: imageFile.name,
        dataHora: new Date().toISOString(),
        resultado: aiResult.resultado,
        urlImagem: file_url,
        coordenada,
        confiancaIA: aiResult.confianca,
      });
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    } catch (_) {}
    setResult({ ...aiResult });
    setIsProcessing(false);
    toast.success('Análise concluída!');
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setSelectedPlantation('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wide">Nova Análise</h1>
        <p className="text-sm text-muted-foreground font-inter mt-1">
          Capture ou envie uma imagem para análise com IA
        </p>
      </motion.div>

      {/* Plantation selector */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <label className="text-sm font-exo text-muted-foreground uppercase tracking-wider">
          Selecionar Plantação
        </label>
        <Select value={selectedPlantation} onValueChange={setSelectedPlantation}>
          <SelectTrigger className="bg-secondary border-border font-inter">
            <SelectValue placeholder="Selecione uma plantação *" />
          </SelectTrigger>
          <SelectContent>
            {plantations.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.nome} — {p.cidade}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image capture */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <label className="text-sm font-exo text-muted-foreground uppercase tracking-wider">
          Imagem para Análise
        </label>

        {!imagePreview ? (
          <>
          <div className="grid grid-cols-2 gap-4">
            <button
              disabled={!selectedPlantation}
              onClick={() => cameraInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all ${
                selectedPlantation
                  ? 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                  : 'border-border/40 opacity-40 cursor-not-allowed'
              }`}
            >
              <Camera className="w-8 h-8 text-primary" />
              <span className="text-sm font-inter text-muted-foreground">Câmera</span>
            </button>
            <button
              disabled={!selectedPlantation}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all ${
                selectedPlantation
                  ? 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                  : 'border-border/40 opacity-40 cursor-not-allowed'
              }`}
            >
              <Upload className="w-8 h-8 text-primary" />
              <span className="text-sm font-inter text-muted-foreground">Upload</span>
            </button>
          </div>
          {!selectedPlantation && (
            <p className="text-xs text-amber-400/80 font-inter text-center -mt-2">
              Selecione uma plantação para habilitar o envio de imagens.
            </p>
          )}
          </>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-contain bg-black/50" />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 border-2 border-primary/30 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-rajdhani text-primary tracking-widest uppercase animate-pulse">
                  Processando...
                </p>
              </div>
            )}
            {!isProcessing && (
              <button
                onClick={resetForm}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg text-xs font-inter"
              >
                Remover
              </button>
            )}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl p-6 border ${
              result.resultado === 'saudavel'
                ? 'bg-green-500/5 border-green-500/30'
                : 'bg-red-500/5 border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              {result.resultado === 'saudavel' ? (
                <CheckCircle2 className="w-10 h-10 text-green-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-400 shrink-0" />
              )}
              <div>
                <p className="font-orbitron text-xl font-bold">
                  {result.resultado === 'saudavel' ? 'SAUDÁVEL' : 'INFESTADA'}
                </p>
                <p className="text-sm text-muted-foreground font-inter">
                  Nível de confiança: <span className="text-primary font-semibold">{result.confianca}%</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-inter">{result.detalhes}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action button */}
      <div className="flex gap-4">
        {!result ? (
          <Button
            onClick={processAnalysis}
            disabled={!imageFile || isProcessing}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron tracking-wider py-6 text-base glow-yellow"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <ScanLine className="w-5 h-5 mr-2" />
                Iniciar Análise com IA
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={resetForm}
            className="w-full bg-secondary text-foreground hover:bg-secondary/80 font-orbitron tracking-wider py-6 text-base"
          >
            Nova Análise
          </Button>
        )}
      </div>
    </div>
  );
}