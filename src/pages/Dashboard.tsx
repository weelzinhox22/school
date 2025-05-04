import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, UserCog, BookOpen, LogOut, Plus, Trash2, AlertTriangle, FileWarning, UserX, BookOpenCheck, Calendar, CalendarDays, PlusCircle, Clock, Award, TrendingUp, Inbox, CheckCircle2, XCircle, FileText, DollarSign, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { toast } from "react-hot-toast";
import { Switch } from "@headlessui/react";
import jsPDF from "jspdf";
import Papa from "papaparse";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";
import { useLocation } from "wouter";
import GestaoTurmas from "@/components/dashboard/GestaoTurmas";
import GestaoPermissoes from "@/components/dashboard/GestaoPermissoes";
import GestaoRelatorios from "@/components/dashboard/GestaoRelatorios";
import GestaoEventos from "@/components/dashboard/GestaoEventos";
import GestaoRanking from "@/components/dashboard/GestaoRanking";
import GestaoHistorico from "@/components/dashboard/GestaoHistorico";
import GestaoSolicitacoes from "@/components/dashboard/GestaoSolicitacoes";

const mockColaboradores = [
  { id: 1, nome: "Maria Silva", email: "maria@escola.com", tipo: "Coordenador", senha: "" },
  { id: 2, nome: "João Souza", email: "joao@escola.com", tipo: "Professor", senha: "" },
  { id: 3, nome: "Ana Lima", email: "ana@escola.com", tipo: "Professor", senha: "" },
];

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

// Mock de alertas inteligentes
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
  },
  {
    tipo: "documentacao",
    titulo: "Documentação pendente",
    mensagem: "5 alunos precisam entregar documentação.",
    cor: "bg-amber-100 text-amber-800 border-amber-200",
    icone: <FileWarning className="w-6 h-6 text-amber-500" />,
  },
];

const mockPermissoes = [
  { id: 1, nome: "Maria Silva", tipo: "Coordenador", permissoes: { verTurmas: true, editarNotas: true, relatorios: true, gerenciarAlunos: false, eventos: true } },
  { id: 2, nome: "João Souza", tipo: "Professor", permissoes: { verTurmas: true, editarNotas: true, relatorios: false, gerenciarAlunos: false, eventos: false } },
  { id: 3, nome: "Ana Lima", tipo: "Professor", permissoes: { verTurmas: true, editarNotas: false, relatorios: false, gerenciarAlunos: false, eventos: false } },
];

type PermKey = 'verTurmas' | 'editarNotas' | 'relatorios' | 'gerenciarAlunos' | 'eventos';
const PERMISSOES_LABELS: Record<PermKey, string> = {
  verTurmas: "Visualizar turmas",
  editarNotas: "Editar notas",
  relatorios: "Acessar relatórios",
  gerenciarAlunos: "Gerenciar alunos",
  eventos: "Gerenciar eventos"
};

const DISCIPLINAS = ["Matemática", "Português", "História", "Geografia", "Ciências"];
const PERIODOS = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre", "Ano Letivo"];
const mockRelatorio = [
  { aluno: "Lucas Silva", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.5, faltas: 2 },
  { aluno: "Ana Souza", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.2, faltas: 0 },
  { aluno: "Pedro Lima", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.1, faltas: 1 },
  { aluno: "Lucas Silva", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 7.9, faltas: 0 },
  { aluno: "Ana Souza", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 8.7, faltas: 0 },
  { aluno: "Pedro Lima", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 5.8, faltas: 2 },
  { aluno: "Lucas Silva", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.8, faltas: 3 },
  { aluno: "Ana Souza", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.2, faltas: 1 },
  { aluno: "Pedro Lima", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.0, faltas: 0 },
];

const mockEventos = [
  { id: 1, titulo: "Reunião Pedagógica", data: "2024-06-10", tipo: "Reunião" },
  { id: 2, titulo: "Prova de Matemática", data: "2024-06-14", tipo: "Prova" },
  { id: 3, titulo: "Festa Junina", data: "2024-06-21", tipo: "Comemorativo" },
  { id: 4, titulo: "Entrega de Boletins", data: "2024-06-28", tipo: "Entrega" },
];
const TIPO_EVENTO = ["Reunião", "Prova", "Comemorativo", "Entrega", "Outro"];

// Simulação de log de auditoria (futuro: integrar com backend)
const mockLog = [
  { id: 1, usuario: "Diretor Teste", acao: "Adicionou evento", detalhe: "Festa Junina", data: "2024-06-01 10:12" },
  { id: 2, usuario: "Diretor Teste", acao: "Editou permissões", detalhe: "Maria Silva - Editar notas", data: "2024-06-02 14:30" },
  { id: 3, usuario: "Diretor Teste", acao: "Exportou relatório", detalhe: "Turma 1A - Matemática", data: "2024-06-03 09:05" },
  { id: 4, usuario: "Diretor Teste", acao: "Removeu colaborador", detalhe: "João Souza", data: "2024-06-04 16:20" },
  { id: 5, usuario: "Diretor Teste", acao: "Enviou alerta", detalhe: "Notas baixas para coordenador", data: "2024-06-05 11:45" },
];

// Mock de rankings
const mockRankingAlunos = [
  { nome: "Ana Souza", turma: "1A", nota: 9.2, frequencia: 98, participacao: 95 },
  { nome: "Lucas Silva", turma: "1A", nota: 8.8, frequencia: 97, participacao: 92 },
  { nome: "Pedro Lima", turma: "1B", nota: 8.5, frequencia: 95, participacao: 90 },
  { nome: "Carla Mendes", turma: "2A", nota: 8.1, frequencia: 96, participacao: 93 },
  { nome: "Rafael Costa", turma: "2B", nota: 7.9, frequencia: 94, participacao: 88 },
];
const mockRankingTurmas = [
  { turma: "1A", media: 8.7, frequencia: 97 },
  { turma: "1B", media: 8.2, frequencia: 95 },
  { turma: "2A", media: 8.0, frequencia: 96 },
  { turma: "2B", media: 7.8, frequencia: 94 },
];
const mockRankingProfs = [
  { nome: "Maria Silva", disciplina: "Matemática", media: 8.9, participacao: 97 },
  { nome: "João Souza", disciplina: "Português", media: 8.5, participacao: 95 },
  { nome: "Ana Lima", disciplina: "História", media: 8.2, participacao: 93 },
];

// Mock de solicitações administrativas
const mockSolicitacoes = [
  { id: 1, tipo: "Matrícula", solicitante: "Carlos Nunes", status: "Pendente", data: "2024-06-10" },
  { id: 2, tipo: "Transferência", solicitante: "Julia Ramos", status: "Pendente", data: "2024-06-11" },
  { id: 3, tipo: "2ª via de boletim", solicitante: "Lucas Silva", status: "Aprovada", data: "2024-06-09" },
  { id: 4, tipo: "Matrícula", solicitante: "Ana Souza", status: "Rejeitada", data: "2024-06-08" },
];

export default function Dashboard() {
  const [section, setSection] = useState("visao");
  const [colaboradores, setColaboradores] = useState(mockColaboradores);
  const [showAdd, setShowAdd] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState("1A");
  const [turnoSelecionado, setTurnoSelecionado] = useState("Manhã");
  const [novoColab, setNovoColab] = useState({ nome: "", email: "", tipo: "Coordenador", senha: "" });
  const [compareTurnos, setCompareTurnos] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState(null as null | typeof mockAlertas[0]);
  const [destinatario, setDestinatario] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [permissoes, setPermissoes] = useState(mockPermissoes);
  const [colabPerm, setColabPerm] = useState<null | typeof mockPermissoes[0]>(null);
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [eventos, setEventos] = useState(mockEventos);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [showAddEvento, setShowAddEvento] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ titulo: "", data: format(new Date(), "yyyy-MM-dd"), tipo: "Reunião" });
  const [solicitacoes, setSolicitacoes] = useState(mockSolicitacoes);
  const [, navigate] = useLocation();

  // Estados para gerenciar edição e exclusão de colaboradores
  const [colabEdit, setColabEdit] = useState<null | typeof mockColaboradores[0]>(null);
  const [colabDelete, setColabDelete] = useState<null | number>(null);

  // Simulação de dados do usuário logado
  const user = {
    name: "Diretor Teste",
    email: "adminviniwel@exemplo.com",
    role: "diretor"
  };
  
  // Verificação de segurança - redirecionar se não for diretor
  useEffect(() => {
    // Em uma aplicação real, isso seria verificado com um token JWT ou sessão
    // Aqui estamos simulando com os dados mockados
    if (user.role !== "diretor") {
      toast.error("Acesso não autorizado. Redirecionando...");
      navigate("/dashboard/coordenador");
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

  // Eventos do mês atual
  const eventosMes = eventos.filter(e => isSameMonth(parseISO(e.data), mesAtual));

  // Adicionar colaborador
  function handleAddColab(e: React.FormEvent) {
    e.preventDefault();
    setColaboradores([...colaboradores, { ...novoColab, id: Date.now() }]);
    setShowAdd(false);
    setNovoColab({ nome: "", email: "", tipo: "Coordenador", senha: "" });
    toast.success("Colaborador adicionado com sucesso!");
  }

  // Remover colaborador
  function handleRemoveColab(id: number) {
    // Em vez de remover diretamente, mostrar confirmação
    setColabDelete(id);
  }

  // Função para confirmar a exclusão
  function confirmarExclusaoColab() {
    if (colabDelete !== null) {
      setColaboradores(colaboradores.filter(c => c.id !== colabDelete));
      setColabDelete(null);
      toast.success("Colaborador removido com sucesso!");
    }
  }

  // Função para abrir o modal de edição
  function handleEditColab(colab: typeof mockColaboradores[0]) {
    // Cria uma cópia do colaborador para edição
    setColabEdit({...colab, senha: ""});
  }

  // Função para salvar a edição
  function handleSaveColabEdit(e: React.FormEvent) {
    e.preventDefault();
    if (colabEdit) {
      setColaboradores(
        colaboradores.map(c => c.id === colabEdit.id ? 
          {...colabEdit, senha: colabEdit.senha || c.senha} : c)
      );
      setColabEdit(null);
      toast.success("Colaborador atualizado com sucesso!");
    }
  }

  function handleEnviarNotificacao(e: React.FormEvent) {
    e.preventDefault();
    setAlertaSelecionado(null);
    setDestinatario([]);
    setMensagem("");
    toast.success("Notificação enviada com sucesso!");
  }

  function handleSalvarPermissoes() {
    setPermissoes(permissoes.map(c => c.id === colabPerm?.id ? colabPerm : c));
    setColabPerm(null);
    toast.success("Permissões atualizadas!");
  }

  // Filtrar dados do relatório
  const dadosRelatorio = mockRelatorio.filter(r =>
    (!filtroTurma || r.turma === filtroTurma) &&
    (!filtroDisciplina || r.disciplina === filtroDisciplina) &&
    (!filtroPeriodo || r.periodo === filtroPeriodo)
  );

  // Exportar CSV
  function exportarCSV() {
    const csv = Papa.unparse(dadosRelatorio);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório exportado em CSV!");
  }

  // Exportar PDF
  function exportarPDF() {
    const doc = new jsPDF();
    doc.text("Relatório Escolar", 10, 10);
    let y = 20;
    dadosRelatorio.forEach((r, i) => {
      doc.text(`${i + 1}. ${r.aluno} | ${r.turma} | ${r.disciplina} | ${r.periodo} | Nota: ${r.nota} | Faltas: ${r.faltas}`, 10, y);
      y += 8;
    });
    doc.save("relatorio.pdf");
    toast.success("Relatório exportado em PDF!");
  }

  // Adicionar evento
  function handleAddEvento(e: React.FormEvent) {
    e.preventDefault();
    setEventos([...eventos, { ...novoEvento, id: Date.now() }]);
    setShowAddEvento(false);
    setNovoEvento({ titulo: "", data: format(new Date(), "yyyy-MM-dd"), tipo: "Reunião" });
    toast.success("Evento adicionado!");
  }

  // Remover evento
  function handleRemoveEvento(id: number) {
    setEventos(eventos.filter(e => e.id !== id));
    toast.success("Evento removido!");
  }

  // Aprovar solicitação
  function aprovarSolicitacao(id: number) {
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: "Aprovada" } : s));
    toast.success("Solicitação aprovada!");
  }

  // Rejeitar solicitação
  function rejeitarSolicitacao(id: number) {
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: "Rejeitada" } : s));
    toast.success("Solicitação rejeitada!");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada */}
      <motion.aside initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 80 }} className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Painel Diretor</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('visao')}><BarChart2 className="w-5 h-5" /> Visão Geral</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'colaboradores' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('colaboradores')}><Users className="w-5 h-5" /> Colaboradores</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'turmas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('turmas')}><BookOpen className="w-5 h-5" /> Turmas</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'permissoes' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('permissoes')}><UserCog className="w-5 h-5" /> Permissões</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('relatorios')}><BookOpen className="w-5 h-5" /> Relatórios</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'eventos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('eventos')}><Calendar className="w-5 h-5" /> Eventos</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'ranking' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('ranking')}><Award className="w-5 h-5" /> Ranking</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'historico' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('historico')}><Clock className="w-5 h-5" /> Histórico</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'solicitacoes' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('solicitacoes')}><Inbox className="w-5 h-5" /> Solicitações</button>
          <a href="/financeiro" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-50 text-gray-700"><DollarSign className="w-5 h-5" /> Financeiro</a>
          <a href="/documentacao" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-50 text-gray-700"><FileText className="w-5 h-5" /> Documentação</a>
          <a href="/alimentacao" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-50 text-gray-700"><UtensilsCrossed className="w-5 h-5" /> Gestão de Alimentação</a>
        </nav>
        <div className="mt-auto pt-8">
          <Button className="w-full flex gap-2 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => window.location.href = '/'}><LogOut className="w-5 h-5" /> Sair</Button>
        </div>
      </motion.aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Painel de Alertas Inteligentes */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="mt-1 text-xs text-indigo-600 underline cursor-pointer">Notificar responsável</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Modal de notificação */}
        <AnimatePresence>
          {alertaSelecionado && (
            <motion.div key="modal-alerta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} transition={{ type: "spring", stiffness: 120 }} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">{alertaSelecionado.icone} {alertaSelecionado.titulo}</h3>
                <p className="text-gray-700 mb-4">{alertaSelecionado.mensagem}</p>
                <form onSubmit={handleEnviarNotificacao} className="flex flex-col gap-4">
                  <div>
                    <label className="font-medium text-sm mb-1 block">Destinatário:</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={destinatario.includes('coordenador')} onChange={e => setDestinatario(d => e.target.checked ? [...d, 'coordenador'] : d.filter(x => x !== 'coordenador'))} /> Coordenador
                      </label>
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={destinatario.includes('professor')} onChange={e => setDestinatario(d => e.target.checked ? [...d, 'professor'] : d.filter(x => x !== 'professor'))} /> Professor
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-sm mb-1 block">Mensagem (opcional):</label>
                    <textarea className="border rounded px-3 py-2 w-full min-h-[60px]" value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Digite uma mensagem personalizada..." />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setAlertaSelecionado(null)}>Cancelar</Button>
                    <Button type="submit" disabled={destinatario.length === 0}>Enviar</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">Bem-vindo, {user.name}!</h1>
            <p className="text-gray-600">Acesso: <span className="capitalize font-semibold">{user.role}</span></p>
          </div>
        </motion.header>
        {/* Section Content */}
        <AnimatePresence mode="wait">
        {section === 'visao' && (
          <motion.div key="visao" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            {/* Cabeçalho da seção - Título e descrição que contextualizam a visão geral para o diretor */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-indigo-600" />
                Visão Geral da Instituição
              </h2>
              <p className="text-gray-600">Acompanhe os principais indicadores da escola em tempo real.</p>
            </div>
            
            {/* Cards de estatísticas principais - Exibem os números essenciais da escola de forma visualmente atraente
                Cada card é um componente motion que usa a animação definida em cardVariants para entrada suave na tela
                As cores diferentes ajudam na identificação visual rápida de cada categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card de Alunos - Exibe o total de alunos e tendência de crescimento */}
              <motion.div 
                custom={0} 
                variants={cardVariants} 
                initial="hidden" 
                animate="visible" 
                className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl p-6 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-600 rounded-lg shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">Total</span>
                </div>
                <span className="text-3xl font-bold text-indigo-700 mb-1">320</span>
                <span className="text-gray-600">Alunos matriculados</span>
                <div className="mt-3 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Aumento de 12% desde o último mês</span>
                </div>
              </motion.div>
              
              {/* Card de Coordenadores - Exibe o total e a proporção coordenador/turma */}
              <motion.div 
                custom={1} 
                variants={cardVariants} 
                initial="hidden" 
                animate="visible" 
                className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500 rounded-lg shadow-md">
                    <UserCog className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Equipe</span>
                </div>
                <span className="text-3xl font-bold text-amber-700 mb-1">3</span>
                <span className="text-gray-600">Coordenadores</span>
                <div className="mt-3 flex items-center text-xs text-amber-600">
                  <Users className="w-3 h-3 mr-1" />
                  <span>1 coordenador para cada 3 turmas</span>
                </div>
              </motion.div>
              
              {/* Card de Turmas - Exibe o total de turmas e média de alunos por turma */}
              <motion.div 
                custom={2} 
                variants={cardVariants} 
                initial="hidden" 
                animate="visible" 
                className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600 rounded-lg shadow-md">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Ativas</span>
                </div>
                <span className="text-3xl font-bold text-blue-700 mb-1">8</span>
                <span className="text-gray-600">Turmas ativas</span>
                <div className="mt-3 flex items-center text-xs text-blue-600">
                  <Users className="w-3 h-3 mr-1" />
                  <span>Média de 40 alunos por turma</span>
                </div>
              </motion.div>
              
              {/* Card de Professores - Exibe o total de professores e a proporção professor/turma */}
              <motion.div 
                custom={3} 
                variants={cardVariants} 
                initial="hidden" 
                animate="visible" 
                className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl p-6 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Ativos</span>
                </div>
                <span className="text-3xl font-bold text-emerald-700 mb-1">24</span>
                <span className="text-gray-600">Professores</span>
                <div className="mt-3 flex items-center text-xs text-emerald-600">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span>3 professores por turma em média</span>
                </div>
              </motion.div>
            </div>
            
            {/* Gráfico de desempenho acadêmico - Visualização interativa das médias por turma/turno
                Usa ResponsiveContainer do Recharts para ajustar automaticamente o tamanho do gráfico
                O usuário pode selecionar turnos específicos ou comparar turnos conforme necessário */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }} 
              className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
            >
              {/* Cabeçalho do gráfico com título informativo e controles de filtro */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-700 mb-1 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-500" />
                    Desempenho Acadêmico
                  </h3>
                  <p className="text-sm text-gray-500">
                    Médias de notas por turma {compareTurnos ? 'comparando turnos' : `no turno da ${turnoSelecionado}`}
                  </p>
                </div>
                
                {/* Controles do gráfico - Permitem filtrar dados e alterar a visualização
                    Seletor de turno fica desabilitado quando a comparação de turnos está ativa */}
                <div className="flex gap-3 items-center bg-indigo-50 p-2 rounded-lg">
                  <select 
                    className="border border-indigo-200 rounded-lg px-3 py-1 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none" 
                    value={turnoSelecionado} 
                    onChange={e => setTurnoSelecionado(e.target.value)} 
                    disabled={compareTurnos}
                  >
                    {TURNOS.map(turno => (
                      <option key={turno} value={turno}>{turno}</option>
                    ))}
                  </select>
                  
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={compareTurnos} 
                      onChange={e => setCompareTurnos(e.target.checked)} 
                      className="accent-indigo-500 w-4 h-4" 
                    />
                    <span className="text-indigo-700 font-medium">Comparar turnos</span>
                  </label>
                </div>
              </div>
              
              {/* Gráfico de barras Recharts - Renderiza os dados das médias de forma visual 
                  Possui animações, formatação personalizada nos eixos e tooltips melhoradas */}
              <div className="mt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="turma" 
                      tick={{ fill: '#4B5563' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      tick={{ fill: '#4B5563' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      tickFormatter={(value) => `${value.toFixed(1)}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${Number(value).toFixed(1)}`, 'Média']}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                    />
                    {/* Renderização condicional das barras com base no modo selecionado (turnos específicos ou comparação) */}
                    {compareTurnos ? (
                      <>
                        <Bar 
                          dataKey="Manhã" 
                          fill={TURNO_COLORS["Manhã"]} 
                          radius={[4, 4, 0, 0]} 
                          barSize={30}
                          animationDuration={1500}
                          name="Turno Manhã"
                        />
                        <Bar 
                          dataKey="Tarde" 
                          fill={TURNO_COLORS["Tarde"]} 
                          radius={[4, 4, 0, 0]} 
                          barSize={30}
                          animationDuration={1500}
                          name="Turno Tarde"
                        />
                      </>
                    ) : (
                      chartData.map((d, i) => (
                        d.media !== null && (
                          <Bar 
                            key={d.turma} 
                            dataKey="media" 
                            data={[d]} 
                            name={d.turma} 
                            fill={d.color} 
                            radius={[4, 4, 0, 0]} 
                            xAxisId={0}
                            barSize={40}
                            animationDuration={1200 + (i * 100)}
                          />
                        )
                      ))
                    )}
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Legenda explicativa adicional - Fornece contexto para interpretar os dados */}
                <div className="flex justify-end mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium">Nota: </span>
                    <span className="ml-1">O gráfico exibe a média de desempenho acadêmico baseada nas avaliações do período atual.</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Indicadores de desempenho adicionais - Complementam a visão geral com métricas específicas
                Organizados em uma grade responsiva que adapta de 1 a 3 colunas conforme o tamanho da tela */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {/* Indicador de taxa de aprovação - Mostra o percentual atual e comparação com período anterior */}
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">Taxa de Aprovação</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
                <div className="text-xs text-gray-500">
                  Comparado a 87% no semestre anterior
                </div>
          </div>
          
              {/* Indicador de frequência média - Mostra o percentual de presença nas últimas semanas */}
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Frequência Média</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-xs text-gray-500">
                  Nas últimas 4 semanas de aula
          </div>
        </div>
        
              {/* Indicador de média geral - Mostra a nota média de todas as turmas e a variação recente */}
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Média Geral</span>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">7.6</div>
                <div className="text-xs text-gray-500">
                  Aumento de 0.3 pontos desde a última avaliação
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {section === 'colaboradores' && (
          <motion.div key="colaboradores" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
            {/* Cabeçalho da seção de Colaboradores com título e botão de adicionar */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Gestão de Colaboradores
                  </h2>
                  <p className="text-gray-600">Gerencie professores, coordenadores e funcionários da instituição.</p>
                </div>
          <Button 
                  className="flex gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" 
                  onClick={() => setShowAdd(true)}
          >
                  <Plus className="w-5 h-5" />
                  Adicionar Colaborador
          </Button>
        </div>
      </div>

            {/* Cards com estatísticas resumidas de colaboradores por função */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card de Professores */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Professores</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {colaboradores.filter(c => c.tipo === "Professor").length}
                  </p>
                </div>
              </motion.div>

              {/* Card de Coordenadores */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
              >
                <div className="p-3 bg-amber-100 rounded-lg">
                  <UserCog className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coordenadores</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {colaboradores.filter(c => c.tipo === "Coordenador").length}
                  </p>
                </div>
              </motion.div>

              {/* Card do total de colaboradores */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
              >
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Colaboradores</p>
                  <p className="text-2xl font-bold text-gray-800">{colaboradores.length}</p>
                </div>
              </motion.div>
            </div>

            {/* Tabela principal de colaboradores com filtro de busca */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Barra de filtro/busca simulada */}
              <div className="border-b border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center gap-2 text-gray-400 bg-white border border-gray-200 rounded-lg p-2 px-3 shadow-sm w-full max-w-md">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Buscar colaboradores por nome, email ou função...</span>
                </div>
              </div>

              {/* Tabela com lista de colaboradores */}
              <div className="p-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 font-semibold text-gray-700">Nome</th>
                      <th className="py-3 font-semibold text-gray-700">Email</th>
                      <th className="py-3 font-semibold text-gray-700">Função</th>
                      <th className="py-3 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colaboradores.map(colab => (
                      <tr key={colab.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-medium text-indigo-700 cursor-pointer hover:underline flex items-center gap-2" title="Ver detalhes">
                          {colab.tipo === "Coordenador" ? 
                            <UserCog className="w-5 h-5 text-amber-600" /> : 
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          }
                          {colab.nome}
                        </td>
                        <td className="py-3 text-gray-600">{colab.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            colab.tipo === "Coordenador" 
                              ? "bg-amber-100 text-amber-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {colab.tipo}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                              onClick={() => handleEditColab(colab)}
                            >
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleRemoveColab(colab.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 border-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mensagem quando não há colaboradores */}
                {colaboradores.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>Nenhum colaborador cadastrado.</p>
                    <p className="text-sm">Clique no botão "Adicionar Colaborador" para começar.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Modal para adicionar colaborador - Ativado quando showAdd é true */}
            <AnimatePresence>
              {showAdd && (
                <motion.div 
                  key="modal" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 40 }} 
                    animate={{ scale: 1, y: 0 }} 
                    exit={{ scale: 0.9, y: 40 }} 
                    transition={{ type: "spring", stiffness: 120 }} 
                    className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200"
                  >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
                      <Users className="w-6 h-6 text-indigo-600" />
                      Adicionar Colaborador
                    </h3>

                    {/* Formulário de cadastro de colaborador */}
                    <form onSubmit={handleAddColab} className="flex flex-col gap-4">
                      {/* Campo de Nome */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          placeholder="Ex: Maria Silva" 
                          required 
                          value={novoColab.nome} 
                          onChange={e => setNovoColab({ ...novoColab, nome: e.target.value })} 
                        />
                      </div>

                      {/* Campo de Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
                        <input 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          placeholder="Ex: maria@escola.com" 
                          type="email"
                          required 
                          value={novoColab.email} 
                          onChange={e => setNovoColab({ ...novoColab, email: e.target.value })} 
                        />
                      </div>

                      {/* Campo de Tipo/Função */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função na Instituição</label>
                        <select 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          value={novoColab.tipo} 
                          onChange={e => setNovoColab({ ...novoColab, tipo: e.target.value })}
                        >
                          <option value="Coordenador">Coordenador</option>
                          <option value="Professor">Professor</option>
                        </select>
                      </div>

                      {/* Campo de Senha */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Acesso</label>
                        <input 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          placeholder="Mínimo 6 caracteres" 
                          type="password" 
                          required 
                          value={novoColab.senha} 
                          onChange={e => setNovoColab({ ...novoColab, senha: e.target.value })} 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          A senha será enviada ao colaborador por email.
                        </p>
                      </div>

                      {/* Botões de ação do modal */}
                      <div className="flex gap-2 justify-end mt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowAdd(false)}
                          className="border-gray-300"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Salvar Colaborador
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal para editar colaborador */}
            <AnimatePresence>
              {colabEdit && (
                <motion.div 
                  key="modal-edit" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 40 }} 
                    animate={{ scale: 1, y: 0 }} 
                    exit={{ scale: 0.9, y: 40 }} 
                    transition={{ type: "spring", stiffness: 120 }} 
                    className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200"
                  >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
                      <UserCog className="w-6 h-6 text-indigo-600" />
                      Editar Colaborador
                    </h3>

                    {/* Formulário de edição de colaborador */}
                    <form onSubmit={handleSaveColabEdit} className="flex flex-col gap-4">
                      {/* Campo de Nome */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          required 
                          value={colabEdit.nome} 
                          onChange={e => setColabEdit({...colabEdit, nome: e.target.value})} 
                        />
                      </div>

                      {/* Campo de Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
                        <input 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          type="email"
                          required 
                          value={colabEdit.email} 
                          onChange={e => setColabEdit({...colabEdit, email: e.target.value})} 
                        />
                      </div>

                      {/* Campo de Tipo/Função */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função na Instituição</label>
                        <select 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          value={colabEdit.tipo} 
                          onChange={e => setColabEdit({...colabEdit, tipo: e.target.value})}
                        >
                          <option value="Coordenador">Coordenador</option>
                          <option value="Professor">Professor</option>
                        </select>
                      </div>

                      {/* Campo de Senha (opcional durante edição) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (opcional)</label>
                        <input 
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                          placeholder="Deixe em branco para manter a senha atual" 
                          type="password" 
                          value={colabEdit.senha || ""} 
                          onChange={e => setColabEdit({...colabEdit, senha: e.target.value})} 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Preencha apenas se desejar alterar a senha atual.
                        </p>
                      </div>

                      {/* Botões de ação do modal */}
                      <div className="flex gap-2 justify-end mt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setColabEdit(null)}
                          className="border-gray-300"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Salvar Alterações
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}

              {/* Modal de confirmação de exclusão */}
              {colabDelete !== null && (
                <motion.div 
                  key="modal-delete" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} 
                    animate={{ scale: 1, y: 0 }} 
                    exit={{ scale: 0.9, y: 20 }} 
                    transition={{ type: "spring", stiffness: 120 }} 
                    className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm border border-gray-200"
                  >
                    <div className="text-center mb-5">
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Confirmar Exclusão
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Você realmente deseja excluir este colaborador? Esta ação não pode ser desfeita.
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setColabDelete(null)}
                        className="border-gray-300 text-gray-700"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="button"
                        onClick={confirmarExclusaoColab}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Sim, Excluir
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        {section === 'turmas' && (
          <motion.div key="turmas" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
            <GestaoTurmas />
          </motion.div>
        )}
        {section === 'permissoes' && (
          <motion.div key="permissoes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <GestaoPermissoes />
          </motion.div>
        )}
        {section === 'relatorios' && (
          <motion.div key="relatorios" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <GestaoRelatorios />
          </motion.div>
        )}
        {section === 'eventos' && (
          <motion.div key="eventos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <GestaoEventos />
          </motion.div>
        )}
        {section === 'ranking' && (
          <motion.div key="ranking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <GestaoRanking />
          </motion.div>
        )}
        {section === 'historico' && (
          <motion.div key="historico" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <GestaoHistorico />
          </motion.div>
        )}
        {section === 'solicitacoes' && (
          <motion.div key="solicitacoes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <GestaoSolicitacoes />
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
} 