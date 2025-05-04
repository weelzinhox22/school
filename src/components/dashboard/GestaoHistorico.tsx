import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Clock, 
  Search, 
  Download,
  Filter,
  Calendar,
  User,
  Activity,
  FileText,
  ListFilter,
  ArrowDownAZ,
  ChevronDown,
  X,
  RefreshCw
} from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados mockados para o histórico de ações
const mockLog = [
  { id: 1, usuario: "Diretor Teste", acao: "Adicionou evento", detalhe: "Festa Junina", data: "2025-01-10 10:12", categoria: "eventos" },
  { id: 2, usuario: "Diretor Teste", acao: "Editou permissões", detalhe: "Maria Silva - Editar notas", data: "2025-01-15 14:30", categoria: "permissoes" },
  { id: 3, usuario: "Diretor Teste", acao: "Exportou relatório", detalhe: "Turma 1A - Matemática", data: "2025-01-20 09:05", categoria: "relatorios" },
  { id: 4, usuario: "Diretor Teste", acao: "Removeu colaborador", detalhe: "João Souza", data: "2025-01-25 16:20", categoria: "colaboradores" },
  { id: 5, usuario: "Diretor Teste", acao: "Enviou alerta", detalhe: "Notas baixas para coordenador", data: "2025-01-30 11:45", categoria: "alertas" },
  { id: 6, usuario: "Maria Silva", acao: "Adicionou aluno", detalhe: "Pedro Oliveira - Turma 2A", data: "2025-02-05 13:30", categoria: "alunos" },
  { id: 7, usuario: "João Souza", acao: "Lançou notas", detalhe: "Matemática - Turma 1B", data: "2025-02-10 09:15", categoria: "notas" },
  { id: 8, usuario: "Ana Lima", acao: "Registrou presença", detalhe: "História - Turma 3A", data: "2025-02-15 10:45", categoria: "presenca" },
  { id: 9, usuario: "Diretor Teste", acao: "Aprovou solicitação", detalhe: "Matrícula - Carlos Nunes", data: "2025-02-20 11:20", categoria: "solicitacoes" },
  { id: 10, usuario: "Maria Silva", acao: "Criou avaliação", detalhe: "Português - Turma 2B", data: "2025-02-25 14:05", categoria: "avaliacoes" },
  { id: 11, usuario: "Diretor Teste", acao: "Atualizou calendário", detalhe: "Período de férias", data: "2025-03-01 10:30", categoria: "eventos" },
  { id: 12, usuario: "João Souza", acao: "Adicionou material", detalhe: "Matemática - Trigonometria", data: "2025-03-05 13:25", categoria: "materiais" },
  { id: 13, usuario: "Diretor Teste", acao: "Enviou comunicado", detalhe: "Reunião de pais", data: "2025-03-10 09:40", categoria: "comunicados" },
  { id: 14, usuario: "Ana Lima", acao: "Registrou ocorrência", detalhe: "Comportamento - Lucas Silva", data: "2025-03-15 11:50", categoria: "ocorrencias" },
  { id: 15, usuario: "Diretor Teste", acao: "Alterou configurações", detalhe: "Sistema de notas", data: "2025-03-20 15:10", categoria: "configuracoes" },
  { id: 16, usuario: "Diretor Teste", acao: "Gerou relatório financeiro", detalhe: "Março/2025", data: "2025-03-25 16:30", categoria: "financeiro" },
  { id: 17, usuario: "Maria Silva", acao: "Agendou reunião", detalhe: "Conselho de classe - 1º bimestre", data: "2025-03-30 09:20", categoria: "agenda" },
  { id: 18, usuario: "Diretor Teste", acao: "Atualizou regimento", detalhe: "Normas disciplinares", data: "2025-04-05 14:45", categoria: "documentos" },
  { id: 19, usuario: "João Souza", acao: "Editou planejamento", detalhe: "Matemática - 2º bimestre", data: "2025-04-10 10:55", categoria: "planejamento" },
  { id: 20, usuario: "Diretor Teste", acao: "Backup do sistema", detalhe: "Backup completo", data: "2025-04-15 18:00", categoria: "sistema" },
  // Registros adicionais para demonstração
  { id: 21, usuario: "Roberto Alves", acao: "Realizou matrícula", detalhe: "Aluno: Felipe Santos - Turma 2B", data: "2025-04-18 08:45", categoria: "alunos" },
  { id: 22, usuario: "Carla Mendes", acao: "Registrou pagamento", detalhe: "Mensalidade Abril/2025 - Matrícula #1042", data: "2025-04-20 10:20", categoria: "financeiro" },
  { id: 23, usuario: "Diretor Teste", acao: "Aprovou contratação", detalhe: "Professor de Física - Carlos Eduardo", data: "2025-04-21 14:00", categoria: "colaboradores" },
  { id: 24, usuario: "Ana Lima", acao: "Solicitou materiais", detalhe: "Requisição #203 - Laboratório de Ciências", data: "2025-04-22 16:30", categoria: "materiais" },
  { id: 25, usuario: "João Souza", acao: "Postou atividade", detalhe: "Atividade online - Matemática Turma 1A", data: "2025-04-23 09:10", categoria: "materiais" },
  { id: 26, usuario: "Secretária Paula", acao: "Atendeu responsável", detalhe: "Pai do aluno Lucas Silva - Dúvidas sobre boletim", data: "2025-04-24 10:40", categoria: "atendimentos" },
  { id: 27, usuario: "Maria Silva", acao: "Revisou provas", detalhe: "Avaliação bimestral - Português 3A", data: "2025-04-25 13:15", categoria: "avaliacoes" },
  { id: 28, usuario: "Carla Mendes", acao: "Emitiu comprovante", detalhe: "Declaração de matrícula - Aluno Pedro Lima", data: "2025-04-26 15:50", categoria: "documentos" },
  { id: 29, usuario: "Diretor Teste", acao: "Realizou reunião", detalhe: "Alinhamento pedagógico com coordenadores", data: "2025-04-27 08:30", categoria: "reunioes" },
  { id: 30, usuario: "Roberto Alves", acao: "Atualizou cadastro", detalhe: "Dados de contato - 5 alunos", data: "2025-04-28 11:20", categoria: "alunos" },
  { id: 31, usuario: "Ana Lima", acao: "Fechou notas", detalhe: "1º Bimestre - História Turmas 3A e 3B", data: "2025-04-29 14:40", categoria: "notas" },
  { id: 32, usuario: "Secretária Paula", acao: "Organizou documentos", detalhe: "Arquivo de ex-alunos 2024", data: "2025-04-30 16:10", categoria: "documentos" },
  { id: 33, usuario: "Diretor Teste", acao: "Autorizou passeio", detalhe: "Visita ao museu - Turmas 2A e 2B", data: "2025-05-01 09:30", categoria: "eventos" },
  { id: 34, usuario: "João Souza", acao: "Alterou cronograma", detalhe: "Aulas de reforço - Matemática", data: "2025-05-02 11:15", categoria: "planejamento" },
  { id: 35, usuario: "Coordenador Paulo", acao: "Observou aulas", detalhe: "Avaliação de professores - Ensino Fundamental", data: "2025-05-03 13:50", categoria: "avaliacoes" },
  { id: 36, usuario: "Maria Silva", acao: "Elaborou projeto", detalhe: "Feira de Ciências - Tema Sustentabilidade", data: "2025-05-04 15:30", categoria: "projetos" },
  { id: 37, usuario: "Carla Mendes", acao: "Gerou relatório", detalhe: "Inadimplência por turma - Abril/2025", data: "2025-05-05 08:45", categoria: "financeiro" },
  { id: 38, usuario: "Técnico Ricardo", acao: "Manutenção", detalhe: "Laboratório de Informática - Computadores", data: "2025-05-06 10:20", categoria: "infraestrutura" },
  { id: 39, usuario: "Ana Lima", acao: "Compartilhou material", detalhe: "Apostila História Brasil Império - Turma 3A", data: "2025-05-07 13:40", categoria: "materiais" },
  { id: 40, usuario: "Diretor Teste", acao: "Revisou orçamento", detalhe: "Previsão de gastos - 2º Semestre/2025", data: "2025-05-08 16:30", categoria: "financeiro" },
  { id: 41, usuario: "Secretária Paula", acao: "Agendou reunião", detalhe: "Entrega de boletins - Turmas 1A e 1B", data: "2025-05-09 09:15", categoria: "agenda" },
  { id: 42, usuario: "Nutricionista Júlia", acao: "Atualizou cardápio", detalhe: "Cantina escolar - Semana 12/05 a 16/05", data: "2025-05-10 11:40", categoria: "alimentacao" },
  { id: 43, usuario: "Coordenador Paulo", acao: "Mediou conflito", detalhe: "Alunos da turma 2B - Questão disciplinar", data: "2025-05-11 14:10", categoria: "ocorrencias" },
  { id: 44, usuario: "João Souza", acao: "Publicou resultado", detalhe: "Olimpíada de Matemática - Fase escolar", data: "2025-05-12 16:45", categoria: "eventos" },
  { id: 45, usuario: "Maria Silva", acao: "Avaliou redações", detalhe: "Simulado ENEM - Turmas 3A e 3B", data: "2025-05-13 08:30", categoria: "avaliacoes" },
  { id: 46, usuario: "Técnico Ricardo", acao: "Instalou equipamentos", detalhe: "Projetores em 3 salas de aula", data: "2025-05-14 10:50", categoria: "infraestrutura" },
  { id: 47, usuario: "Diretor Teste", acao: "Recebeu inspeção", detalhe: "Visita da Secretaria de Educação", data: "2025-05-15 13:30", categoria: "institucional" },
  { id: 48, usuario: "Roberto Alves", acao: "Processou transferência", detalhe: "Aluno Marcos Silva - Para Colégio São José", data: "2025-05-16 15:20", categoria: "alunos" },
  { id: 49, usuario: "Psicóloga Renata", acao: "Realizou atendimento", detalhe: "Orientação vocacional - Alunos do 3º ano", data: "2025-05-17 09:10", categoria: "atendimentos" },
  { id: 50, usuario: "Diretor Teste", acao: "Assinou convênio", detalhe: "Parceria com Universidade Federal - Estágios", data: "2025-05-18 11:00", categoria: "institucional" }
];

// Categorias de ações
const CATEGORIAS_ACOES = [
  "eventos", "permissoes", "relatorios", "colaboradores", "alertas", 
  "alunos", "notas", "presenca", "solicitacoes", "avaliacoes", 
  "materiais", "comunicados", "ocorrencias", "configuracoes", 
  "financeiro", "agenda", "documentos", "planejamento", "sistema",
  "atendimentos", "projetos", "infraestrutura", "institucional",
  "reunioes", "alimentacao"
];

// Mapeamento de categorias para cores e ícones
const CATEGORIA_CONFIG = {
  eventos: { cor: "bg-indigo-100 text-indigo-800", icone: <Calendar className="w-4 h-4" /> },
  permissoes: { cor: "bg-purple-100 text-purple-800", icone: <User className="w-4 h-4" /> },
  relatorios: { cor: "bg-blue-100 text-blue-800", icone: <FileText className="w-4 h-4" /> },
  colaboradores: { cor: "bg-emerald-100 text-emerald-800", icone: <User className="w-4 h-4" /> },
  alertas: { cor: "bg-red-100 text-red-800", icone: <Activity className="w-4 h-4" /> },
  alunos: { cor: "bg-sky-100 text-sky-800", icone: <User className="w-4 h-4" /> },
  notas: { cor: "bg-amber-100 text-amber-800", icone: <FileText className="w-4 h-4" /> },
  presenca: { cor: "bg-green-100 text-green-800", icone: <User className="w-4 h-4" /> },
  solicitacoes: { cor: "bg-rose-100 text-rose-800", icone: <FileText className="w-4 h-4" /> },
  avaliacoes: { cor: "bg-orange-100 text-orange-800", icone: <FileText className="w-4 h-4" /> },
  materiais: { cor: "bg-teal-100 text-teal-800", icone: <FileText className="w-4 h-4" /> },
  comunicados: { cor: "bg-cyan-100 text-cyan-800", icone: <Activity className="w-4 h-4" /> },
  ocorrencias: { cor: "bg-pink-100 text-pink-800", icone: <Activity className="w-4 h-4" /> },
  configuracoes: { cor: "bg-zinc-100 text-zinc-800", icone: <Activity className="w-4 h-4" /> },
  financeiro: { cor: "bg-emerald-100 text-emerald-800", icone: <Activity className="w-4 h-4" /> },
  agenda: { cor: "bg-violet-100 text-violet-800", icone: <Calendar className="w-4 h-4" /> },
  documentos: { cor: "bg-blue-100 text-blue-800", icone: <FileText className="w-4 h-4" /> },
  planejamento: { cor: "bg-indigo-100 text-indigo-800", icone: <Calendar className="w-4 h-4" /> },
  sistema: { cor: "bg-slate-100 text-slate-800", icone: <Activity className="w-4 h-4" /> },
  atendimentos: { cor: "bg-purple-100 text-purple-800", icone: <User className="w-4 h-4" /> },
  projetos: { cor: "bg-amber-100 text-amber-800", icone: <FileText className="w-4 h-4" /> },
  infraestrutura: { cor: "bg-gray-100 text-gray-800", icone: <Activity className="w-4 h-4" /> },
  institucional: { cor: "bg-blue-100 text-blue-800", icone: <FileText className="w-4 h-4" /> },
  reunioes: { cor: "bg-indigo-100 text-indigo-800", icone: <Calendar className="w-4 h-4" /> },
  alimentacao: { cor: "bg-green-100 text-green-800", icone: <Activity className="w-4 h-4" /> },
  default: { cor: "bg-gray-100 text-gray-800", icone: <Activity className="w-4 h-4" /> }
};

/**
 * Componente GestaoHistorico
 * 
 * Este componente exibe um histórico detalhado (log de auditoria) de todas as ações 
 * realizadas no sistema, com recursos avançados de filtragem, exportação e pesquisa.
 * Permite acompanhar quem fez o quê e quando, facilitando auditorias e rastreamento
 * de mudanças no sistema.
 */
export default function GestaoHistorico() {
  // Estados para filtros e configurações
  const [busca, setBusca] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("7dias");
  const [showFiltros, setShowFiltros] = useState(false);
  const [ordenacao, setOrdenacao] = useState("recentes"); // 'recentes' ou 'antigos'

  // Lista de usuários únicos para o filtro
  const usuarios = Array.from(new Set(mockLog.map(log => log.usuario)));

  /**
   * Filtra os logs com base nos critérios selecionados
   * @returns Array de logs filtrados
   */
  const getLogsFiltrados = () => {
    let logs = [...mockLog];
    
    // Filtragem por texto de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      logs = logs.filter(log => 
        log.acao.toLowerCase().includes(termoBusca) || 
        log.detalhe.toLowerCase().includes(termoBusca) ||
        log.usuario.toLowerCase().includes(termoBusca)
      );
    }
    
    // Filtragem por usuário
    if (filtroUsuario) {
      logs = logs.filter(log => log.usuario === filtroUsuario);
    }
    
    // Filtragem por categoria
    if (filtroCategoria) {
      logs = logs.filter(log => log.categoria === filtroCategoria);
    }
    
    // Filtragem por período
    if (filtroPeriodo) {
      const hoje = new Date();
      let dataLimite;
      
      switch (filtroPeriodo) {
        case "24horas":
          dataLimite = subDays(hoje, 1);
          break;
        case "7dias":
          dataLimite = subDays(hoje, 7);
          break;
        case "30dias":
          dataLimite = subDays(hoje, 30);
          break;
        default:
          dataLimite = null;
      }
      
      if (dataLimite) {
        logs = logs.filter(log => {
          const dataLog = new Date(log.data.replace(' ', 'T'));
          return dataLog >= dataLimite;
        });
      }
    }
    
    // Ordenação
    logs.sort((a, b) => {
      const dataA = new Date(a.data.replace(' ', 'T'));
      const dataB = new Date(b.data.replace(' ', 'T'));
      return ordenacao === "recentes" ? dataB.getTime() - dataA.getTime() : dataA.getTime() - dataB.getTime();
    });
    
    return logs;
  };

  // Logs filtrados com base nos critérios de filtro
  const logsFiltrados = getLogsFiltrados();
  
  /**
   * Exporta os logs filtrados para CSV
   */
  const exportarCSV = () => {
    const header = ["ID", "Usuário", "Ação", "Detalhe", "Data/Hora", "Categoria"];
    const rows = logsFiltrados.map(log => [
      log.id,
      log.usuario,
      log.acao,
      log.detalhe,
      log.data,
      log.categoria
    ]);
    
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `historico_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Histórico exportado com sucesso!");
  };
  
  /**
   * Limpa todos os filtros aplicados
   */
  const limparFiltros = () => {
    setBusca("");
    setFiltroUsuario("");
    setFiltroCategoria("");
    setFiltroPeriodo("7dias");
    setOrdenacao("recentes");
    toast.success("Filtros limpos com sucesso!");
  };
  
  /**
   * Retorna a configuração de estilo para uma categoria
   * @param categoria Nome da categoria
   * @returns Objeto com cor e ícone da categoria
   */
  const getCategoriaConfig = (categoria: string) => {
    return CATEGORIA_CONFIG[categoria as keyof typeof CATEGORIA_CONFIG] || CATEGORIA_CONFIG.default;
  };

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Histórico de Ações (Log de Auditoria)
            </h2>
            <p className="text-gray-600">
              Acompanhe todas as ações realizadas no sistema com detalhes de data, usuário e tipo de operação.
            </p>
          </div>
          
          <Button 
            onClick={exportarCSV}
            className="flex gap-2 items-center bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Download className="w-4 h-4" />
            Exportar Histórico
          </Button>
        </div>
      </div>
      
      {/* Barra de ferramentas - busca e filtros */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Campo de busca */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por ação, detalhe ou usuário..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          {/* Botões de filtro e ordenação */}
          <div className="flex flex-wrap gap-2">
            {/* Botão para mostrar/esconder filtros avançados */}
            <Button 
              variant="outline" 
              className={`gap-2 ${showFiltros ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
              onClick={() => setShowFiltros(!showFiltros)}
            >
              <Filter className="w-4 h-4" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFiltros ? 'rotate-180' : ''}`} />
            </Button>
            
            {/* Botão de ordenação */}
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setOrdenacao(ordenacao === "recentes" ? "antigos" : "recentes")}
            >
              <ArrowDownAZ className="w-4 h-4" />
              {ordenacao === "recentes" ? "Mais recentes" : "Mais antigos"}
            </Button>
            
            {/* Botão para limpar filtros */}
            <Button 
              variant="outline" 
              className="gap-2 text-gray-600"
              onClick={limparFiltros}
            >
              <RefreshCw className="w-4 h-4" />
              Limpar
            </Button>
          </div>
        </div>
        
        {/* Painel de filtros avançados - exibido apenas quando showFiltros é true */}
        {showFiltros && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro de usuário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                >
                  <option value="">Todos os usuários</option>
                  {usuarios.map(usuario => (
                    <option key={usuario} value={usuario}>{usuario}</option>
                  ))}
                </select>
              </div>
              
              {/* Filtro de categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {CATEGORIAS_ACOES.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              {/* Filtro de período */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={filtroPeriodo}
                  onChange={(e) => setFiltroPeriodo(e.target.value)}
                >
                  <option value="">Todo o histórico</option>
                  <option value="24horas">Últimas 24 horas</option>
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                </select>
              </div>
            </div>
            
            {/* Resumo de filtros aplicados */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Filtros aplicados:</span>
              
              {filtroUsuario && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                  Usuário: {filtroUsuario}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFiltroUsuario("")} />
                </span>
              )}
              
              {filtroCategoria && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                  Categoria: {filtroCategoria}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFiltroCategoria("")} />
                </span>
              )}
              
              {filtroPeriodo && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                  Período: {filtroPeriodo === "24horas" ? "Últimas 24h" : filtroPeriodo === "7dias" ? "Últimos 7 dias" : "Últimos 30 dias"}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFiltroPeriodo("")} />
                </span>
              )}
              
              {busca && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                  Busca: {busca}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setBusca("")} />
                </span>
              )}
              
              {!filtroUsuario && !filtroCategoria && !filtroPeriodo && !busca && (
                <span className="text-xs text-gray-400">Nenhum filtro aplicado</span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Tabela de histórico com design aprimorado */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow overflow-hidden border border-gray-100"
      >
        {/* Cabeçalho com contagem de resultados */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{logsFiltrados.length}</span> {logsFiltrados.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </div>
          
          <div className="text-xs text-gray-400">
            Histórico atualizado em {format(new Date(), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
        
        {/* Tabela com scroll horizontal em telas pequenas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Data/Hora</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Usuário</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Ação</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Detalhes</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {logsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p>Nenhum registro encontrado com os filtros atuais.</p>
                    <p className="text-sm">Tente ajustar os filtros para visualizar mais resultados.</p>
                  </td>
                </tr>
              ) : (
                logsFiltrados.map((log) => {
                  const categoriaConfig = getCategoriaConfig(log.categoria);
                  
                  return (
                    <tr key={log.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{log.data}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-indigo-700">{log.usuario}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">{log.acao}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.detalhe}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${categoriaConfig.cor}`}>
                          {categoriaConfig.icone}
                          {log.categoria}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Rodapé da tabela com paginação futura */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {/* Espaço para futura paginação */}
            Exibindo os mais {ordenacao === "recentes" ? "recentes" : "antigos"} primeiro
          </div>
          
          <div>
            {/* Futuros controles de paginação */}
            <Button variant="outline" size="sm" className="text-xs" disabled>
              Ver mais registros
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Seção de "Saiba mais" */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.4 }}
        className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800"
      >
        <p className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Sobre o Histórico:</span> 
          <span className="text-blue-700">
            O histórico de ações mantém um registro detalhado de todas as operações realizadas no sistema, 
            permitindo auditoria completa e rastreabilidade das atividades.
          </span>
        </p>
      </motion.div>
    </div>
  );
} 