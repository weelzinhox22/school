import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocation } from "wouter";
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  Briefcase,
  Users,
  Download,
  Calendar,
  Receipt,
  CreditCard,
  Wallet,
  BarChart2,
  PieChart as PieChartIcon,
  ArrowLeft,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  User
} from "lucide-react";
import ContractView from "../components/ContractView";
import ContractEdit from "../components/ContractEdit";
// Importando os componentes modulares
import VisaoGeralFinanceira from "../components/financeiro/VisaoGeralFinanceira";
import GestaoMensalidades from "../components/financeiro/GestaoMensalidades";
// Importando o novo componente de gestão de inadimplência
import GestaoInadimplencia from "../components/financeiro/GestaoInadimplencia";
import GestaoOrcamento from "../components/financeiro/GestaoOrcamento";
import GestaoFolhaPagamento from "../components/financeiro/GestaoFolhaPagamento";
import GestaoFluxoCaixa from "../components/financeiro/GestaoFluxoCaixa";
import GestaoContratos from "../components/financeiro/GestaoContratos";

// Dados mock para simulação
const mockReceitas = [
  { mes: "Jan", valor: 150000 },
  { mes: "Fev", valor: 165000 },
  { mes: "Mar", valor: 180000 },
  { mes: "Abr", valor: 175000 },
  { mes: "Mai", valor: 190000 },
  { mes: "Jun", valor: 185000 },
];

const mockDespesas = [
  { mes: "Jan", valor: 120000 },
  { mes: "Fev", valor: 125000 },
  { mes: "Mar", valor: 130000 },
  { mes: "Abr", valor: 128000 },
  { mes: "Mai", valor: 135000 },
  { mes: "Jun", valor: 132000 },
];

const mockCategorias = [
  { name: "Mensalidades", value: 65 },
  { name: "Material Didático", value: 15 },
  { name: "Atividades Extras", value: 10 },
  { name: "Outros", value: 10 },
];

const mockMensalidades = [
  { id: 1, aluno: "João Silva", turma: "9º Ano A", valor: 850, status: "Pago", vencimento: "2024-03-10" },
  { id: 2, aluno: "Maria Santos", turma: "8º Ano B", valor: 850, status: "Pendente", vencimento: "2024-03-10" },
  { id: 3, aluno: "Pedro Oliveira", turma: "7º Ano A", valor: 850, status: "Atrasado", vencimento: "2024-02-10" },
  { id: 4, aluno: "Ana Costa", turma: "9º Ano B", valor: 850, status: "Pago", vencimento: "2024-03-10" },
];

// Dados mock para inadimplência
const mockInadimplencia = [
  { mes: "Jan", taxa: 4.2, valor: 12600 },
  { mes: "Fev", taxa: 4.5, valor: 13500 },
  { mes: "Mar", taxa: 5.2, valor: 16200 },
  { mes: "Abr", taxa: 4.8, valor: 14400 },
  { mes: "Mai", taxa: 4.3, valor: 13200 },
  { mes: "Jun", taxa: 5.2, valor: 16800 },
];

// Dados mock para orçamento
const mockOrcamento = [
  { categoria: "Salários", previsto: 620000, realizado: 635000 },
  { categoria: "Infraestrutura", previsto: 150000, realizado: 142000 },
  { categoria: "Material Didático", previsto: 85000, realizado: 90000 },
  { categoria: "Tecnologia", previsto: 95000, realizado: 110000 },
  { categoria: "Marketing", previsto: 50000, realizado: 46000 },
  { categoria: "Eventos", previsto: 45000, realizado: 38000 },
];

// Dados mock para folha de pagamento
const mockFolhaPagamento = [
  { cargo: "Professores", total: 430000, funcionarios: 24 },
  { cargo: "Coordenadores", total: 120000, funcionarios: 4 },
  { cargo: "Administrativo", total: 85000, funcionarios: 6 },
  { cargo: "Manutenção", total: 45000, funcionarios: 5 },
  { cargo: "Direção", total: 70000, funcionarios: 2 },
];

// Dados para fluxo de caixa
const mockFluxoCaixa = [
  { dia: "01/06", entrada: 28500, saida: 12300, saldo: 16200 },
  { dia: "02/06", entrada: 32100, saida: 8500, saldo: 23600 },
  { dia: "03/06", entrada: 18700, saida: 14200, saldo: 4500 },
  { dia: "04/06", entrada: 25800, saida: 9800, saldo: 16000 },
  { dia: "05/06", entrada: 30200, saida: 15600, saldo: 14600 },
];

// Dados para contratos
const mockContratos = [
  { id: 1, fornecedor: "Editora ABC", tipo: "Material Didático", valor: 85000, vencimento: "2024-12-31" },
  { id: 2, fornecedor: "Limpeza Total", tipo: "Serviços", valor: 36000, vencimento: "2024-08-15" },
  { id: 3, fornecedor: "TechSchool", tipo: "Software", valor: 42000, vencimento: "2025-01-10" },
  { id: 4, fornecedor: "Transporte Seguro", tipo: "Transporte", valor: 56000, vencimento: "2024-07-01" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const ORCAMENTO_COLORS = { previsto: "#60a5fa", realizado: "#f97316" };

// Simulação de nome do diretor
const diretorNome = "@...";

export default function Financeiro() {
  const [section, setSection] = useState("visao");
  const [selectedPeriod, setSelectedPeriod] = useState("6meses");
  const [inadimplenciaView, setInadimplenciaView] = useState("tabela");
  const [orcamentoFilter, setOrcamentoFilter] = useState("all");
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("");
  const [location, setLocation] = useLocation();
  const [viewingContract, setViewingContract] = useState<null | typeof mockContratos[0]>(null);
  const [editingContract, setEditingContract] = useState<null | typeof mockContratos[0]>(null);

  // Função para navegar para o dashboard
  const navegarParaDashboard = () => {
    setLocation("/dashboard/diretor");
  };

  // Filtrar dados do orçamento
  const dadosOrcamentoFiltrados = orcamentoFilter === "all" 
    ? mockOrcamento 
    : orcamentoFilter === "acima" 
      ? mockOrcamento.filter(item => item.realizado > item.previsto)
      : mockOrcamento.filter(item => item.realizado < item.previsto);

  // Filtrar mensalidades
  const mensalidadesFiltradas = mockMensalidades.filter(
    m => (!filtroTurma || m.turma.includes(filtroTurma)) && 
        (!filtroStatus || m.status === filtroStatus) &&
        (!filtroAluno || m.aluno.toLowerCase().includes(filtroAluno.toLowerCase()))
  );

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  // Função para atualizar um contrato
  const handleContractUpdate = (updatedContract: typeof mockContratos[0]) => {
    // Em uma aplicação real, atualizaria o contrato no banco de dados
    // Aqui apenas simulamos a atualização na UI com um toast
    toast.success(`Contrato #${updatedContract.id} atualizado com sucesso!`);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 80 }} 
        className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Gestão Financeira</h2>
          <p className="text-sm text-gray-500">Escola Digital 3D</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('visao')}
          >
            <BarChart2 className="w-5 h-5" /> Visão Geral
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'mensalidades' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('mensalidades')}
          >
            <Receipt className="w-5 h-5" /> Mensalidades
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'inadimplencia' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('inadimplencia')}
          >
            <AlertCircle className="w-5 h-5" /> Inadimplência
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'orcamento' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('orcamento')}
          >
            <Wallet className="w-5 h-5" /> Orçamento Anual
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'folha' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('folha')}
          >
            <Users className="w-5 h-5" /> Folha de Pagamento
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'fluxo' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('fluxo')}
          >
            <TrendingUp className="w-5 h-5" /> Fluxo de Caixa
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'contratos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('contratos')}
          >
            <FileText className="w-5 h-5" /> Contratos
          </button>
        </nav>
        <div className="mt-auto pt-8">
          <button 
            onClick={navegarParaDashboard}
            className="w-full flex gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2 mb-3"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
          </button>
          <button className="w-full flex gap-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg px-3 py-2">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </motion.aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Cabeçalho */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-indigo-800">
            {section === 'visao' && 'Visão Geral Financeira'}
            {section === 'mensalidades' && 'Controle de Mensalidades'}
            {section === 'inadimplencia' && 'Relatórios de Inadimplência'}
            {section === 'orcamento' && 'Orçamento Anual'}
            {section === 'folha' && 'Folha de Pagamento'}
            {section === 'fluxo' && 'Fluxo de Caixa'}
            {section === 'contratos' && 'Gestão de Contratos'}
          </h1>
        </motion.header>

        {/* Conteúdo de cada seção */}
        <AnimatePresence mode="wait">
          {/* SEÇÃO: VISÃO GERAL */}
          {section === 'visao' && (
            <motion.div
              key="visao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o novo componente modularizado */}
              <VisaoGeralFinanceira />
            </motion.div>
          )}

          {/* SEÇÃO: MENSALIDADES */}
          {section === 'mensalidades' && (
            <motion.div
              key="mensalidades"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o componente modularizado para Mensalidades */}
              <GestaoMensalidades />
            </motion.div>
          )}

          {/* SEÇÃO: INADIMPLÊNCIA */}
          {section === 'inadimplencia' && (
            <motion.div
              key="inadimplencia"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o componente modularizado para Inadimplência */}
              <GestaoInadimplencia />
            </motion.div>
          )}

          {/* SEÇÃO: ORÇAMENTO ANUAL */}
          {section === 'orcamento' && (
            <motion.div
              key="orcamento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o componente modularizado para Orçamento */}
              <GestaoOrcamento />
            </motion.div>
          )}

          {/* SEÇÃO: FOLHA DE PAGAMENTO */}
          {section === 'folha' && (
            <motion.div
              key="folha"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o componente modularizado para Folha de Pagamento */}
              <GestaoFolhaPagamento />
            </motion.div>
          )}

          {/* SEÇÃO: FLUXO DE CAIXA */}
          {section === 'fluxo' && (
            <motion.div
              key="fluxo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o componente modularizado para Fluxo de Caixa */}
              <GestaoFluxoCaixa />
            </motion.div>
          )}

          {/* SEÇÃO: CONTRATOS */}
          {section === 'contratos' && (
            <motion.div
              key="contratos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Usando o componente modularizado para Contratos */}
              <GestaoContratos />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Modals for contract view and edit */}
      <AnimatePresence>
        {viewingContract && (
          <ContractView 
            contrato={viewingContract} 
            onClose={() => setViewingContract(null)} 
          />
        )}
        
        {editingContract && (
          <ContractEdit 
            contrato={editingContract} 
            onClose={() => setEditingContract(null)} 
            onSave={handleContractUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 