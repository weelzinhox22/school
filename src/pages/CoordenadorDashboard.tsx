import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart2, Users, BookOpen, Calendar, MessageCircle,
  Award, LogOut, TrendingUp, Bell, Search, AlertTriangle,
  FileText, BookOpenCheck, ShieldAlert, UserX, TimerOff, Flame,
  Plus, CheckCircle2, XCircle, Upload, Download, Eye, FileWarning, Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import VisaoGeral from "@/components/dashboard/VisaoGeral";
import ProfessoresDashboard from "@/components/dashboard/ProfessoresDashboard";
import TurmasAlunosDashboard from "@/components/dashboard/TurmasAlunosDashboard";
import EventosAcademicosDashboard from "@/components/dashboard/EventosAcademicosDashboard";
import RelatoriosAcademicosDashboard from "@/components/dashboard/RelatoriosAcademicosDashboard";
import ComunicacaoEscolarDashboard from "@/components/dashboard/ComunicacaoEscolarDashboard";
import AcompanhamentoPedagogico from "@/components/dashboard/AcompanhamentoPedagogico";

// Mock de dados para o painel do coordenador
const TURMAS = ["1A", "1B", "2A", "2B", "3A", "3B"];
const TURNOS = ["Manhã", "Tarde"];
const TURMA_COLORS = ["#6366f1", "#f59e42", "#10b981", "#f43f5e", "#eab308", "#3b82f6"];
const TURNO_COLORS = { "Manhã": "#6366f1", "Tarde": "#f59e42" };

const mockNotas = [
  { turma: "1A", turno: "Manhã", media: 7.8 },
  { turma: "1A", turno: "Tarde", media: 8.1 },
  { turma: "1B", turno: "Manhã", media: 6.5 },
  { turma: "1B", turno: "Tarde", media: 8.2 },
  { turma: "2A", turno: "Manhã", media: 6.9 },
  { turma: "2A", turno: "Tarde", media: 7.7 },
  { turma: "2B", turno: "Manhã", media: 7.2 },
  { turma: "2B", turno: "Tarde", media: 7.5 },
  { turma: "3A", turno: "Manhã", media: 8.4 },
  { turma: "3A", turno: "Tarde", media: 7.9 },
  { turma: "3B", turno: "Manhã", media: 7.1 },
  { turma: "3B", turno: "Tarde", media: 8.0 },
];

// Mock de alertas específicos para coordenadores
const mockAlertas = [
  {
    tipo: "nota_baixa",
    titulo: "Alunos com notas baixas",
    mensagem: "3 alunos da turma 2A estão com média abaixo de 6.0.",
    cor: "bg-red-100 text-red-700 border-red-200",
    icone: <AlertTriangle className="w-6 h-6 text-red-500" />,
  },
  {
    tipo: "faltas",
    titulo: "Faltas excessivas",
    mensagem: "2 alunos da turma 1B ultrapassaram o limite de faltas.",
    cor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icone: <UserX className="w-6 h-6 text-yellow-500" />,
  },
  {
    tipo: "professor_notas",
    titulo: "Notas não lançadas",
    mensagem: "1 professor ainda não lançou as notas da turma 3A.",
    cor: "bg-blue-100 text-blue-800 border-blue-200",
    icone: <BookOpenCheck className="w-6 h-6 text-blue-500" />,
  }
];

// Mock de professores para o coordenador gerenciar
const mockProfessores = [
  { id: 1, nome: "João Souza", disciplina: "Matemática", turmas: ["1A", "1B", "2A"], email: "joao@escola.com", status: "Ativo" },
  { id: 2, nome: "Ana Lima", disciplina: "Português", turmas: ["1A", "1B", "3A"], email: "ana@escola.com", status: "Ativo" },
  { id: 3, nome: "Carlos Oliveira", disciplina: "História", turmas: ["2A", "2B", "3B"], email: "carlos@escola.com", status: "Ativo" },
  { id: 4, nome: "Mariana Costa", disciplina: "Geografia", turmas: ["1A", "2B", "3A"], email: "mariana@escola.com", status: "Licença" },
  { id: 5, nome: "Roberto Santos", disciplina: "Ciências", turmas: ["1B", "2A", "3B"], email: "roberto@escola.com", status: "Ativo" },
];

// Mock de eventos acadêmicos
const mockEventosAcademicos = [
  { id: 1, titulo: "Reunião Pedagógica", data: "2024-06-10", tipo: "Reunião" },
  { id: 2, titulo: "Conselho de Classe", data: "2024-06-15", tipo: "Avaliação" },
  { id: 3, titulo: "Preparação para Olimpíada de Matemática", data: "2024-06-18", tipo: "Acadêmico" },
  { id: 4, titulo: "Entrega de Boletins", data: "2024-06-28", tipo: "Entrega" },
];

// Mock de alunos para acompanhamento
const mockAlunos = [
  { id: 1, nome: "Lucas Silva", turma: "1A", media: 7.5, frequencia: 90, status: "Regular" },
  { id: 2, nome: "Ana Souza", turma: "1A", media: 8.2, frequencia: 95, status: "Regular" },
  { id: 3, nome: "Pedro Lima", turma: "1B", media: 6.1, frequencia: 85, status: "Atenção" },
  { id: 4, nome: "Carla Mendes", turma: "2A", media: 5.8, frequencia: 82, status: "Recuperação" },
  { id: 5, nome: "Rafael Costa", turma: "2B", media: 7.2, frequencia: 88, status: "Regular" },
];

// Mock de ranking simplificado
const mockRankingTurmas = [
  { turma: "1A", media: 8.7, frequencia: 97 },
  { turma: "1B", media: 8.2, frequencia: 95 },
  { turma: "2A", media: 8.0, frequencia: 96 },
  { turma: "2B", media: 7.8, frequencia: 94 },
  { turma: "3A", media: 8.5, frequencia: 96 },
  { turma: "3B", media: 8.1, frequencia: 93 },
];

export default function CoordenadorDashboard() {
  const [section, setSection] = useState("visao");
  const [turmaSelecionada, setTurmaSelecionada] = useState("1A");
  const [turnoSelecionado, setTurnoSelecionado] = useState("Manhã");
  const [compareTurnos, setCompareTurnos] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState(null as null | typeof mockAlertas[0]);
  const [mensagem, setMensagem] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("");
  const [professorSelecionado, setProfessorSelecionado] = useState<null | {
    id: number;
    nome: string;
    disciplina?: string;
    turmas?: string[];
    email?: string;
    status?: string;
    horarios?: Record<string, any>;
  }>(null);
  const [, navigate] = useLocation();

  // Simulação de dados do usuário logado
  const user = {
    name: "Maria Silva",
    email: "coordenador@escola.com",
    role: "coordenador"
  };
  
  // Verificação de segurança - redirecionar se não for coordenador
  useEffect(() => {
    // Em uma aplicação real, isso seria verificado com um token JWT ou sessão
    // Aqui estamos simulando com os dados mockados
    if (user.role !== "coordenador") {
      toast.error("Acesso não autorizado. Redirecionando...");
      navigate("/dashboard/diretor");
    }
  }, [user.role, navigate]);

  // Dados para o gráfico
  let chartData: any[] = [];
  if (compareTurnos) {
    // Agrupar por turma, cada turma tem mediaManha e mediaTarde
    chartData = TURMAS.map((turma) => {
      const manha = mockNotas.find(n => n.turma === turma && n.turno === "Manhã");
      const tarde = mockNotas.find(n => n.turma === turma && n.turno === "Tarde");
      return {
        turma,
        Manhã: manha ? manha.media : null,
        Tarde: tarde ? tarde.media : null,
      };
    });
  } else {
    // Mostrar todas as turmas do turno selecionado
    chartData = TURMAS.map((turma, i) => {
      const nota = mockNotas.find(n => n.turma === turma && n.turno === turnoSelecionado);
      return {
        turma,
        media: nota ? nota.media : null,
        color: TURMA_COLORS[i % TURMA_COLORS.length],
      };
    });
  }

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  // Função para enviar notificação
  function handleEnviarNotificacao(e: React.FormEvent) {
    e.preventDefault();
    setAlertaSelecionado(null);
    setMensagem("");
    toast.success("Notificação enviada com sucesso!");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada - Com opções limitadas para coordenador */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 80 }} 
        className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Painel Coordenador</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('visao')}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Visão Geral</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'professores' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('professores')}
          >
            <Users className="w-5 h-5" />
            <span>Professores</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'turmas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('turmas')}
          >
            <BookOpen className="w-5 h-5" />
            <span>Turmas e Alunos</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'eventos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('eventos')}
          >
            <Calendar className="w-5 h-5" />
            <span>Eventos Acadêmicos</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('relatorios')}
          >
            <FileText className="w-5 h-5" />
            <span>Relatórios Acadêmicos</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'comunicacao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('comunicacao')}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comunicação</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'acompanhamento' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('acompanhamento')}
          >
            <TrendingUp className="w-5 h-5" />{" "}
            Acompanhamento Pedagógico
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'orientacao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('orientacao')}
          >
            <BookOpenCheck className="w-5 h-5" />
            <span>Orientação Educacional</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'material' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('material')}
          >
            <FileText className="w-5 h-5" />
            <span>Material Didático</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'ranking' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('ranking')}
          >
            <Award className="w-5 h-5" />
            <span>Ranking Acadêmico</span>
          </button>
        </nav>
        <div className="mt-auto pt-8">
          <Button className="w-full flex gap-2 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => window.location.href = '/'}>
            <LogOut className="w-5 h-5" />
            <span className="ml-2">Sair</span>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Painel de Alertas Pedagógicos */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockAlertas.map((alerta, i) => (
              <motion.div
                key={alerta.tipo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm ${alerta.cor} hover:scale-[1.03] hover:shadow-lg transition-transform cursor-pointer`}
                onClick={() => setAlertaSelecionado(alerta)}
                title="Notificar responsável"
              >
                <div className="flex-shrink-0">{alerta.icone}</div>
                <div>
                  <div className="font-semibold text-base mb-1">{alerta.titulo}</div>
                  <div className="text-sm opacity-80 leading-tight">{alerta.mensagem}</div>
                  <div className="mt-1 text-xs text-indigo-600 underline cursor-pointer">Ver detalhes</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modal de notificação */}
        <AnimatePresence>
          {alertaSelecionado && (
            <motion.div 
              key="modal-alerta" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 30 }} 
                transition={{ type: "spring", stiffness: 120 }} 
                className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
              >
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">{alertaSelecionado.icone} {alertaSelecionado.titulo}</h3>
                <p className="text-gray-700 mb-4">{alertaSelecionado.mensagem}</p>
                <form onSubmit={handleEnviarNotificacao} className="flex flex-col gap-4">
                  <div>
                    <label className="font-medium text-sm mb-1 block">Enviar notificação para:</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" /> Professor responsável
                      </label>
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" /> Pais/Responsáveis
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-sm mb-1 block">Mensagem:</label>
                    <textarea 
                      className="border rounded px-3 py-2 w-full min-h-[60px]" 
                      value={mensagem} 
                      onChange={e => setMensagem(e.target.value)} 
                      placeholder="Digite uma mensagem personalizada..." 
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setAlertaSelecionado(null)}>Cancelar</Button>
                    <Button type="submit">Enviar</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">Bem-vindo, {user.name}!</h1>
            <p className="text-gray-600">Acesso: <span className="capitalize font-semibold">{user.role}</span></p>
          </div>
        </motion.header>

        {/* Conteúdo da seção selecionada */}
        <AnimatePresence mode="wait">
          {section === 'visao' && (
            <VisaoGeral 
              chartData={chartData} 
              cardVariants={cardVariants} 
              compareTurnos={compareTurnos} 
              TURNO_COLORS={TURNO_COLORS}
            />
          )}

          {/* Seção de Professores */}
          {section === 'professores' && (
            <ProfessoresDashboard 
              mockProfessores={mockProfessores}
              mockEventosAcademicos={mockEventosAcademicos}
              cardVariants={cardVariants}
            />
          )}

          {/* Seção de Turmas e Alunos */}
          {section === 'turmas' && (
            <TurmasAlunosDashboard
              TURMAS={TURMAS}
              mockNotas={mockNotas}
              mockRankingTurmas={mockRankingTurmas}
              mockAlunos={mockAlunos}
              cardVariants={cardVariants}
            />
          )}

          {/* Seção de Eventos Acadêmicos */}
          {section === 'eventos' && (
            <EventosAcademicosDashboard 
              mockEventosAcademicos={mockEventosAcademicos}
              cardVariants={cardVariants}
            />
          )}

          {/* Seção de Relatórios Acadêmicos */}
          {section === 'relatorios' && (
            <RelatoriosAcademicosDashboard
              mockRankingTurmas={mockRankingTurmas}
              cardVariants={cardVariants}
              TURMAS={TURMAS}
              TURNO_COLORS={TURNO_COLORS}
            />
          )}

          {/* Seção de Comunicação */}
          {section === 'comunicacao' && (
            <ComunicacaoEscolarDashboard cardVariants={cardVariants} />
          )}

          {/* Seção de Acompanhamento Pedagógico */}
          {section === 'acompanhamento' && (
            <AcompanhamentoPedagogico cardVariants={cardVariants} />
          )}

          {/* Seção de Orientação Educacional */}
          {section === 'orientacao' && (
            <motion.div
              key="orientacao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Orientação Educacional</h2>
                <div className="flex gap-2">
                  <Button className="flex gap-2" onClick={() => toast.success("Relatório de acompanhamento gerado")}>
                    <FileText className="w-5 h-5" /> Relatório de Acompanhamento
                  </Button>
                </div>
              </div>
              
              {/* Lista de estudantes em acompanhamento */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-indigo-700">Alunos em Acompanhamento Especial</h3>
                  <div className="flex items-center gap-2">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todas as turmas</option>
                      {TURMAS.map(turma => (
                        <option key={turma} value={turma}>{turma}</option>
                      ))}
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todos os tipos</option>
                      <option value="aprendizagem">Dificuldade de Aprendizagem</option>
                      <option value="adaptacao">Adaptação Curricular</option>
                      <option value="comportamental">Acompanhamento Comportamental</option>
                      <option value="especial">Necessidades Especiais</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b">
                        <th className="py-3 px-2">Aluno</th>
                        <th className="py-3 px-2">Turma</th>
                        <th className="py-3 px-2">Tipo</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Última Atualização</th>
                        <th className="py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { nome: "Rafael Souza", turma: "1A", tipo: "Dificuldade de Aprendizagem", status: "Em andamento", data: "05/06/2024" },
                        { nome: "Camila Pereira", turma: "2B", tipo: "Adaptação Curricular", status: "Em andamento", data: "02/06/2024" },
                        { nome: "Lucas Mendes", turma: "1B", tipo: "Acompanhamento Comportamental", status: "Finalizado", data: "20/05/2024" },
                        { nome: "Juliana Costa", turma: "3A", tipo: "Necessidades Especiais", status: "Em andamento", data: "01/06/2024" },
                        { nome: "Pedro Almeida", turma: "2A", tipo: "Dificuldade de Aprendizagem", status: "Aguardando", data: "07/06/2024" },
                      ].map((aluno, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                          <td className="py-3 px-2 font-medium">{aluno.nome}</td>
                          <td className="py-3 px-2">{aluno.turma}</td>
                          <td className="py-3 px-2">{aluno.tipo}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              aluno.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 
                              aluno.status === 'Em andamento' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {aluno.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">{aluno.data}</td>
                          <td className="py-3 px-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.success(`Visualizando histórico de ${aluno.nome}`)}
                            >
                              Histórico
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => toast.success(`Agendando sessão com ${aluno.nome}`)}
                            >
                              Agendar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Exibindo 5 de 12 alunos</div>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => toast.success("Adicionando novo aluno para acompanhamento")}
                  >
                    <Plus className="w-4 h-4" /> Adicionar Aluno
                  </Button>
                </div>
              </div>
              
              {/* Sessões agendadas e recursos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Sessões Agendadas
                  </h3>
                  <div className="overflow-y-auto max-h-80">
                    <ul className="space-y-3">
                      {[
                        { aluno: "Rafael Souza", turma: "1A", tipo: "Individual", data: "08/06/2024", hora: "10:00", status: "Confirmada" },
                        { aluno: "Juliana Costa", turma: "3A", tipo: "Com Pais", data: "09/06/2024", hora: "14:30", status: "Pendente" },
                        { aluno: "Camila Pereira", turma: "2B", tipo: "Com Professor", data: "10/06/2024", hora: "11:15", status: "Confirmada" },
                        { aluno: "Pedro Almeida", turma: "2A", tipo: "Individual", data: "12/06/2024", hora: "09:00", status: "Confirmada" },
                      ].map((sessao, idx) => (
                        <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">{sessao.aluno}</span> - {sessao.turma}
                              <div className="text-xs text-gray-500">
                                {sessao.data} às {sessao.hora} • Sessão {sessao.tipo}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs self-start ${
                              sessao.status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {sessao.status}
                            </span>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => toast.success(`Visualizando detalhes da sessão com ${sessao.aluno}`)}
                            >
                              Detalhes
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs"
                              onClick={() => toast.success(sessao.status === 'Confirmada' ? `Reagendando sessão com ${sessao.aluno}` : `Confirmando sessão com ${sessao.aluno}`)}
                            >
                              {sessao.status === 'Confirmada' ? 'Reagendar' : 'Confirmar'}
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Agendando nova sessão de orientação")}
                    >
                      Agendar Nova Sessão
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" /> Recursos e Materiais
                  </h3>
                  <div className="overflow-y-auto max-h-80">
                    <ul className="space-y-3">
                      {[
                        { tipo: "Documento", titulo: "Guia de Adaptação Curricular", categoria: "Adaptação", data: "01/05/2024" },
                        { tipo: "Planilha", titulo: "Modelo de Acompanhamento Individual", categoria: "Monitoramento", data: "10/05/2024" },
                        { tipo: "Apresentação", titulo: "Técnicas de Intervenção Comportamental", categoria: "Comportamento", data: "15/05/2024" },
                        { tipo: "PDF", titulo: "Manual de Atendimento Educacional Especializado", categoria: "AEE", data: "20/05/2024" },
                        { tipo: "Vídeo", titulo: "Treinamento: Estratégias de Ensino Inclusivo", categoria: "Inclusão", data: "25/05/2024" },
                      ].map((recurso, idx) => (
                        <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{recurso.titulo}</span>
                              <div className="text-xs text-gray-500">
                                {recurso.categoria} • Adicionado em {recurso.data}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              recurso.tipo === 'Documento' ? 'bg-blue-100 text-blue-700' : 
                              recurso.tipo === 'Planilha' ? 'bg-green-100 text-green-700' : 
                              recurso.tipo === 'Apresentação' ? 'bg-amber-100 text-amber-700' : 
                              recurso.tipo === 'PDF' ? 'bg-red-100 text-red-700' : 
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {recurso.tipo}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => toast.success(`Visualizando recurso: ${recurso.titulo}`)}
                            >
                              Visualizar
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Adicionando novo recurso")}
                    >
                      Adicionar Novo Recurso
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              {/* Estatísticas de acompanhamento */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" /> Estatísticas de Acompanhamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-indigo-600 uppercase font-semibold mb-1">Total de Alunos</div>
                    <div className="text-2xl font-bold text-indigo-700">12</div>
                    <div className="text-xs text-green-600 mt-1">+2 este mês</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-green-600 uppercase font-semibold mb-1">Intervenções Bem-sucedidas</div>
                    <div className="text-2xl font-bold text-green-700">75%</div>
                    <div className="text-xs text-green-600 mt-1">+5% vs. bimestre anterior</div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-amber-600 uppercase font-semibold mb-1">Acompanhamentos Ativos</div>
                    <div className="text-2xl font-bold text-amber-700">8</div>
                    <div className="text-xs text-amber-600 mt-1">3 novos este mês</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Distribuição por Tipo</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Dificuldade de Aprendizagem</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Adaptação Curricular</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Acompanhamento Comportamental</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Necessidades Especiais</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Próximos Passos</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="bg-indigo-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <FileText className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Preparar relatório bimestral</p>
                          <p className="text-xs text-gray-500">Prazo: 30/06/2024</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <Users className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Reunião com equipe de apoio</p>
                          <p className="text-xs text-gray-500">Data: 15/06/2024</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Revisar planos de intervenção</p>
                          <p className="text-xs text-gray-500">5 planos pendentes</p>
                        </div>
                      </li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => toast.success("Criando novo plano de ação")}>
                      Novo Plano de Ação
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seção de Material Didático */}
          {section === 'material' && (
            <motion.div
              key="material"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Materiais Didáticos</h2>
                <div className="flex gap-2">
                  <Button className="flex gap-2" onClick={() => toast.success("Repositório de materiais aberto")}>
                    <BookOpen className="w-5 h-5" /> Repositório
                  </Button>
                  <Button className="flex gap-2" onClick={() => toast.success("Guia de padronização aberto")}>
                    <FileText className="w-5 h-5" /> Guia de Padronização
                  </Button>
                </div>
              </div>
              
              {/* Materiais pendentes de revisão */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Materiais Pendentes de Revisão</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todos os professores</option>
                      {["João Souza", "Ana Lima", "Carlos Oliveira", "Mariana Costa", "Roberto Santos"].map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todas as disciplinas</option>
                      {["Matemática", "Português", "História", "Geografia", "Ciências"].map(disc => (
                        <option key={disc} value={disc}>{disc}</option>
                      ))}
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todos os tipos</option>
                      <option value="avaliacao">Avaliação</option>
                      <option value="apostila">Apostila</option>
                      <option value="slides">Slides</option>
                      <option value="exercicios">Exercícios</option>
                      <option value="projeto">Projeto</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">12</span> materiais pendentes
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b">
                        <th className="py-3 px-2">Material</th>
                        <th className="py-3 px-2">Professor</th>
                        <th className="py-3 px-2">Disciplina</th>
                        <th className="py-3 px-2">Turma</th>
                        <th className="py-3 px-2">Data</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, titulo: "Avaliação Bimestral", tipo: "Avaliação", professor: "João Souza", disciplina: "Matemática", turma: "1A", data: "05/06/2024", status: "Pendente" },
                        { id: 2, titulo: "Apostila de Interpretação", tipo: "Apostila", professor: "Ana Lima", disciplina: "Português", turma: "1B", data: "04/06/2024", status: "Pendente" },
                        { id: 3, titulo: "Slides Revolução Francesa", tipo: "Slides", professor: "Carlos Oliveira", disciplina: "História", turma: "2A", data: "03/06/2024", status: "Em revisão" },
                        { id: 4, titulo: "Exercícios de Frações", tipo: "Exercícios", professor: "João Souza", disciplina: "Matemática", turma: "1B", data: "02/06/2024", status: "Em revisão" },
                        { id: 5, titulo: "Projeto Ecossistemas", tipo: "Projeto", professor: "Roberto Santos", disciplina: "Ciências", turma: "3A", data: "01/06/2024", status: "Pendente" },
                      ].map((material, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                          <td className="py-3 px-2">
                            <div className="font-medium">{material.titulo}</div>
                            <div className="text-xs text-gray-500">{material.tipo}</div>
                          </td>
                          <td className="py-3 px-2">{material.professor}</td>
                          <td className="py-3 px-2">{material.disciplina}</td>
                          <td className="py-3 px-2">{material.turma}</td>
                          <td className="py-3 px-2">{material.data}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              material.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 
                              material.status === 'Em revisão' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {material.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.success(`Visualizando material: ${material.titulo}`)}
                            >
                              Ver
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => toast.success(`Revisando material: ${material.titulo}`)}
                            >
                              Revisar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Mostrando 5 de 12 materiais</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-indigo-50"
                    >
                      1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      2
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      3
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Estatísticas e ações rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-indigo-600" /> Estatísticas
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Aprovados</span>
                        <span className="text-sm font-medium text-green-600">45 (65%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Em revisão</span>
                        <span className="text-sm font-medium text-blue-600">12 (17%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "17%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Pendentes</span>
                        <span className="text-sm font-medium text-amber-600">12 (17%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "17%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Rejeitados</span>
                        <span className="text-sm font-medium text-red-600">1 (1%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: "1%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={() => toast.success("Gerando relatório detalhado de materiais")}
                  >
                    Gerar Relatório
                  </Button>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" /> Atividade Recente
                  </h3>
                  
                  <ul className="space-y-3">
                    {[
                      { acao: "Apostila aprovada", usuario: "Maria Silva", material: "Leitura avançada - Português", tempo: "15 minutos atrás" },
                      { acao: "Avaliação revisada", usuario: "Maria Silva", material: "Avaliação Bimestral - Matemática", tempo: "1 hora atrás" },
                      { acao: "Projeto aprovado", usuario: "Maria Silva", material: "Projeto Biomas - Ciências", tempo: "3 horas atrás" },
                      { acao: "Exercícios rejeitados", usuario: "Maria Silva", material: "Lista de Verbos - Português", tempo: "Ontem às 15:30" },
                    ].map((atividade, idx) => (
                      <li key={idx} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium">{atividade.acao}</div>
                        <div className="text-gray-500">{atividade.material}</div>
                        <div className="text-xs text-indigo-600 mt-1">{atividade.tempo}</div>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => toast.success("Visualizando histórico completo de atividades")}
                  >
                    Ver Histórico Completo
                  </Button>
                </motion.div>
                
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  
                  <div className="space-y-3">
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Criando modelo de avaliação")}
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-indigo-500 mr-3" />
                        <span>Criar Modelo</span>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Enviando alertas de pendências")}
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-3" />
                        <span>Notificar Pendências</span>
                      </div>
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Visualizando biblioteca de recursos")}
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-green-500 mr-3" />
                        <span>Biblioteca de Recursos</span>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Programando revisões em lote")}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                        <span>Programar Revisões</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              </div>
              
              {/* Biblioteca de modelos */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Biblioteca de Modelos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { titulo: "Modelo de Avaliação", tipo: "Avaliação", disciplina: "Geral", downloads: 45 },
                    { titulo: "Template de Apostila", tipo: "Apostila", disciplina: "Geral", downloads: 38 },
                    { titulo: "Apresentação Padrão", tipo: "Slides", disciplina: "Geral", downloads: 52 },
                    { titulo: "Projeto Interdisciplinar", tipo: "Projeto", disciplina: "Múltiplas", downloads: 27 },
                    { titulo: "Ficha de Exercícios", tipo: "Exercícios", disciplina: "Geral", downloads: 63 },
                    { titulo: "Roteiro de Aula Prática", tipo: "Roteiro", disciplina: "Ciências", downloads: 31 },
                    { titulo: "Guia de Redação", tipo: "Guia", disciplina: "Português", downloads: 42 },
                    { titulo: "Kit Matemática Básica", tipo: "Kit", disciplina: "Matemática", downloads: 36 },
                  ].map((modelo, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 hover:bg-indigo-50 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => toast.success(`Abrindo modelo: ${modelo.titulo}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          modelo.tipo === 'Avaliação' ? 'bg-red-100 text-red-700' : 
                          modelo.tipo === 'Apostila' ? 'bg-blue-100 text-blue-700' : 
                          modelo.tipo === 'Slides' ? 'bg-amber-100 text-amber-700' : 
                          modelo.tipo === 'Projeto' ? 'bg-green-100 text-green-700' : 
                          modelo.tipo === 'Exercícios' ? 'bg-purple-100 text-purple-700' : 
                          modelo.tipo === 'Roteiro' ? 'bg-indigo-100 text-indigo-700' : 
                          modelo.tipo === 'Guia' ? 'bg-cyan-100 text-cyan-700' : 
                          'bg-pink-100 text-pink-700'
                        }`}>
                          {modelo.tipo}
                        </span>
                        <FileText className="h-5 w-5 text-indigo-400" />
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{modelo.titulo}</h4>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{modelo.disciplina}</span>
                        <span className="text-indigo-600">{modelo.downloads} downloads</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => toast.success("Adicionando novo modelo")}
                  >
                    <Plus className="w-5 h-5" /> Adicionar Novo Modelo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 