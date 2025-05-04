import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, Users, BookOpen, Calendar, FileText, MessageCircle, BookOpenCheck, Edit3, 
  CheckSquare, User, ClipboardList, Clock, TrendingUp, Filter, ListChecks, 
  PlusCircle, X, CheckCircle, Edit, Upload, Eye, RefreshCw, Edit2, FilePlus, Check, Download, Save, Search, PieChart,
  Inbox, Send, Star, Archive, Trash2, Settings, Plus, MoreHorizontal, MoreVertical, Forward, Reply, Paperclip, LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Legend, AreaChart, Area, BarChart as RechartsBarChart, Bar 
} from "recharts";
import { toast } from "react-hot-toast";
import { format, parseISO, addDays } from "date-fns";
import { useLocation } from "wouter";
import { GradeManager } from "../utils/GradeManager";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock de turmas do professor
const mockTurmas = [
  { id: 1, nome: "1A", turno: "Manhã", alunos: 28, disciplina: "Matemática" },
  { id: 2, nome: "1B", turno: "Tarde", alunos: 26, disciplina: "Matemática" },
  { id: 3, nome: "2A", turno: "Manhã", alunos: 30, disciplina: "Matemática" },
];

// Mock de alunos por turma
const mockAlunos = {
  "1A": [
    { id: 1, nome: "Ana Silva", media: 8.5, faltas: 2, ultimaNota: 9.0 },
    { id: 2, nome: "Bruno Costa", media: 6.8, faltas: 4, ultimaNota: 7.0 },
    { id: 3, nome: "Carla Mendes", media: 9.2, faltas: 0, ultimaNota: 9.5 },
    { id: 4, nome: "Diego Santos", media: 7.5, faltas: 3, ultimaNota: 8.0 },
    { id: 5, nome: "Elena Oliveira", media: 5.8, faltas: 6, ultimaNota: 6.0 },
    { id: 6, nome: "Fernando Almeida", media: 8.2, faltas: 1, ultimaNota: 8.5 },
    { id: 7, nome: "Gabriela Pereira", media: 7.9, faltas: 3, ultimaNota: 8.0 },
    { id: 8, nome: "Henrique Lima", media: 6.5, faltas: 4, ultimaNota: 7.5 },
    { id: 9, nome: "Isabela Castro", media: 9.5, faltas: 0, ultimaNota: 9.8 },
    { id: 10, nome: "João Victor Souza", media: 7.0, faltas: 2, ultimaNota: 7.5 },
    { id: 11, nome: "Karina Ferreira", media: 8.7, faltas: 1, ultimaNota: 9.0 },
    { id: 12, nome: "Lucas Nunes", media: 6.3, faltas: 5, ultimaNota: 7.2 },
  ],
  "1B": [
    { id: 13, nome: "Maria Eduarda", media: 8.8, faltas: 1, ultimaNota: 9.2 },
    { id: 14, nome: "Nathan Santos", media: 7.2, faltas: 3, ultimaNota: 7.8 },
    { id: 15, nome: "Olivia Machado", media: 9.0, faltas: 0, ultimaNota: 9.5 },
    { id: 16, nome: "Pedro Henrique", media: 6.5, faltas: 4, ultimaNota: 7.0 },
    { id: 17, nome: "Quezia Rodrigues", media: 8.3, faltas: 2, ultimaNota: 8.5 },
    { id: 18, nome: "Rafael Barbosa", media: 7.6, faltas: 3, ultimaNota: 8.0 },
    { id: 19, nome: "Sofia Cardoso", media: 9.1, faltas: 1, ultimaNota: 9.3 },
    { id: 20, nome: "Thiago Ribeiro", media: 6.9, faltas: 4, ultimaNota: 7.5 },
    { id: 21, nome: "Ursula Gomes", media: 8.0, faltas: 2, ultimaNota: 8.2 },
    { id: 22, nome: "Vinícius Torres", media: 7.4, faltas: 3, ultimaNota: 7.7 },
    { id: 23, nome: "Wanessa Martins", media: 8.6, faltas: 1, ultimaNota: 9.0 },
    { id: 24, nome: "Xavier Andrade", media: 6.7, faltas: 4, ultimaNota: 7.2 },
  ],
  "2A": [
    { id: 25, nome: "Yasmin Correia", media: 8.9, faltas: 1, ultimaNota: 9.3 },
    { id: 26, nome: "Zacarias Melo", media: 7.3, faltas: 3, ultimaNota: 7.8 },
    { id: 27, nome: "Amanda Teixeira", media: 9.4, faltas: 0, ultimaNota: 9.6 },
    { id: 28, nome: "Bernardo Moreira", media: 6.8, faltas: 4, ultimaNota: 7.2 },
    { id: 29, nome: "Clara Monteiro", media: 8.2, faltas: 2, ultimaNota: 8.5 },
    { id: 30, nome: "Daniel Dias", media: 7.5, faltas: 3, ultimaNota: 7.9 },
    { id: 31, nome: "Érica Borges", media: 9.0, faltas: 1, ultimaNota: 9.2 },
    { id: 32, nome: "Fábio Moura", media: 7.1, faltas: 4, ultimaNota: 7.5 },
    { id: 33, nome: "Giovanna Farias", media: 8.3, faltas: 2, ultimaNota: 8.6 },
    { id: 34, nome: "Hugo Nascimento", media: 7.8, faltas: 2, ultimaNota: 8.0 },
    { id: 35, nome: "Ingrid Campos", media: 8.7, faltas: 1, ultimaNota: 9.1 },
    { id: 36, nome: "Juliano Barros", media: 7.0, faltas: 3, ultimaNota: 7.4 },
  ]
};

// Mock de atividades e avaliações
const mockAtividades = [
  { id: 1, turma: "1A", tipo: "Prova", titulo: "Avaliação Bimestral", dataEntrega: "2024-06-20", status: "Pendente" },
  { id: 2, turma: "1B", tipo: "Trabalho", titulo: "Projeto de Pesquisa", dataEntrega: "2024-06-25", status: "Publicado" },
  { id: 3, turma: "2A", tipo: "Exercício", titulo: "Lista de Exercícios", dataEntrega: "2024-06-15", status: "Corrigido" },
  { id: 4, turma: "1A", tipo: "Prova", titulo: "Recuperação", dataEntrega: "2024-06-30", status: "Rascunho" },
];

// Mock de progresso dos alunos
const mockProgressoAlunos = [
  { mes: "Jan", media1A: 7.2, media1B: 7.0, media2A: 8.1 },
  { mes: "Fev", media1A: 7.5, media1B: 7.3, media2A: 8.0 },
  { mes: "Mar", media1A: 7.8, media1B: 7.6, media2A: 8.2 },
  { mes: "Abr", media1A: 8.0, media1B: 7.8, media2A: 8.4 },
  { mes: "Mai", media1A: 8.2, media1B: 7.9, media2A: 8.5 },
  { mes: "Jun", media1A: 8.3, media1B: 8.0, media2A: 8.7 },
];

// Mock de mensagens
const mockMensagens = [
  { id: 1, remetente: "Maria Silva (Coordenadora)", assunto: "Reunião Pedagógica", data: "2024-06-05", lida: true },
  { id: 2, remetente: "Sistema", assunto: "Prazo para lançamento de notas", data: "2024-06-10", lida: false },
  { id: 3, remetente: "Pai do aluno Bruno Costa", assunto: "Dúvida sobre nota", data: "2024-06-12", lida: false },
];

// Mock de horários do professor
const mockHorarios = [
  { dia: "Segunda", aulas: [
    { turma: "1A", horario: "07:30 - 08:20" },
    { turma: "1B", horario: "10:20 - 11:10" },
    { turma: "2A", horario: "13:30 - 14:20" }
  ]},
  { dia: "Terça", aulas: [
    { turma: "1A", horario: "08:20 - 09:10" },
    { turma: "2A", horario: "14:20 - 15:10" }
  ]},
  { dia: "Quarta", aulas: [
    { turma: "1B", horario: "10:20 - 11:10" }
  ]},
  { dia: "Quinta", aulas: [
    { turma: "1A", horario: "07:30 - 08:20" },
    { turma: "2A", horario: "13:30 - 14:20" }
  ]},
  { dia: "Sexta", aulas: [
    { turma: "1B", horario: "09:10 - 10:00" }
  ]}
];

// Mock de conteúdos programáticos
const mockConteudos = [
  { id: 1, turma: "1A", unidade: "Unidade 1", titulo: "Números Inteiros", status: "Concluído" },
  { id: 2, turma: "1A", unidade: "Unidade 2", titulo: "Frações", status: "Em andamento" },
  { id: 3, turma: "1A", unidade: "Unidade 3", titulo: "Equações de 1º grau", status: "Não iniciado" },
  { id: 4, turma: "1B", unidade: "Unidade 1", titulo: "Números Inteiros", status: "Concluído" },
  { id: 5, turma: "1B", unidade: "Unidade 2", titulo: "Frações", status: "Em andamento" },
  { id: 6, turma: "2A", unidade: "Unidade 1", titulo: "Geometria", status: "Concluído" },
  { id: 7, turma: "2A", unidade: "Unidade 2", titulo: "Álgebra", status: "Concluído" },
  { id: 8, turma: "2A", unidade: "Unidade 3", titulo: "Estatística", status: "Em andamento" },
];

// Cores para o gráfico de turmas
const TURMA_COLORS = { "1A": "#6366f1", "1B": "#f59e42", "2A": "#10b981" };

export default function ProfessorDashboard() {
  const [section, setSection] = useState("visao");
  const [turmaSelecionada, setTurmaSelecionada] = useState("1A");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [alunoSelecionado, setAlunoSelecionado] = useState<null | { 
    id: number;
    nome: string;
    media: number;
    faltas: number;
    ultimaNota: number;
  }>(null);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null as null | typeof mockMensagens[0]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null as null | typeof mockAtividades[0]);
  const [, navigate] = useLocation();
  const [presencaAlunos, setPresencaAlunos] = useState<{[key: number]: boolean}>({});
  const [filtroAlunos, setFiltroAlunos] = useState<string>("");
  const [conteudoSelecionado, setConteudoSelecionado] = useState<null | typeof mockConteudos[0]>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<"lista" | "kanban">("lista");
  const [filtroConteudo, setFiltroConteudo] = useState<string>("");
  const [novoConteudoModal, setNovoConteudoModal] = useState<boolean>(false);
  const [showAlunoDetalhes, setShowAlunoDetalhes] = useState<boolean>(false);

  // Simulação de dados do usuário logado
  const user = {
    name: "João Souza",
    email: "professor@escola.com",
    role: "professor",
    disciplina: "Matemática",
    avatar: "",
    telefone: "(11) 98765-4321",
    formacao: "Licenciatura em Matemática",
    instituicao: "Universidade Federal",
    dataAdmissao: "2020-02-01",
    biografia: "Professor de Matemática com 5 anos de experiência no ensino fundamental e médio. Especialista em metodologias ativas de ensino."
  };
  
  // Verificação de segurança - redirecionar se não for professor
  useEffect(() => {
    // Em uma aplicação real, isso seria verificado com um token JWT ou sessão
    if (user.role !== "professor") {
      toast.error("Acesso não autorizado. Redirecionando...");
      navigate("/dashboard/coordenador");
    }
  }, [user.role, navigate]);

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Inicializar a presença dos alunos quando a turma muda
  useEffect(() => {
    if (turmaSelecionada && mockAlunos[turmaSelecionada as keyof typeof mockAlunos]) {
      const initialPresenca: {[key: number]: boolean} = {};
      mockAlunos[turmaSelecionada as keyof typeof mockAlunos].forEach(aluno => {
        initialPresenca[aluno.id] = true; // Todos iniciam como presentes
      });
      setPresencaAlunos(initialPresenca);
    }
  }, [turmaSelecionada]);

  // Função para alternar a presença de um aluno
  const togglePresenca = (alunoId: number) => {
    setPresencaAlunos(prev => ({
      ...prev,
      [alunoId]: !prev[alunoId]
    }));
  };

  // Filtrar alunos com base no texto de busca
  const getFilteredAlunos = () => {
    if (!filtroAlunos.trim() || !mockAlunos[turmaSelecionada as keyof typeof mockAlunos]) {
      return mockAlunos[turmaSelecionada as keyof typeof mockAlunos];
    }
    
    const searchTerm = filtroAlunos.toLowerCase().trim();
    return mockAlunos[turmaSelecionada as keyof typeof mockAlunos].filter(
      aluno => aluno.nome.toLowerCase().includes(searchTerm)
    );
  };

  // Abrir detalhes do aluno
  const openAlunoDetalhes = (aluno: typeof alunoSelecionado) => {
    setAlunoSelecionado(aluno);
    setShowAlunoDetalhes(true);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada - Com opções limitadas para professor */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: sidebarVisible ? 0 : -280, opacity: sidebarVisible ? 1 : 0, width: sidebarVisible ? 'auto' : 0 }} 
        transition={{ type: "spring", stiffness: 80 }} 
        className={`w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen`}
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Painel Professor</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
          <p className="text-xs text-gray-400">{user.disciplina}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('visao')}
          >
            <BarChart2 className="w-5 h-5" /> Visão Geral
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'turmas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('turmas')}
          >
            <Users className="w-5 h-5" /> Minhas Turmas
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'atividades' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('atividades')}
          >
            <ClipboardList className="w-5 h-5" /> Atividades e Avaliações
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'notas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('notas')}
          >
            <Edit3 className="w-5 h-5" /> Lançamento de Notas
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'frequencia' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('frequencia')}
          >
            <CheckSquare className="w-5 h-5" /> Controle de Frequência
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'conteudos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('conteudos')}
          >
            <BookOpen className="w-5 h-5" /> Conteúdo Programático
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'horarios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('horarios')}
          >
            <Clock className="w-5 h-5" /> Meus Horários
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'mensagens' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('mensagens')}
          >
            <MessageCircle className="w-5 h-5" /> Comunicações
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('relatorios')}
          >
            <FileText className="w-5 h-5" /> Relatórios
          </button>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'perfil' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`}
              onClick={() => setSection('perfil')}
            >
              <User className="w-5 h-5" /> Meu Perfil
            </button>
          </div>
        </nav>
        <div className="mt-auto">
          <button 
            className="w-full flex items-center justify-center gap-2 mt-6 border border-gray-200 rounded-lg py-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            onClick={() => {
              toast.success("Logout realizado com sucesso!");
              navigate("/login");
            }}
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </motion.aside>

      {/* Botão para mostrar/esconder a sidebar quando está oculta */}
      {!sidebarVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md hover:bg-indigo-100"
          title="Mostrar menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      )}

      {/* Conteúdo Principal */}
      <main className={`flex-1 p-8 max-w-screen-2xl mx-auto transition-all duration-300 ${!sidebarVisible ? 'ml-0' : ''}`}>
        {/* Visão Geral */}
        {section === 'visao' && (
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
                <p className="text-gray-500 text-sm">Bem-vindo, {user.name}! Aqui está o resumo da sua atividade docente.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-700">{format(new Date(), "'Hoje é' dd 'de' MMMM', ' EEEE")}</span>
              </div>
            </motion.div>
            
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div 
                initial="hidden"
                animate="visible"
                custom={0}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Total de Alunos</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Em {mockTurmas.length} turmas sob sua responsabilidade
                  </div>
                  <div className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      ~{Math.round(Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0) / mockTurmas.length)} por turma
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                custom={1}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <BarChart2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Média Geral</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {(Object.values(mockAlunos).reduce((acc, curr) => {
                        return acc + curr.reduce((sum, aluno) => sum + aluno.media, 0);
                      }, 0) / Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0)).toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Performance</span>
                    <span className="text-green-600 font-medium">Bom</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-600" 
                      style={{
                        width: `${(Object.values(mockAlunos).reduce((acc, curr) => {
                          return acc + curr.reduce((sum, aluno) => sum + aluno.media, 0);
                        }, 0) / Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0)) * 10}%`
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                custom={2}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <ClipboardList className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Atividades</h3>
                    <p className="text-2xl font-bold text-gray-800">{mockAtividades.length}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {mockAtividades.filter(a => a.status === "Pendente").length} pendentes
                  </div>
                  <div className="flex gap-1">
                    {["Pendente", "Publicado", "Corrigido", "Rascunho"].map((status) => (
                      <div 
                        key={status}
                        className={`w-2 h-2 rounded-full ${
                          status === 'Pendente' ? 'bg-amber-500' :
                          status === 'Publicado' ? 'bg-green-500' :
                          status === 'Corrigido' ? 'bg-indigo-500' :
                          'bg-gray-300'
                        }`}
                        title={`${mockAtividades.filter(a => a.status === status).length} ${status}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                custom={3}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <MessageCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Mensagens</h3>
                    <p className="text-2xl font-bold text-gray-800">{mockMensagens.length}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {mockMensagens.filter(m => !m.lida).length} não lidas
                  </div>
                  {mockMensagens.filter(m => !m.lida).length > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {mockMensagens.filter(m => !m.lida).length} nova{mockMensagens.filter(m => !m.lida).length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Resumo por Turmas */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Resumo por Turmas
                </span>
                <Button variant="ghost" size="sm" onClick={() => setSection('turmas')} className="text-xs text-indigo-600 hover:text-indigo-800">
                  Ver detalhes
                </Button>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-600 border-b border-gray-200">
                      <th className="pb-2 font-medium text-left">Turma</th>
                      <th className="pb-2 font-medium text-center">Alunos</th>
                      <th className="pb-2 font-medium text-center">Média</th>
                      <th className="pb-2 font-medium">Performance</th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockTurmas.map((turma) => {
                      const mediaGeral = (mockAlunos[turma.nome as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                        mockAlunos[turma.nome as keyof typeof mockAlunos].length);
                      
                      return (
                        <tr key={turma.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                          setTurmaSelecionada(turma.nome);
                          setSection('turmas');
                        }}>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className={`h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-medium ${
                                turma.nome === '1A' ? 'bg-indigo-500' :
                                turma.nome === '1B' ? 'bg-amber-500' :
                                'bg-green-500'
                              }`}>
                                {turma.nome}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">Turma {turma.nome}</span>
                                <p className="text-xs text-gray-500">{turma.turno}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {mockAlunos[turma.nome as keyof typeof mockAlunos].length}
                          </td>
                          <td className="py-3 text-center font-medium">
                            {mediaGeral.toFixed(1)}
                          </td>
                          <td className="py-3">
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  mediaGeral >= 7 ? 'bg-green-500' : 
                                  mediaGeral >= 5 ? 'bg-amber-500' : 
                                  'bg-red-500'
                                }`} 
                                style={{ width: `${mediaGeral * 10}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              mediaGeral >= 7 ? 'bg-green-100 text-green-800' : 
                              mediaGeral >= 5 ? 'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {mediaGeral >= 7 ? 'Bom' : mediaGeral >= 5 ? 'Regular' : 'Abaixo'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Gráfico de Progresso */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Progresso por Turma
                </span>
                <div className="flex gap-2">
                  {Object.keys(TURMA_COLORS).map((turma) => (
                    <div key={turma} className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TURMA_COLORS[turma as keyof typeof TURMA_COLORS] }}></div>
                      <span>{turma}</span>
                    </div>
                  ))}
                </div>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockProgressoAlunos}>
                    <defs>
                      {Object.keys(TURMA_COLORS).map((turma) => (
                        <linearGradient key={turma} id={`color${turma}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TURMA_COLORS[turma as keyof typeof TURMA_COLORS]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={TURMA_COLORS[turma as keyof typeof TURMA_COLORS]} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="mes" stroke="#6b7280" />
                    <YAxis domain={[0, 10]} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      formatter={(value) => [`${value}`, 'Média']}
                    />
                    {Object.keys(TURMA_COLORS).map((turma) => (
                      <Area 
                        key={turma}
                        type="monotone" 
                        dataKey={`media${turma}`} 
                        stroke={TURMA_COLORS[turma as keyof typeof TURMA_COLORS]}
                        fillOpacity={1}
                        fill={`url(#color${turma})`}
                        strokeWidth={2}
                        name={`Turma ${turma}`}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Aulas de Hoje e Próximas Atividades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" /> Aulas de Hoje
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSection('horarios')}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Ver horário completo
                  </Button>
                </h3>

                <div className="space-y-3">
                  {mockHorarios.find(h => h.dia === format(new Date(), 'EEEE'))?.aulas.map((aula, index) => (
                    <div key={index} className="p-3 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-md flex items-center justify-center text-white font-medium ${
                            aula.turma === '1A' ? 'bg-indigo-500' :
                            aula.turma === '1B' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}>
                            {aula.turma}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Turma {aula.turma}</h4>
                            <p className="text-xs text-gray-500">{aula.horario}</p>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs h-7 py-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTurmaSelecionada(aula.turma);
                            setSection('frequencia');
                          }}
                        >
                          <CheckSquare className="w-3 h-3 mr-1" /> Frequência
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">Não há aulas programadas para hoje</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" /> Próximas Atividades
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSection('atividades')}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Ver todas
                  </Button>
                </h3>

                <div className="space-y-3">
                  {mockAtividades.slice(0, 3).map((atividade) => (
                    <div key={atividade.id} className="p-3 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className={`w-2 self-stretch rounded-full ${
                            atividade.status === 'Pendente' ? 'bg-amber-500' :
                            atividade.status === 'Publicado' ? 'bg-green-500' :
                            atividade.status === 'Corrigido' ? 'bg-indigo-500' :
                            'bg-gray-300'
                          }`}></div>
                          <div>
                            <h4 className="font-medium text-gray-800">{atividade.titulo}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                atividade.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                                atividade.status === 'Publicado' ? 'bg-green-100 text-green-700' :
                                atividade.status === 'Corrigido' ? 'bg-indigo-100 text-indigo-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {atividade.status}
                              </span>
                              <span className="text-xs text-gray-500">Turma {atividade.turma}</span>
                              <span className="text-xs text-gray-500">{atividade.tipo}</span>
                            </div>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                          <Calendar className="w-3 h-3" />
                          {format(parseISO(atividade.dataEntrega), "dd/MM")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSection('atividades')}
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Nova Atividade
                </Button>
              </motion.div>
            </div>

            {/* Mensagens Recentes */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-600" /> Mensagens Recentes
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSection('mensagens')}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Ver todas
                </Button>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mockMensagens.map((mensagem) => (
                  <div key={mensagem.id} className={`p-4 rounded-lg border ${
                    mensagem.lida ? 'border-gray-200 hover:border-gray-300' : 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100'
                  } hover:shadow-md transition-all cursor-pointer`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 line-clamp-1">{mensagem.assunto}</h4>
                      {!mensagem.lida && (
                        <span className="inline-flex w-2 h-2 bg-indigo-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">De: {mensagem.remetente}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{format(parseISO(mensagem.data), "dd/MM/yyyy")}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto hover:bg-transparent hover:text-indigo-700"
                        onClick={() => {
                          setMensagemSelecionada(mensagem);
                          setSection('mensagens');
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Outras seções seriam implementadas aqui */}
        {section === 'turmas' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Minhas Turmas</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {mockTurmas.map((turma) => (
                <motion.div 
                  key={turma.id}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                    turma.nome === turmaSelecionada 
                      ? 'border-l-indigo-500 ring-1 ring-indigo-100' 
                      : 'border-l-gray-200'
                  } cursor-pointer transition-all duration-200 hover:shadow-lg`}
                  onClick={() => setTurmaSelecionada(turma.nome)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold ${
                        turma.nome === '1A' ? 'bg-indigo-500' :
                        turma.nome === '1B' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}>
                        {turma.nome}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{turma.nome}</h3>
                        <p className="text-xs text-gray-500">{turma.turno} • {turma.disciplina}</p>
                      </div>
                    </div>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                      {turma.alunos} alunos
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-gray-500">Desempenho Geral</span>
                      <span className="text-sm font-bold text-indigo-700">
                        {(mockAlunos[turma.nome as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                          mockAlunos[turma.nome as keyof typeof mockAlunos].length).toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          turma.nome === '1A' ? 'bg-indigo-500' :
                          turma.nome === '1B' ? 'bg-amber-500' :
                          'bg-green-500'
                        }`} 
                        style={{
                          width: `${(mockAlunos[turma.nome as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                            mockAlunos[turma.nome as keyof typeof mockAlunos].length) * 10}%`
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{mockAlunos[turma.nome as keyof typeof mockAlunos].filter(a => a.media >= 7).length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                        <span>{mockAlunos[turma.nome as keyof typeof mockAlunos].filter(a => a.media >= 5 && a.media < 7).length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>{mockAlunos[turma.nome as keyof typeof mockAlunos].filter(a => a.media < 5).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 py-0.5 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurmaSelecionada(turma.nome);
                        setSection('notas');
                      }}
                    >
                      <Edit3 className="w-3 h-3 mr-1" /> Notas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 py-0.5 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurmaSelecionada(turma.nome);
                        setSection('frequencia');
                      }}
                    >
                      <CheckSquare className="w-3 h-3 mr-1" /> Freq.
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 py-0.5 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurmaSelecionada(turma.nome);
                        setSection('conteudos');
                      }}
                    >
                      <BookOpen className="w-3 h-3 mr-1" /> Cont.
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Detalhes da turma selecionada */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold ${
                    turmaSelecionada === '1A' ? 'bg-indigo-500' :
                    turmaSelecionada === '1B' ? 'bg-amber-500' :
                    'bg-green-500'
                  }`}>
                    {turmaSelecionada}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Turma {turmaSelecionada} - Alunos <span className="text-sm text-gray-500 ml-1">({mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length} alunos)</span>
                  </h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar aluno..."
                      className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={filtroAlunos}
                      onChange={(e) => setFiltroAlunos(e.target.value)}
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  <select className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="todos">Todos os status</option>
                    <option value="aprovados">Aprovados</option>
                    <option value="recuperacao">Em recuperação</option>
                    <option value="reprovados">Reprovados</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-indigo-700 border-b">
                      <th className="py-3 px-4 font-medium">Nome</th>
                      <th className="py-3 px-4 font-medium text-center">Média</th>
                      <th className="py-3 px-4 font-medium text-center">Faltas</th>
                      <th className="py-3 px-4 font-medium text-center">Última Nota</th>
                      <th className="py-3 px-4 font-medium">Progresso</th>
                      <th className="py-3 px-4 font-medium text-center">Status</th>
                      <th className="py-3 px-4 font-medium text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredAlunos().map((aluno) => (
                      <tr key={aluno.id} 
                        className={`border-b last:border-b-0 hover:bg-indigo-50/30 transition-colors ${alunoSelecionado?.id === aluno.id ? 'bg-indigo-50/50' : ''}`}
                        onClick={() => openAlunoDetalhes(aluno)}
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium">{aluno.nome}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                            aluno.media >= 7 ? 'bg-green-100 text-green-700' : 
                            aluno.media >= 5 ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {aluno.media.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center justify-center rounded-full text-xs font-medium px-2 py-1 ${
                            aluno.faltas <= 3 ? 'bg-green-100 text-green-700' : 
                            aluno.faltas <= 5 ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {aluno.faltas} faltas
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-100">
                            {aluno.ultimaNota.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  aluno.media >= 7 ? 'bg-green-500' : 
                                  aluno.media >= 5 ? 'bg-amber-500' : 
                                  'bg-red-500'
                                }`} 
                                style={{ width: `${(aluno.media / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 w-9 text-right">{(aluno.media / 10 * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center justify-center gap-1 w-24 mx-auto ${
                            aluno.media >= 7 ? 'bg-green-100 text-green-800 border border-green-200' : 
                            aluno.media >= 5 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {aluno.media >= 7 ? 
                              <><CheckCircle className="w-3 h-3" /> Aprovado</> : 
                            aluno.media >= 5 ? 
                              <><Clock className="w-3 h-3" /> Recuperação</> : 
                              <><X className="w-3 h-3" /> Reprovado</>
                            }
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAlunoDetalhes(aluno);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> Detalhes
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-indigo-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSection('mensagens');
                                toast.success(`Mensagem para: ${aluno.nome}`);
                              }}
                            >
                              <MessageCircle className="w-3.5 h-3.5 mr-1" /> Mensagem
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filtroAlunos && getFilteredAlunos().length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-700 mb-1">Nenhum aluno encontrado</h4>
                  <p className="text-gray-500">Tente outro termo de busca ou limpe o filtro</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setFiltroAlunos("")}
                  >
                    Limpar busca
                  </Button>
                </div>
              )}
              
              {getFilteredAlunos().length > 0 && (
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <div className="text-gray-500">
                    Mostrando {getFilteredAlunos().length} de {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length} alunos
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Aprovado ≥ 7,0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Recuperação ≥ 5,0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Reprovado &lt; 5,0</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Seção de Atividades e Avaliações */}
        {section === 'atividades' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-indigo-600" /> Atividades e Avaliações
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-indigo-500 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-indigo-500" /> 
                  <span>Filtros</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      <option value="todas">Todas as turmas</option>
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Tipo</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="todos">Todos os tipos</option>
                      <option value="prova">Prova</option>
                      <option value="trabalho">Trabalho</option>
                      <option value="exercicio">Exercício</option>
                      <option value="projeto">Projeto</option>
                      <option value="seminario">Seminário</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="todos">Todos os status</option>
                      <option value="pendente">Pendente</option>
                      <option value="publicado">Publicado</option>
                      <option value="corrigido">Corrigido</option>
                      <option value="rascunho">Rascunho</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Período</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="todos">Todo o período</option>
                      <option value="proximos">Próximos 7 dias</option>
                      <option value="mes">Próximo mês</option>
                      <option value="bimestre">Bimestre atual</option>
                    </select>
                  </div>
                  
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Aplicar Filtros
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-indigo-600" /> Lista de Atividades
                  </h3>
                  <Button onClick={() => setAtividadeSelecionada(null)} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Nova Atividade
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b bg-indigo-50/50">
                        <th className="py-3 px-4 font-medium">Título</th>
                        <th className="py-3 px-4 font-medium">Turma</th>
                        <th className="py-3 px-4 font-medium">Tipo</th>
                        <th className="py-3 px-4 font-medium">Data de Entrega</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAtividades
                        .filter(a => turmaSelecionada === "todas" || a.turma === turmaSelecionada)
                        .map((atividade) => (
                        <motion.tr 
                          key={atividade.id} 
                          className={`border-b last:border-b-0 hover:bg-indigo-50/30 cursor-pointer transition-colors ${atividadeSelecionada?.id === atividade.id ? 'bg-indigo-50/70' : ''}`}
                          onClick={() => setAtividadeSelecionada(atividade)}
                          whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-indigo-800">{atividade.titulo}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {(() => {
                                const date = parseISO(atividade.dataEntrega);
                                const today = new Date();
                                const daysLeft = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                
                                if (daysLeft < 0) {
                                  return <span className="text-red-500">Atrasada há {Math.abs(daysLeft)} dias</span>;
                                } else if (daysLeft === 0) {
                                  return <span className="text-amber-500">Entrega hoje</span>;
                                } else if (daysLeft <= 3) {
                                  return <span className="text-amber-500">Entrega em {daysLeft} dias</span>;
                                }
                                return null;
                              })()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                              {atividade.turma}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full 
                              ${atividade.tipo === 'Prova' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                                atividade.tipo === 'Trabalho' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                atividade.tipo === 'Exercício' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                              {atividade.tipo}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {format(parseISO(atividade.dataEntrega), "dd/MM/yyyy")}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                              atividade.status === 'Pendente' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                              atividade.status === 'Publicado' ? 'bg-green-100 text-green-800 border border-green-200' : 
                              atividade.status === 'Corrigido' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {atividade.status === 'Pendente' && <Clock className="w-3 h-3 inline mr-1" />}
                              {atividade.status === 'Publicado' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {atividade.status === 'Corrigido' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {atividade.status === 'Rascunho' && <Edit className="w-3 h-3 inline mr-1" />}
                              {atividade.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAtividadeSelecionada(atividade);
                                }}
                              >
                                <Edit2 className="w-3 h-3 mr-1" /> Editar
                              </Button>
                              {atividade.status === 'Rascunho' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success(`Publicando: ${atividade.titulo}`);
                                  }}
                                >
                                  <Upload className="w-3 h-3 mr-1" /> Publicar
                                </Button>
                              )}
                              {atividade.status === 'Corrigido' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success(`Exportando notas de: ${atividade.titulo}`);
                                  }}
                                >
                                  <FileText className="w-3 h-3 mr-1" /> Exportar
                                </Button>
                              )}
                              {atividade.status === 'Pendente' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success(`Lembrando alunos sobre: ${atividade.titulo}`);
                                  }}
                                >
                                  <Clock className="w-3 h-3 mr-1" /> Lembrete
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 text-sm text-gray-500 flex justify-between items-center border-t">
                  <div>Mostrando {mockAtividades.filter(a => turmaSelecionada === "todas" || a.turma === turmaSelecionada).length} de {mockAtividades.length} atividades</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">Anterior</Button>
                    <Button size="sm" className="bg-indigo-600 text-xs">1</Button>
                    <Button variant="outline" size="sm" className="text-xs">Próximo</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detalhes da atividade selecionada */}
            {atividadeSelecionada && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6"
              >
                <div className="flex justify-between items-start mb-6">
                    <div>
                    <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                      {atividadeSelecionada ? (
                        <>
                          <FileText className="w-5 h-5 text-indigo-600" />
                          Editar: {atividadeSelecionada.titulo}
                        </>
                      ) : (
                        <>
                          <FilePlus className="w-5 h-5 text-indigo-600" />
                          Nova Atividade
                        </>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {atividadeSelecionada ? `Turma ${atividadeSelecionada.turma} • ${atividadeSelecionada.tipo}` : 'Formulário para nova atividade'}
                    </p>
                    {atividadeSelecionada && (
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                          atividadeSelecionada.status === 'Pendente' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                          atividadeSelecionada.status === 'Publicado' ? 'bg-green-100 text-green-800 border border-green-200' : 
                          atividadeSelecionada.status === 'Corrigido' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {atividadeSelecionada.status === 'Pendente' && <Clock className="w-3 h-3 inline mr-1" />}
                          {atividadeSelecionada.status === 'Publicado' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {atividadeSelecionada.status === 'Corrigido' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {atividadeSelecionada.status === 'Rascunho' && <Edit className="w-3 h-3 inline mr-1" />}
                          {atividadeSelecionada.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                      onClick={() => setAtividadeSelecionada(null)}
                    >
                      <X className="w-3 h-3" /> Fechar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => toast.success("Visualizando prévia da atividade")}
                    >
                      <Eye className="w-3 h-3 mr-1" /> Pré-visualizar
                    </Button>
                    {atividadeSelecionada && atividadeSelecionada.status === 'Rascunho' && (
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => toast.success(`Atividade "${atividadeSelecionada.titulo}" publicada com sucesso!`)}
                      >
                        <Upload className="w-3 h-3 mr-1" /> Publicar
                      </Button>
                    )}
                      </div>
                    </div>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Título</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={atividadeSelecionada.titulo}
                          placeholder="Ex: Avaliação Bimestral de Matemática"
                        />
                    </div>
                    
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={atividadeSelecionada.turma}
                        >
                          {mockTurmas.map((turma) => (
                            <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                          ))}
                        </select>
                  </div>
                  
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Tipo</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={atividadeSelecionada.tipo}
                        >
                          <option value="Prova">Prova</option>
                          <option value="Trabalho">Trabalho</option>
                          <option value="Exercício">Exercício</option>
                          <option value="Projeto">Projeto</option>
                          <option value="Seminário">Seminário</option>
                        </select>
                    </div>
                    
                      <div className="grid grid-cols-2 gap-4">
                    <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">Data de Entrega</label>
                          <input 
                            type="date" 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue={atividadeSelecionada.dataEntrega}
                          />
                            </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">Horário Limite</label>
                          <input 
                            type="time" 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue="23:59"
                          />
                          </div>
                        </div>
                        
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue={atividadeSelecionada.status}
                        >
                          <option value="Rascunho">Rascunho</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Publicado">Publicado</option>
                          <option value="Corrigido">Corrigido</option>
                        </select>
                          </div>
                      
                      <div className="pt-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                          <span className="ml-2 text-sm text-gray-700">Permitir envios atrasados</span>
                        </label>
                        </div>
                      
                      <div className="pt-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                          <span className="ml-2 text-sm text-gray-700">Notificar alunos por email</span>
                        </label>
                  </div>
                  
                      <div className="pt-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                          <span className="ml-2 text-sm text-gray-700">Permitir envio de arquivos</span>
                        </label>
                  </div>
                </div>
          </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Descrição</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded-lg p-2 min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Descreva a atividade em detalhes com instruções claras para os alunos..."
                          defaultValue={`Descrição detalhada para ${atividadeSelecionada.titulo}.\nInstruções para os alunos e informações importantes.`}
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">Peso na nota</label>
                          <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">Valor (pts)</label>
                          <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue="10"
                            min="0"
                            max="100"
                            step="0.5"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center justify-between">
                          <span>Anexos</span>
                          <span className="text-xs text-indigo-600">Máx. 10MB por arquivo</span>
                        </label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload className="w-8 h-8 text-indigo-500" />
                            <p className="text-sm text-gray-500 text-center">
                              Arraste arquivos aqui ou clique para selecionar
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Selecionar Arquivos
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6 border-t border-gray-100 pt-6">
                  <Button 
                    variant="outline"
                    className="border-indigo-200 text-indigo-700"
                    onClick={() => setAtividadeSelecionada(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-200 text-amber-700"
                    onClick={() => {
                      toast.success("Atividade salva como rascunho!");
                      setAtividadeSelecionada(null);
                    }}
                  >
                    Salvar Rascunho
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      toast.success("Atividade publicada com sucesso!");
                      setAtividadeSelecionada(null);
                    }}
                  >
                    Publicar Atividade
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {/* Seção de Lançamento de Notas */}
        {section === 'notas' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-indigo-600" /> Lançamento de Notas
              </h1>
              
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Configurações
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome} - {turma.disciplina}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Informações da Turma</h4>
                    <div className="space-y-3">
                      <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-indigo-700 flex items-center gap-1">
                          <Users className="w-4 h-4" /> Alunos
                        </span>
                        <span className="font-medium text-indigo-900">{mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length}</span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-green-700 flex items-center gap-1">
                          <BarChart2 className="w-4 h-4" /> Média
                        </span>
                        <span className="font-medium text-green-900">
                          {(mockAlunos[turmaSelecionada as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                            mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length).toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-blue-700 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Última avaliação
                        </span>
                        <span className="font-medium text-blue-900">05/05/2024</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2 flex items-center justify-center gap-2"
                    onClick={() => toast.success("Pauta de notas impressa!")}
                  >
                    <FileText className="w-4 h-4" /> Gerar Pauta PDF
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
                {/* Integra o componente GradeManager com suporte às funcionalidades importadas */}
                <GradeManager turmaSelecionada={turmaSelecionada.trim()} />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Seção de Controle de Frequência */}
        {section === 'frequencia' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-indigo-600" /> Controle de Frequência
              </h1>
              
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Registro de Presença
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome} - {turma.disciplina}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Data</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Horário</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        {mockHorarios.find(h => h.dia === "Segunda")?.aulas.map((aula, index) => (
                          <option key={index} value={aula.horario}>{aula.horario}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Resumo</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <span className="text-xs text-indigo-500 uppercase font-medium">Aulas ministradas</span>
                        <span className="text-lg font-bold text-indigo-700">32</span>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <span className="text-xs text-indigo-500 uppercase font-medium">Alunos</span>
                        <span className="text-lg font-bold text-indigo-700">{mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length}</span>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <span className="text-xs text-indigo-500 uppercase font-medium">Última chamada</span>
                        <span className="text-sm font-medium text-indigo-700">14/06/2024</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-3">
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => toast.success("Frequência registrada com sucesso!")}
                    >
                      <CheckSquare className="w-4 h-4 mr-1" /> Registrar Presença
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.success("Relatório de frequência gerado com sucesso!")}
                    >
                      <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" /> Lista de Presença - Turma {turmaSelecionada}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-indigo-200 text-indigo-700"
                      onClick={() => toast.success("Lista de presença exportada com sucesso!")}
                    >
                      <Download className="w-4 h-4 mr-1" /> Exportar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-indigo-600"
                      onClick={() => toast.success("Presença registrada com sucesso!")}
                    >
                      <Save className="w-4 h-4 mr-1" /> Salvar
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-grow max-w-sm">
                      <input
                        type="text"
                        placeholder="Buscar aluno..."
                        className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={filtroAlunos}
                        onChange={(e) => setFiltroAlunos(e.target.value)}
                      />
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <select className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="hoje">Aula de hoje</option>
                      <option value="semana">Última semana</option>
                      <option value="mes">Último mês</option>
                      <option value="periodo">Todo o período</option>
                    </select>
                    
                    <div className="flex gap-2 ml-auto">
                      <button className="text-indigo-600 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100" title="Marcar todos como presentes">
                        <CheckSquare className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100" title="Filtrar">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100" title="Atualizar">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b bg-indigo-50/50">
                        <th className="py-3 px-4 font-medium">Aluno</th>
                        <th className="py-3 px-4 font-medium">Total de Faltas</th>
                        <th className="py-3 px-4 font-medium">Presença Hoje</th>
                        <th className="py-3 px-4 font-medium">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredAlunos().map((aluno) => (
                        <tr key={aluno.id} className="border-b last:border-b-0 hover:bg-indigo-50/30 transition-all">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{aluno.nome}</div>
                            <div className="text-xs text-gray-500">ID: {aluno.id}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                                aluno.faltas > 5 ? 'bg-red-100 text-red-700' : 
                                aluno.faltas > 3 ? 'bg-amber-100 text-amber-700' : 
                                'bg-green-100 text-green-700'
                              }`}>
                                {aluno.faltas}
                              </span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    aluno.faltas > 5 ? 'bg-red-500' : 
                                    aluno.faltas > 3 ? 'bg-amber-500' : 
                                    'bg-green-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, (aluno.faltas / 8) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={presencaAlunos[aluno.id] || false}
                                  onChange={() => togglePresenca(aluno.id)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ms-2 text-sm font-medium text-gray-600 peer-checked:text-indigo-700">
                                  {presencaAlunos[aluno.id] ? 'Presente' : 'Ausente'}
                                </span>
                              </label>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Adicionar observação..."
                              />
                              <button className="text-indigo-600 hover:text-indigo-800">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
                  <div className="text-sm text-gray-500">
                    Exibindo {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length} alunos
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Legenda:</span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span> Baixo (≤ 3)
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="inline-block w-3 h-3 bg-amber-500 rounded-full"></span> Médio (4-5)
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span> Alto (≥ 6)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visualização de frequência por aluno */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Histórico de Frequência - Turma {turmaSelecionada}
                </h3>
                
                <div className="flex gap-2 mt-2 md:mt-0">
                  <select className="border border-gray-300 rounded-lg py-1.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="junho">Junho 2024</option>
                    <option value="maio">Maio 2024</option>
                    <option value="abril">Abril 2024</option>
                  </select>
                  
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <RefreshCw className="w-3 h-3" /> Atualizar
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-indigo-700 border-b bg-indigo-50/50">
                      <th className="py-2 px-2 font-medium sticky left-0 bg-indigo-50/50 z-10">Aluno</th>
                      {Array.from({ length: 10 }, (_, i) => (
                        <th key={i} className="py-2 px-2 font-medium text-center whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <span>{format(new Date(2024, 5, i + 1), "dd/MM")}</span>
                            <span className="text-xs text-gray-500">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][new Date(2024, 5, i + 1).getDay()]}</span>
                          </div>
                        </th>
                      ))}
                      <th className="py-2 px-2 font-medium text-center">Faltas</th>
                      <th className="py-2 px-2 font-medium text-center">Frequência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].map((aluno) => {
                      // Gerar presença aleatória para exemplo
                      const presencas = Array.from({ length: 10 }, () => Math.random() > 0.2);
                      const faltas = presencas.filter(p => !p).length;
                      const frequencia = ((presencas.length - faltas) / presencas.length * 100).toFixed(0);
                      
                      return (
                        <tr key={aluno.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-all">
                          <td className="py-2 px-2 sticky left-0 bg-white z-10 hover:bg-gray-50">
                            <div className="font-medium text-gray-900">{aluno.nome}</div>
                          </td>
                          {presencas.map((presente, idx) => (
                            <td key={idx} className="py-2 px-2 text-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                presente 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              } transition-colors cursor-pointer`}>
                                {presente ? 'P' : 'F'}
                              </span>
                            </td>
                          ))}
                          <td className="py-2 px-2 text-center font-medium">
                            <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md ${
                              Number(faltas) > 2 ? 'bg-red-100 text-red-700' :
                              Number(faltas) > 0 ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {faltas}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    Number(frequencia) < 75 ? 'bg-red-500' : 
                                    Number(frequencia) < 85 ? 'bg-amber-500' : 
                                    'bg-green-500'
                                  }`} 
                                  style={{ width: `${frequencia}%` }}
                                ></div>
                              </div>
                              <span className={`font-medium text-xs ${
                                Number(frequencia) < 75 ? 'text-red-600' : 
                                Number(frequencia) < 85 ? 'text-amber-600' : 
                                'text-green-600'
                              }`}>
                                {frequencia}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6 text-sm text-gray-500 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-[10px] text-green-700 font-bold">P</span>
                    <span>Presente</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-[10px] text-red-700 font-bold">F</span>
                    <span>Ausente</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Limite de faltas: 25% (8 aulas)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Seção de Conteúdo Programático */}
        {section === 'conteudos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" /> Conteúdo Programático
              </h1>
              
              <div className="flex gap-2 items-center">
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg border ${modoVisualizacao === 'lista' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700'}`}
                  onClick={() => setModoVisualizacao("lista")}
                  title="Visualização em lista"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg border ${modoVisualizacao === 'kanban' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700'}`}
                  onClick={() => setModoVisualizacao("kanban")}
                  title="Visualização em quadro Kanban"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpenCheck className="w-5 h-5 text-indigo-600" /> Gerenciar Conteúdos
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome} - {turma.disciplina}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Período</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="1">1º Bimestre</option>
                      <option value="2">2º Bimestre</option>
                      <option value="3">3º Bimestre</option>
                      <option value="4">4º Bimestre</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Filtrar por Status</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onChange={(e) => setFiltroConteudo(e.target.value)}
                      value={filtroConteudo}
                    >
                      <option value="">Todos os status</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Não iniciado">Não iniciado</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Progresso</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Conteúdo ministrado</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                          <span className="block font-bold">{mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === "Concluído").length}</span>
                          <span>Concluídos</span>
                        </div>
                        <div className="bg-amber-100 text-amber-800 p-2 rounded-lg">
                          <span className="block font-bold">{mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === "Em andamento").length}</span>
                          <span>Em andamento</span>
                        </div>
                        <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
                          <span className="block font-bold">{mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === "Não iniciado").length}</span>
                          <span>Não iniciados</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                      onClick={() => setNovoConteudoModal(true)}
                    >
                      <PlusCircle className="w-4 h-4" /> Novo Conteúdo
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.success("Relatório de progresso gerado!")}
                    >
                      <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" /> Conteúdos da Turma {turmaSelecionada}
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar conteúdo..."
                        className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => setFiltroConteudo(e.target.value)}
                        value={filtroConteudo}
                      />
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-indigo-200 text-indigo-700"
                      onClick={() => toast.success("Exportando plano de ensino...")}
                    >
                      <Download className="w-4 h-4 mr-1" /> Exportar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-indigo-600"
                      onClick={() => toast.success("Plano de ensino atualizado!")}
                    >
                      <Save className="w-4 h-4 mr-1" /> Salvar
                    </Button>
                  </div>
                </div>
                
                {modoVisualizacao === "lista" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-indigo-700 border-b bg-indigo-50/50">
                          <th className="py-3 px-4 font-medium">Unidade</th>
                          <th className="py-3 px-4 font-medium">Conteúdo</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                          <th className="py-3 px-4 font-medium">Data Prevista</th>
                          <th className="py-3 px-4 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockConteudos
                          .filter(c => c.turma === turmaSelecionada)
                          .filter(c => !filtroConteudo || c.titulo.toLowerCase().includes(filtroConteudo.toLowerCase()) || c.status.includes(filtroConteudo))
                          .map((conteudo) => (
                          <tr 
                            key={conteudo.id} 
                            className={`border-b last:border-b-0 hover:bg-indigo-50/30 transition-colors ${conteudoSelecionado?.id === conteudo.id ? 'bg-indigo-50/70' : ''}`}
                            onClick={() => setConteudoSelecionado(conteudo)}
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium">{conteudo.unidade}</div>
                            </td>
                            <td className="py-4 px-4">{conteudo.titulo}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                conteudo.status === 'Concluído' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                conteudo.status === 'Em andamento' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                                'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {conteudo.status === 'Concluído' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                {conteudo.status === 'Em andamento' && <Clock className="w-3 h-3 inline mr-1" />}
                                {conteudo.status === 'Não iniciado' && <Calendar className="w-3 h-3 inline mr-1" />}
                                {conteudo.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {format(new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 30) + 1), "dd/MM/yyyy")}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConteudoSelecionado(conteudo);
                                    toast.success(`Editando: ${conteudo.titulo}`);
                                  }}
                                >
                                  <Edit2 className="w-3 h-3 mr-1" /> Editar
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success(`Materiais: ${conteudo.titulo}`);
                                  }}
                                >
                                  <FilePlus className="w-3 h-3 mr-1" /> Materiais
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {["Não iniciado", "Em andamento", "Concluído"].map(status => (
                        <div key={status} className="border rounded-lg overflow-hidden">
                          <div className={`p-3 border-b ${
                            status === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200' : 
                            status === 'Em andamento' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium flex items-center gap-1">
                                {status === 'Concluído' && <CheckCircle className="w-4 h-4" />}
                                {status === 'Em andamento' && <Clock className="w-4 h-4" />} 
                                {status === 'Não iniciado' && <Calendar className="w-4 h-4" />}
                                {status}
                              </h3>
                              <span className="text-xs bg-white py-1 px-2 rounded-full">
                                {mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === status).length} itens
                              </span>
                            </div>
                          </div>
                          <div className="p-2 max-h-[400px] overflow-y-auto bg-gray-50">
                            {mockConteudos
                              .filter(c => c.turma === turmaSelecionada && c.status === status)
                              .filter(c => !filtroConteudo || c.titulo.toLowerCase().includes(filtroConteudo.toLowerCase()))
                              .map(conteudo => (
                                <div 
                                  key={conteudo.id} 
                                  className="bg-white p-3 mb-2 rounded-lg shadow-sm hover:shadow cursor-pointer border border-gray-100"
                                  onClick={() => setConteudoSelecionado(conteudo)}
                                >
                                  <div className="text-sm font-medium">{conteudo.titulo}</div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">{conteudo.unidade}</span>
                                    <div className="flex gap-1">
                                      <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                        <FilePlus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                            ))}
                            
                            {mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === status).length === 0 && (
                              <div className="bg-white border border-dashed border-gray-300 p-4 rounded-lg text-center text-gray-500 text-sm">
                                Nenhum conteúdo com este status
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                  <div>Exibindo {mockConteudos.filter(c => c.turma === turmaSelecionada).length} conteúdos</div>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Concluído</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Em andamento</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Não iniciado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seção de Meus Horários */}
        {section === 'horarios' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" /> Meus Horários
              </h1>
              
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <select className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="atual">Semana Atual</option>
                    <option value="proxima">Próxima Semana</option>
                    <option value="mensal">Visão Mensal</option>
                  </select>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-indigo-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Quadro de Horários Semanal
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-indigo-200 text-indigo-700"
                    onClick={() => toast.success("Exportando horários...")}
                  >
                    <Download className="w-4 h-4" /> Exportar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-indigo-200 text-indigo-700"
                    onClick={() => toast.success("Sincronizando com Google Calendar...")}
                  >
                    <RefreshCw className="w-4 h-4" /> Sincronizar Calendário
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-2 font-medium text-indigo-700 border border-gray-200 bg-indigo-50 sticky left-0 z-10">Horário</th>
                      {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((dia, index) => (
                        <th key={dia} className="py-4 px-4 font-medium text-indigo-700 border border-gray-200 bg-indigo-50 min-w-[150px]">
                          <div className="flex flex-col items-center">
                            <span>{dia}</span>
                            <span className="text-xs text-indigo-400">{format(addDays(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)), index), "dd/MM")}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "07:30 - 08:20",
                      "08:20 - 09:10",
                      "09:10 - 10:00",
                      "10:20 - 11:10",
                      "11:10 - 12:00",
                      "13:30 - 14:20",
                      "14:20 - 15:10",
                      "15:10 - 16:00"
                    ].map((horario) => (
                      <tr key={horario} className="hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium border border-gray-200 bg-gray-50 sticky left-0 z-10">{horario}</td>
                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((dia) => {
                          const aula = mockHorarios.find(h => h.dia === dia)?.aulas.find(a => a.horario === horario);
                          
                          return (
                            <td 
                              key={`${dia}-${horario}`} 
                              className={`py-3 px-3 border border-gray-200 ${
                                aula 
                                  ? aula.turma === '1A' 
                                    ? 'bg-indigo-50 hover:bg-indigo-100' 
                                    : aula.turma === '1B' 
                                      ? 'bg-amber-50 hover:bg-amber-100'
                                      : 'bg-green-50 hover:bg-green-100'
                                  : 'hover:bg-gray-50'
                              } transition-colors cursor-pointer`}
                              onClick={() => aula && toast.success(`Aula: ${aula.turma} - ${horario}`)}
                            >
                              {aula ? (
                                <div className="flex items-start gap-2">
                                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white ${
                                    aula.turma === '1A' ? 'bg-indigo-500' :
                                    aula.turma === '1B' ? 'bg-amber-500' :
                                    'bg-green-500'
                                  }`}>
                                    {aula.turma}
                                  </div>
                                  <div>
                                    <div className={`font-medium ${
                                      aula.turma === '1A' ? 'text-indigo-700' :
                                      aula.turma === '1B' ? 'text-amber-700' :
                                      'text-green-700'
                                    }`}>{aula.turma}</div>
                                    <div className="text-xs text-gray-500">Matemática</div>
                                  </div>
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-indigo-500 rounded"></span> Turma 1A
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-amber-500 rounded"></span> Turma 1B
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded"></span> Turma 2A
                  </span>
                </div>
                <div>
                  <span>Total: 18 aulas por semana</span>
                </div>
              </div>
            </div>
            
            {/* Lista de aulas da semana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" /> Próximas Aulas
                </h3>
                
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:shadow-md transition-shadow">
                    <div className="flex gap-3 items-start">
                      <div className="h-12 w-12 bg-indigo-500 text-white rounded-lg flex flex-col items-center justify-center font-bold text-xs">
                        <span className="text-[10px] uppercase">Hoje</span>
                        <span>{format(new Date(), "dd/MM")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-indigo-800">Turma 1A • Matemática</h4>
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-indigo-700 border border-indigo-200">07:30 - 08:20</span>
                    </div>
                        <p className="text-sm text-gray-600 mt-1">Sala 12 • Bloco A</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded inline-flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Frações
                  </div>
                          <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                            <Edit2 className="w-3 h-3" /> Plano de Aula
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-green-100 bg-green-50 hover:shadow-md transition-shadow">
                    <div className="flex gap-3 items-start">
                      <div className="h-12 w-12 bg-green-500 text-white rounded-lg flex flex-col items-center justify-center font-bold text-xs">
                        <span className="text-[10px] uppercase">Hoje</span>
                        <span>{format(new Date(), "dd/MM")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-green-800">Turma 2A • Matemática</h4>
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-green-700 border border-green-200">13:30 - 14:20</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Sala 8 • Bloco B</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Estatística
                          </div>
                          <button className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1">
                            <Edit2 className="w-3 h-3" /> Plano de Aula
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex gap-3 items-start">
                      <div className="h-12 w-12 bg-indigo-500 text-white rounded-lg flex flex-col items-center justify-center font-bold text-xs">
                        <span className="text-[10px] uppercase">Amanhã</span>
                        <span>{format(addDays(new Date(), 1), "dd/MM")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Turma 1A • Matemática</h4>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">08:20 - 09:10</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Sala 12 • Bloco A</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-flex items-center gap-1">
                            <CheckSquare className="w-3 h-3" /> Avaliação
                          </div>
                          <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Prova
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-2 text-gray-700">
                    Ver todas as aulas
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" /> Resumo de Carga Horária
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                      <span className="block text-xl font-bold text-indigo-700">18</span>
                      <span className="text-sm text-indigo-600">Aulas por semana</span>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <span className="block text-xl font-bold text-green-700">72</span>
                      <span className="text-sm text-green-600">Horas mensais</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                      <span className="block text-xl font-bold text-amber-700">3</span>
                      <span className="text-sm text-amber-600">Turmas</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                      <PieChart className="w-4 h-4 text-indigo-600" /> Distribuição por Turma
                    </h4>
                    
                    {mockTurmas.map((turma) => {
                      const aulasTurma = mockHorarios.reduce((acc, dia) => {
                        return acc + dia.aulas.filter(a => a.turma === turma.nome).length;
                      }, 0);
                      const porcentagem = (aulasTurma / 18) * 100;
                      
                      return (
                        <div key={turma.id} className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">Turma {turma.nome}</span>
                            <span>{aulasTurma} aulas ({porcentagem.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                turma.nome === '1A' ? 'bg-indigo-600' : 
                                turma.nome === '1B' ? 'bg-amber-500' : 
                                'bg-green-500'
                              }`} 
                              style={{ width: `${porcentagem}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-amber-600" /> Atividades Extras
                    </h4>
                    <div className="text-sm text-amber-800 space-y-2">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3 h-3 mt-1 flex-shrink-0 text-amber-600" />
                        <p>Monitorias às quintas-feiras, das 16:10 às 17:00.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3 h-3 mt-1 flex-shrink-0 text-amber-600" />
                        <p>Reunião de departamento na última sexta-feira do mês.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3 h-3 mt-1 flex-shrink-0 text-amber-600" />
                        <p>Plantão de dúvidas para o 3º ano: segundas 16:10 às 17:00.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-indigo-200 text-indigo-700"
                      onClick={() => toast.success("Solicitação enviada para coordenação!")}
                    >
                      Solicitar Alteração
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-indigo-600"
                      onClick={() => toast.success("Gerando relatório de carga horária...")}
                    >
                      Gerar Relatório
                    </Button>
                  </div>
                </div>
                        </div>
                      </div>
          </div>
        )}
        
        {/* Seção de Comunicações */}
        {section === 'mensagens' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-indigo-600" /> Comunicações
              </h1>
              
              <div className="flex gap-2 items-center">
                <Button 
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => toast.success("Nova mensagem criada")}
                >
                  <Plus className="w-4 h-4" /> Nova Mensagem
                </Button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                              </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                            </>
                          ) : (
                            <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                              </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                            </>
                          )}
                </button>
                      </div>
                    </div>
                    
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Coluna da esquerda - Navegação de mensagens */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center justify-between">
                    <span>Caixa de Entrada</span>
                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                      {mockMensagens.filter(m => !m.lida).length}
                    </Badge>
                  </h3>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar mensagens..."
                        className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search className="w-4 h-4" />
                        </div>
                      </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all bg-indigo-100 text-indigo-700 font-semibold">
                      <Inbox className="w-4 h-4" /> Recebidas <span className="ml-auto bg-indigo-200 text-indigo-800 text-xs px-1.5 py-0.5 rounded-full">{mockMensagens.length}</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <Send className="w-4 h-4" /> Enviadas <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">5</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <Star className="w-4 h-4" /> Favoritas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <Archive className="w-4 h-4" /> Arquivadas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <Trash2 className="w-4 h-4" /> Lixeira
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Categorias</h3>
                  
                  <div className="space-y-3">
                        <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Coordenação</span>
                        </div>
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">3</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Sistema</span>
                      </div>
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Pais e Responsáveis</span>
                        </div>
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">5</span>
                      </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Direção</span>
                      </div>
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">1</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      className="text-sm text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors"
                      onClick={() => toast.success("Gerenciando categorias")}
                    >
                      <Settings className="w-3.5 h-3.5" /> Gerenciar Categorias
                    </button>
                  </div>
                </div>
                
                          <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => toast.success("Nova mensagem")}
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Nova Mensagem
                          </Button>
                        </div>
              
              {/* Coluna do meio - Lista de mensagens */}
              <div className="md:col-span-1 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Mensagens</h3>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title="Atualizar">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title="Mais ações">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                      </div>
                    </div>
                    
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  {mockMensagens.map((mensagem) => (
                    <div 
                      key={mensagem.id} 
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        mensagemSelecionada?.id === mensagem.id 
                          ? 'bg-indigo-50 border-l-4 border-l-indigo-500' 
                          : mensagem.lida 
                            ? 'hover:bg-gray-50 border-l-4 border-l-transparent' 
                            : 'bg-indigo-50 hover:bg-indigo-100 border-l-4 border-l-indigo-500'
                      }`}
                      onClick={() => setMensagemSelecionada(mensagem)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-800 flex items-center gap-1.5">
                          {!mensagem.lida && (
                            <div className="w-2 h-2 rounded-full bg-indigo-600 mt-0.5"></div>
                          )}
                          <span className="line-clamp-1">{mensagem.assunto}</span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {format(parseISO(mensagem.data), "dd/MM")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> {mensagem.remetente}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {mensagem.id === 1 ? 'Prezado(a) Professor(a), informamos que haverá reunião pedagógica na próxima sexta-feira às 14h na sala de reuniões.' : 
                         mensagem.id === 2 ? 'Lembramos que o prazo para lançamento de notas do 2º bimestre se encerra no dia 30/06. Por favor, não deixe para última hora.' :
                         'Gostaria de agendar uma reunião para discutir o desempenho do meu filho nas últimas avaliações. Quando seria possível?'}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        {!mensagem.lida && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                            Não lida
                          </span>
                        )}
                        <div className="flex gap-1 ml-auto">
                          <button className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Favoritar">
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Arquivar">
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Coluna da direita - Visualização da mensagem selecionada */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {mensagemSelecionada ? (
                  <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-medium text-gray-900">{mensagemSelecionada.assunto}</h3>
                        <div className="flex gap-1">
                          <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50" title="Arquivar">
                            <Archive className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-amber-500 rounded-lg hover:bg-amber-50" title="Favoritar">
                            <Star className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${mensagemSelecionada.remetente.split('(')[0].trim()}&background=c7d2fe&color=4f46e5`} />
                            <AvatarFallback>{mensagemSelecionada.remetente[0]}</AvatarFallback>
                          </Avatar>
                    <div>
                            <p className="font-medium text-gray-700">{mensagemSelecionada.remetente}</p>
                            <p className="text-xs text-gray-500">Para: {user.name} ({user.disciplina})</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p>{format(parseISO(mensagemSelecionada.data), "dd/MM/yyyy")}</p>
                          <p className="text-xs">{format(parseISO(mensagemSelecionada.data), "'às' HH:mm")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow overflow-y-auto bg-gray-50">
                      <div className="prose prose-indigo max-w-none bg-white p-5 rounded-lg shadow-sm">
                        {mensagemSelecionada.id === 1 ? (
                          <>
                            <p>Prezado(a) Professor(a),</p>
                            <p>Informamos que haverá reunião pedagógica na próxima sexta-feira às 14h na sala de reuniões. A pauta inclui os seguintes tópicos:</p>
                            <ul>
                              <li>Avaliação do desempenho das turmas no 1º bimestre</li>
                              <li>Planejamento de atividades para o 2º bimestre</li>
                              <li>Estratégias para alunos com dificuldades de aprendizagem</li>
                              <li>Projeto interdisciplinar</li>
                            </ul>
                            <p>Solicitamos que cada professor prepare um breve relato sobre o desempenho de suas turmas para compartilhar na reunião.</p>
                            <p>Contamos com sua presença!</p>
                            <p>Atenciosamente,</p>
                            <p>Maria Silva<br />Coordenadora Pedagógica</p>
                          </>
                        ) : mensagemSelecionada.id === 2 ? (
                          <>
                            <p>Prezado(a) Professor(a),</p>
                            <p>Lembramos que o prazo para lançamento de notas do 2º bimestre se encerra no dia 30/06. Por favor, não deixe para última hora para evitar problemas técnicos ou sobrecarga no sistema.</p>
                            <p>Todas as notas devem ser lançadas no sistema até as 23:59 do dia 30/06. Após esta data, o sistema será bloqueado para lançamentos.</p>
                            <p>Em caso de dúvidas ou dificuldades, entre em contato com o suporte técnico.</p>
                            <p>Atenciosamente,</p>
                            <p>Sistema de Gestão Escolar</p>
                          </>
                        ) : (
                          <>
                            <p>Prezado Professor João,</p>
                            <p>Espero que esteja bem. Sou o pai do aluno Bruno Costa da turma 1A.</p>
                            <p>Gostaria de agendar uma reunião para discutir o desempenho do meu filho nas últimas avaliações. Percebi que ele está tendo dificuldades em alguns conteúdos e gostaria de entender melhor como posso ajudá-lo em casa.</p>
                            <p>Estou disponível nas terças e quintas-feiras após as 18h, ou aos sábados pela manhã. Por favor, me informe qual o melhor horário para você.</p>
                            <p>Agradeço desde já pela atenção.</p>
                            <p>Atenciosamente,</p>
                            <p>Carlos Costa<br />Pai do aluno Bruno Costa</p>
                          </>
                        )}
                      </div>
                      
                      {/* Anexos, se houver */}
                      {mensagemSelecionada.id === 1 && (
                        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                            <Paperclip className="w-4 h-4 text-gray-500" /> Anexos (1)
                      </h4>
                          <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors">
                            <div className="h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-lg text-indigo-700 mr-3">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Pauta_reuniao_pedagogica.pdf</p>
                              <p className="text-xs text-gray-500">PDF • 245 KB</p>
                          </div>
                            <button className="p-2 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-100" title="Baixar">
                              <Download className="w-4 h-4" />
                            </button>
                            </div>
                          </div>
                      )}
                        </div>
                        
                    <div className="p-5 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          placeholder="Escreva uma resposta rápida..."
                          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Button onClick={() => toast.success("Respondendo mensagem")}>
                          Responder
                            </Button>
                        <div className="relative ml-auto">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 rounded hover:bg-gray-100" title="Mais ações">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          </div>
                        </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> {mensagemSelecionada.lida ? 'Lida' : 'Marcando como lida...'}
                      </div>
                        <div className="flex gap-3">
                          <button
                            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={() => toast.success("Encaminhando mensagem")}
                          >
                            <Forward className="w-4 h-4" /> Encaminhar
                          </button>
                          <button
                            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={() => toast.success("Responder a todos")}
                          >
                            <Reply className="w-4 h-4" /> Responder a todos
                          </button>
                    </div>
                  </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-10">
                    <div className="p-5 bg-indigo-50 rounded-full mb-4">
                      <MessageCircle className="w-16 h-16 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma mensagem selecionada</h3>
                    <p className="text-gray-500 text-center mb-6">
                      Selecione uma mensagem da lista para visualizar seu conteúdo
                    </p>
                    <Button 
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => toast.success("Nova mensagem")}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Criar nova mensagem
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Seção de Relatórios */}
        {section === 'relatorios' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" /> Relatórios
              </h1>
              
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Tipos de Relatórios
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Categoria</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="desempenho">Desempenho</option>
                      <option value="frequencia">Frequência</option>
                      <option value="comportamento">Comportamento</option>
                      <option value="atividades">Atividades</option>
                      <option value="comparativo">Comparativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      <option value="todas">Todas as turmas</option>
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Período</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="bimestre1">1º Bimestre</option>
                      <option value="bimestre2">2º Bimestre</option>
                      <option value="bimestre3">3º Bimestre</option>
                      <option value="bimestre4">4º Bimestre</option>
                      <option value="semestre1">1º Semestre</option>
                      <option value="semestre2">2º Semestre</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Relatórios Recentes</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">Desempenho 1A - 1º Bim</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Gerado em 10/06/2024</div>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">Frequência 2A - 1º Bim</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Gerado em 05/06/2024</div>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">Comparativo 1B - 1º Bim</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Gerado em 01/06/2024</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2 flex items-center justify-center gap-2"
                    onClick={() => toast.success("Gerando relatório...")}
                  >
                    <FileText className="w-4 h-4" /> Gerar Relatório
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" /> Relatório de Desempenho - {turmaSelecionada}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toast.success("Salvando como PDF...")}
                    >
                      <Download className="w-4 h-4" /> PDF
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toast.success("Exportando como CSV...")}
                    >
                      <Download className="w-4 h-4" /> CSV
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toast.success("Enviando relatório...")}
                    >
                      <Send className="w-4 h-4" /> Enviar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Desempenho Médio por Avaliação</h4>
                    <div className="bg-gray-50 rounded-lg p-4 h-[300px]">
                      {/* Substituição do gráfico que está causando conflito */}
                      <div className="flex flex-col h-full justify-center">
                        {[
                          {name: 'Prova 1', nota: 7.8},
                          {name: 'Trabalho', nota: 8.5},
                          {name: 'Exercícios', nota: 7.2},
                          {name: 'Participação', nota: 8.0},
                          {name: 'Prova 2', nota: 7.5},
                        ].map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                              <span className="text-sm font-medium text-indigo-700">{item.nota.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full bg-indigo-600" 
                                style={{ width: `${(item.nota / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>0</span>
                          <span>5</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Distribuição de Notas</h4>
                    <div className="bg-gray-50 rounded-lg p-4 h-[300px]">
                      {/* Substituição do gráfico que está causando conflito */}
                      <div className="flex items-end justify-between h-[220px] mt-4">
                        {[
                          {faixa: '0-2', alunos: 0},
                          {faixa: '2-4', alunos: 1},
                          {faixa: '4-6', alunos: 3},
                          {faixa: '6-7', alunos: 5},
                          {faixa: '7-8', alunos: 9},
                          {faixa: '8-9', alunos: 7},
                          {faixa: '9-10', alunos: 3},
                        ].map((item, index) => {
                          const height = (item.alunos / 9) * 100; // 9 é o máximo valor
                          return (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-8 bg-indigo-400 hover:bg-indigo-500 transition-colors rounded-t-md relative group"
                                style={{ height: `${height}%` }}
                              >
                                <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-indigo-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {item.alunos} alunos
                                </span>
                              </div>
                              <span className="text-xs mt-1">{item.faixa}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 text-center text-xs text-gray-500">
                        Faixas de notas
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Desempenho Individual dos Alunos</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-indigo-700 border-b bg-indigo-50/50">
                          <th className="py-3 px-4 font-medium">Aluno</th>
                          <th className="py-3 px-4 font-medium text-center">Média</th>
                          <th className="py-3 px-4 font-medium text-center">Faltas</th>
                          <th className="py-3 px-4 font-medium">Progresso</th>
                          <th className="py-3 px-4 font-medium text-center">Status</th>
                          <th className="py-3 px-4 font-medium text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].slice(0, 8).map((aluno) => (
                          <tr key={aluno.id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{aluno.nome}</div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-medium ${
                                aluno.media >= 7 ? 'text-green-600' : 
                                aluno.media >= 5 ? 'text-amber-600' : 
                                'text-red-600'
                              }`}>
                                {aluno.media.toFixed(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-medium ${
                                aluno.faltas <= 3 ? 'text-green-600' : 
                                aluno.faltas <= 5 ? 'text-amber-600' : 
                                'text-red-600'
                              }`}>
                                {aluno.faltas}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    aluno.media >= 7 ? 'bg-green-500' : 
                                    aluno.media >= 5 ? 'bg-amber-500' : 
                                    'bg-red-500'
                                  }`} 
                                  style={{ width: `${aluno.media * 10}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                aluno.media >= 7 ? 'bg-green-100 text-green-800' : 
                                aluno.media >= 5 ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {aluno.media >= 7 ? 'Aprovado' : 
                                aluno.media >= 5 ? 'Recuperação' : 
                                'Reprovado'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button className="text-indigo-600 hover:text-indigo-800" title="Ver detalhes">
                                <Eye className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Exibindo todos os alunos...")}
                    >
                      Ver todos os alunos
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Observações e Recomendações</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-4">
                      <div className="p-3 border-l-2 border-indigo-500 bg-white rounded-r-lg shadow-sm">
                        <h5 className="font-medium text-indigo-700">Pontos Positivos</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          A turma apresenta bom desempenho geral, com 75% dos alunos com média acima de 7,0. 
                          Participação nas atividades em grupo tem sido excelente.
                        </p>
                      </div>
                      
                      <div className="p-3 border-l-2 border-amber-500 bg-white rounded-r-lg shadow-sm">
                        <h5 className="font-medium text-amber-700">Pontos de Atenção</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Três alunos com média abaixo de 6,0 e mais de 4 faltas, necessitando intervenção. 
                          Rendimento em exercícios de aplicação tem sido menor que o esperado.
                        </p>
                      </div>
                      
                      <div className="p-3 border-l-2 border-green-500 bg-white rounded-r-lg shadow-sm">
                        <h5 className="font-medium text-green-700">Recomendações</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Implementar atividades de reforço para alunos com baixo rendimento.
                          Aumentar feedback positivo para estimular participação.
                          Entrar em contato com responsáveis dos alunos com excesso de faltas.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 block mb-2">Adicionar comentário ao relatório:</label>
                      <textarea 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        placeholder="Insira suas observações adicionais aqui..."
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => toast.success("Comentário adicionado!")}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seção Meu Perfil */}
        {section === 'perfil' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-indigo-600" /> Meu Perfil
              </h1>
              
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={toggleSidebar}
                  title={sidebarVisible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
                >
                  {sidebarVisible ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Ocultar Menu</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <span className="hidden sm:inline">Mostrar Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna da esquerda - Informações do Perfil */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-4xl font-bold text-indigo-500">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <button 
                        className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
                        onClick={() => toast.success("Alterando foto de perfil...")}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500 text-sm mb-2">{user.email}</p>
                    <div className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium capitalize">
                      {user.role} de {user.disciplina}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2 border-b pb-2">
                        <User className="w-4 h-4 text-indigo-600" /> Informações Pessoais
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-500 w-24">Telefone:</span>
                          <span className="text-sm text-gray-700">{user.telefone}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-500 w-24">Formação:</span>
                          <span className="text-sm text-gray-700">{user.formacao}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-500 w-24">Instituição:</span>
                          <span className="text-sm text-gray-700">{user.instituicao}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-500 w-24">Admissão:</span>
                          <span className="text-sm text-gray-700">{format(parseISO(user.dataAdmissao), "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2 border-b pb-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" /> Mini Biografia
                      </h3>
                      <p className="text-sm text-gray-600">{user.biografia}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => toast.success("Editando perfil...")}
                      >
                        <Edit2 className="w-4 h-4 mr-2" /> Editar Informações
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
                    <Settings className="w-4 h-4 text-indigo-600" /> Preferências de Conta
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Notificações por email</h4>
                        <p className="text-xs text-gray-500">Receber emails sobre atividades e comunicados</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Notificações no sistema</h4>
                        <p className="text-xs text-gray-500">Receber notificações no painel de controle</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Modo escuro</h4>
                        <p className="text-xs text-gray-500">Ativar tema escuro na interface</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          toast.success("Logout realizado com sucesso!");
                          navigate("/login");
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sair do Sistema
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Coluna da direita - Atividades, Estatísticas e Documentos */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" /> Estatísticas de Desempenho
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                      onClick={() => setSection('relatorios')}
                    >
                      Ver relatórios completos
                    </Button>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-indigo-700 uppercase">Turmas Ativas</h4>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          100%
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-800">{mockTurmas.length}</p>
                      <div className="flex items-center text-xs text-indigo-600 mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" /> {mockTurmas.reduce((acc, curr) => acc + curr.alunos, 0)} alunos no total
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-green-700 uppercase">Média Geral</h4>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Bom
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-800">
                        {(Object.values(mockAlunos).reduce((acc, curr) => {
                          return acc + curr.reduce((sum, aluno) => sum + aluno.media, 0);
                        }, 0) / Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0)).toFixed(1)}
                      </p>
                      <div className="flex items-center text-xs text-green-600 mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" /> 0.3 acima do bimestre anterior
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-amber-700 uppercase">Aulas Ministradas</h4>
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          Esse mês
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-amber-800">54</p>
                      <div className="flex items-center text-xs text-amber-600 mt-2">
                        <CheckCircle className="w-3 h-3 mr-1" /> 100% de presença
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Distribuição de Notas por Turma</h4>
                    <div className="h-48">
                      {/* Substituição do gráfico que causaria conflito */}
                      <div className="flex items-end h-40 gap-2">
                        {Object.keys(TURMA_COLORS).map((turma) => {
                          const mediaGeral = (mockAlunos[turma as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                            mockAlunos[turma as keyof typeof mockAlunos].length);
                          const height = (mediaGeral / 10) * 100;
                          
                          return (
                            <div key={turma} className="flex-1 flex flex-col items-center">
                              <div 
                                style={{ 
                                  height: `${height}%`, 
                                  backgroundColor: TURMA_COLORS[turma as keyof typeof TURMA_COLORS] 
                                }}
                                className="w-full rounded-t-md relative group"
                              >
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  Média: {mediaGeral.toFixed(1)}
                                </span>
                              </div>
                              <span className="mt-2 text-xs font-medium">{turma}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" /> Atividades Recentes
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Ver todas
                    </Button>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="min-w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Você lançou notas da <span className="font-medium">Turma 1A</span></p>
                        <p className="text-xs text-gray-500">Hoje, 10:15</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="min-w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FilePlus className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Você criou uma nova atividade: <span className="font-medium">Avaliação Bimestral</span></p>
                        <p className="text-xs text-gray-500">Ontem, 15:30</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="min-w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Você recebeu uma mensagem de <span className="font-medium">Maria Silva (Coordenadora)</span></p>
                        <p className="text-xs text-gray-500">2 dias atrás</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="min-w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Você atualizou o conteúdo programático da <span className="font-medium">Turma 2A</span></p>
                        <p className="text-xs text-gray-500">3 dias atrás</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" /> Meus Documentos
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                      onClick={() => toast.success("Upload de documento iniciado...")}
                    >
                      <Upload className="w-3 h-3 mr-1" /> Upload
                    </Button>
                  </h3>
                  
                  <div className="divide-y">
                    <div className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Planejamento_Anual_2024.pdf</p>
                          <p className="text-xs text-gray-500">PDF • 2.3 MB • Enviado em 01/02/2024</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Projeto_Interdisciplinar.docx</p>
                          <p className="text-xs text-gray-500">DOCX • 1.5 MB • Enviado em 15/03/2024</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Relatório_Semestral.xlsx</p>
                          <p className="text-xs text-gray-500">XLSX • 3.8 MB • Enviado em 10/06/2024</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-indigo-800 mb-2">Precisa de ajuda?</h3>
                      <p className="text-sm text-indigo-600 mb-4">Entre em contato com o suporte técnico ou acesse nossos tutoriais.</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                          Ver tutoriais
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          Contatar suporte
                        </Button>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <MessageCircle className="w-16 h-16 text-indigo-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Adicionar todas as seções implementadas na condição e remover duplicação */}
        {section !== 'visao' && section !== 'turmas' && section !== 'mensagens' && section !== 'atividades' && section !== 'notas' && section !== 'frequencia' && section !== 'conteudos' && section !== 'horarios' && section !== 'relatorios' && section !== 'perfil' && (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
              <BookOpenCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Em construção</h2>
              <p className="text-gray-600 mb-6">
                A seção "{section.charAt(0).toUpperCase() + section.slice(1)}" está em desenvolvimento.
                Novas funcionalidades serão disponibilizadas em breve!
              </p>
              <Button onClick={() => setSection('visao')}>
                Voltar para Visão Geral
                    </Button>
            </div>
          </div>
        )}
        
        {/* Modal de Detalhes do Aluno */}
        {showAlunoDetalhes && alunoSelecionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" /> Detalhes do Aluno
                </h3>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowAlunoDetalhes(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Coluna da esquerda - Informações do Aluno */}
                  <div>
                    <div className="flex flex-col items-center mb-6">
                      <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold mb-3">
                        {alunoSelecionado.nome.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">{alunoSelecionado.nome}</h4>
                      <p className="text-gray-500 text-sm">ID: {alunoSelecionado.id}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alunoSelecionado.media >= 7 ? 'bg-green-100 text-green-800' : 
                          alunoSelecionado.media >= 5 ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {alunoSelecionado.media >= 7 ? 'Aprovado' : 
                          alunoSelecionado.media >= 5 ? 'Em recuperação' : 
                          'Reprovado'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-600" /> Informações Pessoais
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-gray-500">Turma:</span>
                          <span className="font-medium">{turmaSelecionada}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-gray-500">Data de Nasc.:</span>
                          <span className="font-medium">12/06/2010</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-gray-500">Responsável:</span>
                          <span className="font-medium">Maria da Silva</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-gray-500">Telefone:</span>
                          <span className="font-medium">(11) 98765-4321</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium">aluno@email.com</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center justify-center gap-1.5"
                        onClick={() => {
                          setSection('mensagens');
                          setShowAlunoDetalhes(false);
                          toast.success(`Enviando mensagem para responsável de ${alunoSelecionado.nome}`);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" /> Contatar Responsável
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center justify-center gap-1.5"
                        onClick={() => {
                          toast.success(`Exportando relatório de ${alunoSelecionado.nome}`);
                        }}
                      >
                        <FileText className="w-4 h-4" /> Gerar Relatório
                      </Button>
                    </div>
                  </div>
                  
                  {/* Coluna do meio - Desempenho Acadêmico */}
                  <div>
                    <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                      <h5 className="text-sm font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2 flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4" /> Desempenho Acadêmico
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-600">Média Geral</span>
                            <span className={`text-sm font-bold ${
                              alunoSelecionado.media >= 7 ? 'text-green-600' : 
                              alunoSelecionado.media >= 5 ? 'text-amber-600' : 
                              'text-red-600'
                            }`}>{alunoSelecionado.media.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                alunoSelecionado.media >= 7 ? 'bg-green-500' : 
                                alunoSelecionado.media >= 5 ? 'bg-amber-500' : 
                                'bg-red-500'
                              }`} 
                              style={{ width: `${alunoSelecionado.media * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-600">Última Avaliação</span>
                            <span className={`text-sm font-bold ${
                              alunoSelecionado.ultimaNota >= 7 ? 'text-green-600' : 
                              alunoSelecionado.ultimaNota >= 5 ? 'text-amber-600' : 
                              'text-red-600'
                            }`}>{alunoSelecionado.ultimaNota.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                alunoSelecionado.ultimaNota >= 7 ? 'bg-green-500' : 
                                alunoSelecionado.ultimaNota >= 5 ? 'bg-amber-500' : 
                                'bg-red-500'
                              }`} 
                              style={{ width: `${alunoSelecionado.ultimaNota * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <h6 className="text-xs font-medium text-indigo-700 mt-4 mb-2">Notas por Avaliação</h6>
                      <div className="space-y-2">
                        {[
                          { nome: "Prova 1", nota: 7.5 },
                          { nome: "Trabalho em Grupo", nota: 8.0 },
                          { nome: "Exercícios", nota: 6.5 },
                          { nome: "Prova 2", nota: alunoSelecionado.ultimaNota }
                        ].map((avaliacao, index) => (
                          <div key={index} className="p-2 bg-white rounded border border-indigo-100">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">{avaliacao.nome}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                avaliacao.nota >= 7 ? 'bg-green-100 text-green-700' : 
                                avaliacao.nota >= 5 ? 'bg-amber-100 text-amber-700' : 
                                'bg-red-100 text-red-700'
                              }`}>{avaliacao.nota.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-amber-700 mb-3 border-b border-amber-100 pb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4" /> Frequência
                      </h5>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">Total de Faltas</span>
                        <span className={`text-sm font-bold ${
                          alunoSelecionado.faltas > 5 ? 'text-red-600' : 
                          alunoSelecionado.faltas > 3 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>{alunoSelecionado.faltas}</span>
                      </div>
                      <div className="w-full bg-amber-200/40 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full ${
                            alunoSelecionado.faltas > 5 ? 'bg-red-500' : 
                            alunoSelecionado.faltas > 3 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${Math.min(100, (alunoSelecionado.faltas / 25) * 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2 rounded-lg">
                        <div>
                          <p className="text-gray-500">Taxa de Presença</p>
                          <p className="font-bold text-green-600">
                            {((40 - alunoSelecionado.faltas) / 40 * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="border-x border-gray-100">
                          <p className="text-gray-500">Aulas</p>
                          <p className="font-bold text-indigo-600">40</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Presença</p>
                          <p className="font-bold text-indigo-600">{40 - alunoSelecionado.faltas}</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-amber-600 mt-3 flex items-start gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>O limite máximo de faltas é 10 (25% da carga horária)</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Coluna da direita - Atividades e Observações */}
                  <div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-indigo-600" /> Atividades Pendentes
                      </h5>
                      {[
                        { titulo: "Trabalho de Equações", prazo: "20/06/2024", status: "Pendente" },
                        { titulo: "Listas de Exercícios", prazo: "25/06/2024", status: "Pendente" }
                      ].map((atividade, index) => (
                        <div key={index} className="mb-2 p-2 bg-indigo-50 rounded border border-indigo-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{atividade.titulo}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Prazo: {atividade.prazo}
                              </p>
                            </div>
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">
                              {atividade.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            toast.success(`Ver todas as atividades de ${alunoSelecionado.nome}`);
                          }}
                        >
                          Ver todas
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-indigo-600" /> Observações
                      </h5>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border-l-2 border-indigo-400 bg-indigo-50">
                          <p className="text-xs text-gray-600">
                            Aluno demonstra facilidade com operações matemáticas, mas precisa melhorar a interpretação de problemas.
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">
                            10/05/2024 • João Souza
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-lg border-l-2 border-amber-400 bg-amber-50">
                          <p className="text-xs text-gray-600">
                            Conversado com aluno sobre suas faltas recentes. Comprometeu-se a melhorar a frequência.
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">
                            01/06/2024 • João Souza
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <textarea 
                            placeholder="Adicionar uma nova observação..."
                            className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            rows={2}
                          ></textarea>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                              toast.success(`Observação adicionada para ${alunoSelecionado.nome}`);
                            }}
                          >
                            Salvar Observação
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                <Button
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => setShowAlunoDetalhes(false)}
                >
                  Fechar
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-700"
                    onClick={() => {
                      setSection('notas');
                      setShowAlunoDetalhes(false);
                      toast.success(`Editando notas de ${alunoSelecionado.nome}`);
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-1" /> Editar Notas
                  </Button>
                  
                  <Button
                    className="bg-indigo-600"
                    onClick={() => {
                      setSection('mensagens');
                      setShowAlunoDetalhes(false);
                      toast.success(`Iniciando mensagem para responsável de ${alunoSelecionado.nome}`);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" /> Contatar Responsável
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 