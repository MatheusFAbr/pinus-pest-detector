# 🌲 Sistema de Detecção de Vespa-da-Madeira

> Sistema web para detecção precoce de ninhos da vespa-da-madeira (Sirex noctilio) em plantações de pinus, utilizando visão computacional e inteligência artificial.

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido como Projeto Integrador (PI) do curso de Desenvolvimento de Software Multiplataforma (DSM) da FATEC Registro. O objetivo é auxiliar pequenos e médios produtores de pinus da região do Vale do Ribeira a identificar rapidamente árvores infestadas pela vespa-da-madeira, praga que pode causar perdas de até 80% na produção.

**Problema resolvido:** A detecção atual é manual e tardia, feita apenas quando os sintomas já estão avançados. O sistema automatiza esse processo usando IA para analisar imagens das árvores.

---

## ✨ Funcionalidades

- **Autenticação** - Login, cadastro e recuperação de senha (Firebase Auth)
- **Nova Análise** - Captura de foto via câmera, detecção por IA (INFESTADA/SAUDÁVEL) e captura de GPS
- **Registros** - Tabela histórica com filtros (resultado/mês), paginação e edição/exclusão de registros
- **Dashboard** - Gráfico circular com percentual de infestação e resumo numérico
- **Plantações** - Cadastro e gestão de fazendas/sítios (nome, cidade, endereço, área)
- **Perfil** - Edição de dados do usuário
- **Exportação** - Relatórios em PDF
- **Coordenada clicável** - Abre Google Maps diretamente na localização da análise

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Front-end | HTML, CSS, JavaScript puro |
| Banco de Dados | Firebase Firestore |
| Armazenamento | Firebase Storage |
| Autenticação | Firebase Authentication |
| IA/Visão Computacional | TensorFlow.js + YOLO |
| Gráficos | Chart.js |
| PDF | jsPDF |

---

## 📋 Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge)
- Acesso à internet para carregar os recursos do Firebase
- Conta no Firebase (gratuita) para configurar o backend

---

## ⚙️ Configuração e Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/pest-detection-system.git
