import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Inbox,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  Plus,
  SortDesc,
  Calendar,
  User,
  School,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ExternalLink,
  Download
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Papa from "papaparse";

// Definição de tipos para uso no componente
interface Solicitacao {
  id: number;
  tipo: string;
  solicitante: string;
  status: "Pendente" | "Aprovada" | "Rejeitada";
  data: string;
  email?: string;
  telefone?: string;
  detalhes?: string;
  prioridade?: "Baixa" | "Média" | "Alta";
  categoria?: string;
  responsavel?: string;
  comentarios?: Comentario[];
  documentos?: string[];
  dataCriacao: string;
  dataAtualizacao?: string;
}

interface Comentario {
  id: number;
  usuario: string;
  texto: string;
  data: string;
}

// Categorias de solicitações
const CATEGORIAS_SOLICITACAO = [
  "Matrícula",
  "Transferência",
  "Documentação",
  "Financeiro",
  "Atendimento",
  "Pedagógico",
  "Administrativo"
];

// Dados mockados para demonstração
const mockSolicitacoes: Solicitacao[] = [
  {
    id: 1,
    tipo: "Matrícula",
    solicitante: "Carlos Nunes",
    status: "Pendente",
    data: "2025-01-15",
    email: "carlos.nunes@email.com",
    telefone: "(11) 98765-4321",
    detalhes: "Solicitação de matrícula para o filho Pedro Nunes no 2º ano do Ensino Fundamental.",
    prioridade: "Média",
    categoria: "Matrícula",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 1, usuario: "Secretária Paula", texto: "Documentação inicial recebida, falta comprovante de residência.", data: "2025-01-16 09:30" }
    ],
    documentos: ["rg_responsavel.pdf", "certidao_nascimento.pdf"],
    dataCriacao: "2025-01-15 14:20",
    dataAtualizacao: "2025-01-16 09:30"
  },
  {
    id: 2,
    tipo: "Transferência",
    solicitante: "Julia Ramos",
    status: "Pendente",
    data: "2025-01-20",
    email: "julia.ramos@email.com",
    telefone: "(11) 91234-5678",
    detalhes: "Transferência da aluna Mariana Ramos para o Colégio São Paulo, necessita de histórico escolar e declaração de transferência.",
    prioridade: "Alta",
    categoria: "Transferência",
    responsavel: "Coordenador Paulo",
    comentarios: [
      { id: 2, usuario: "Coordenador Paulo", texto: "Verificando situação de débitos pendentes antes de liberar documentação.", data: "2025-01-21 11:15" }
    ],
    documentos: ["solicitacao_transferencia.pdf"],
    dataCriacao: "2025-01-20 10:45",
    dataAtualizacao: "2025-01-21 11:15"
  },
  {
    id: 3,
    tipo: "2ª via de boletim",
    solicitante: "Lucas Silva",
    status: "Aprovada",
    data: "2025-01-25",
    email: "lucas.silva@email.com",
    telefone: "(11) 97777-8888",
    detalhes: "Solicitação de segunda via do boletim do 4º bimestre de 2024.",
    prioridade: "Baixa",
    categoria: "Documentação",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 3, usuario: "Secretária Paula", texto: "Boletim gerado e disponibilizado no portal do aluno.", data: "2025-01-25 15:40" },
      { id: 4, usuario: "Diretor Teste", texto: "Aprovado. Liberar acesso imediato.", data: "2025-01-25 14:30" }
    ],
    documentos: ["boletim_4bim_2024.pdf"],
    dataCriacao: "2025-01-25 10:10",
    dataAtualizacao: "2025-01-25 15:40"
  },
  {
    id: 4,
    tipo: "Matrícula",
    solicitante: "Ana Souza",
    status: "Rejeitada",
    data: "2025-01-12",
    email: "ana.souza@email.com",
    telefone: "(11) 95555-6666",
    detalhes: "Solicitação de matrícula para turma de 3º ano que já está com vagas preenchidas.",
    prioridade: "Média",
    categoria: "Matrícula",
    responsavel: "Diretor Teste",
    comentarios: [
      { id: 5, usuario: "Secretária Paula", texto: "Turma do 3º ano está com todas as vagas preenchidas.", data: "2025-01-13 09:20" },
      { id: 6, usuario: "Diretor Teste", texto: "Infelizmente não há disponibilidade de vagas no momento. Sugerir lista de espera.", data: "2025-01-14 11:30" }
    ],
    documentos: [],
    dataCriacao: "2025-01-12 16:50",
    dataAtualizacao: "2025-01-14 11:30"
  },
  {
    id: 5,
    tipo: "Declaração de Matrícula",
    solicitante: "Roberto Almeida",
    status: "Pendente",
    data: "2025-02-05",
    email: "roberto.almeida@email.com",
    telefone: "(11) 93333-2222",
    detalhes: "Necessita de declaração de matrícula para o filho João Almeida para fins de transporte escolar.",
    prioridade: "Média",
    categoria: "Documentação",
    dataCriacao: "2025-02-05 08:30"
  },
  {
    id: 6,
    tipo: "Renegociação de Mensalidade",
    solicitante: "Fernanda Torres",
    status: "Pendente",
    data: "2025-02-10",
    email: "fernanda.torres@email.com",
    telefone: "(11) 96666-7777",
    detalhes: "Solicita renegociação de mensalidades atrasadas dos meses de Dezembro/2024 e Janeiro/2025.",
    prioridade: "Alta",
    categoria: "Financeiro",
    responsavel: "Carla Mendes",
    comentarios: [
      { id: 7, usuario: "Carla Mendes", texto: "Aguardando aprovação da diretoria para o plano de pagamento proposto.", data: "2025-02-11 14:20" }
    ],
    dataCriacao: "2025-02-10 13:15",
    dataAtualizacao: "2025-02-11 14:20"
  },
  {
    id: 7,
    tipo: "Solicitação de Reunião",
    solicitante: "Marcos Gomes",
    status: "Aprovada",
    data: "2025-02-15",
    email: "marcos.gomes@email.com",
    telefone: "(11) 98888-9999",
    detalhes: "Solicita reunião com o coordenador para discutir desempenho do filho Gabriel no 5º ano.",
    prioridade: "Média",
    categoria: "Atendimento",
    responsavel: "Coordenador Paulo",
    comentarios: [
      { id: 8, usuario: "Coordenador Paulo", texto: "Reunião agendada para 20/02/2025 às 14h.", data: "2025-02-16 10:30" }
    ],
    dataCriacao: "2025-02-15 15:45",
    dataAtualizacao: "2025-02-16 10:30"
  },
  {
    id: 8,
    tipo: "Adaptação Curricular",
    solicitante: "Cristina Martins",
    status: "Aprovada",
    data: "2025-02-20",
    email: "cristina.martins@email.com",
    telefone: "(11) 97777-5555",
    detalhes: "Solicita adaptação curricular para o filho Henrique que possui laudo de TDAH.",
    prioridade: "Alta",
    categoria: "Pedagógico",
    responsavel: "Diretor Teste",
    comentarios: [
      { id: 9, usuario: "Coordenador Paulo", texto: "Recebi a documentação médica que comprova a necessidade.", data: "2025-02-21 09:15" },
      { id: 10, usuario: "Diretor Teste", texto: "Aprovado. Equipe pedagógica deve elaborar plano de adaptação em até 10 dias.", data: "2025-02-22 11:30" }
    ],
    documentos: ["laudo_medico.pdf", "relatorio_neurologico.pdf"],
    dataCriacao: "2025-02-20 08:40",
    dataAtualizacao: "2025-02-22 11:30"
  },
  {
    id: 9,
    tipo: "Cancelamento de Matrícula",
    solicitante: "Patricia Santos",
    status: "Pendente",
    data: "2025-03-05",
    email: "patricia.santos@email.com",
    telefone: "(11) 92222-3333",
    detalhes: "Solicita cancelamento de matrícula da filha Beatriz por motivo de mudança de cidade.",
    prioridade: "Média",
    categoria: "Administrativo",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 11, usuario: "Secretária Paula", texto: "Verificando situação financeira para dar prosseguimento.", data: "2025-03-06 14:20" }
    ],
    dataCriacao: "2025-03-05 11:30",
    dataAtualizacao: "2025-03-06 14:20"
  },
  {
    id: 10,
    tipo: "Solicitação de Bolsa",
    solicitante: "Eduardo Oliveira",
    status: "Rejeitada",
    data: "2025-03-10",
    email: "eduardo.oliveira@email.com",
    telefone: "(11) 94444-5555",
    detalhes: "Solicita bolsa de estudos parcial para os filhos gêmeos José e Mariana.",
    prioridade: "Média",
    categoria: "Financeiro",
    responsavel: "Diretor Teste",
    comentarios: [
      { id: 12, usuario: "Carla Mendes", texto: "Análise financeira realizada. Documentação não atende aos critérios do programa de bolsas.", data: "2025-03-12 09:30" },
      { id: 13, usuario: "Diretor Teste", texto: "Infelizmente não foi possível atender à solicitação neste momento. Sugerir entrada no próximo processo seletivo de bolsas em Julho/2025.", data: "2025-03-15 14:15" }
    ],
    documentos: ["declaracao_imposto_renda.pdf", "comprovantes_renda.pdf"],
    dataCriacao: "2025-03-10 10:20",
    dataAtualizacao: "2025-03-15 14:15"
  },
  {
    id: 11,
    tipo: "Histórico Escolar",
    solicitante: "Gustavo Lima",
    status: "Aprovada",
    data: "2025-03-20",
    email: "gustavo.lima@email.com",
    telefone: "(11) 98765-1234",
    detalhes: "Solicita emissão de histórico escolar completo para fins de inscrição em vestibular.",
    prioridade: "Alta",
    categoria: "Documentação",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 14, usuario: "Secretária Paula", texto: "Histórico gerado e disponível para retirada na secretaria.", data: "2025-03-21 16:00" }
    ],
    documentos: ["historico_escolar_completo.pdf"],
    dataCriacao: "2025-03-20 14:30",
    dataAtualizacao: "2025-03-21 16:00"
  },
  {
    id: 12,
    tipo: "Troca de Turma",
    solicitante: "Camila Ferreira",
    status: "Pendente",
    data: "2025-04-05",
    email: "camila.ferreira@email.com",
    telefone: "(11) 91111-2222",
    detalhes: "Solicita transferência do filho Miguel da turma 2A para 2B por incompatibilidade de horário com atividade extraclasse.",
    prioridade: "Média",
    categoria: "Administrativo",
    responsavel: "Coordenador Paulo",
    comentarios: [
      { id: 15, usuario: "Coordenador Paulo", texto: "Verificando disponibilidade de vagas na turma 2B.", data: "2025-04-06 10:45" }
    ],
    dataCriacao: "2025-04-05 09:10",
    dataAtualizacao: "2025-04-06 10:45"
  },
  {
    id: 13,
    tipo: "Desconto Irmãos",
    solicitante: "Fernando Costa",
    status: "Aprovada",
    data: "2025-04-10",
    email: "fernando.costa@email.com",
    telefone: "(11) 93333-4444",
    detalhes: "Solicita desconto para irmãos (Pedro e Mariana) conforme política da escola.",
    prioridade: "Baixa",
    categoria: "Financeiro",
    responsavel: "Carla Mendes",
    comentarios: [
      { id: 16, usuario: "Carla Mendes", texto: "Verificada matrícula ativa dos dois irmãos. Desconto de 10% aplicado conforme política.", data: "2025-04-11 15:30" },
      { id: 17, usuario: "Diretor Teste", texto: "Aprovado. Desconto válido a partir da próxima mensalidade.", data: "2025-04-12 09:20" }
    ],
    dataCriacao: "2025-04-10 11:20",
    dataAtualizacao: "2025-04-12 09:20"
  },
  {
    id: 14,
    tipo: "Reposição de Aula",
    solicitante: "Leonardo Vasconcelos",
    status: "Pendente",
    data: "2025-04-15",
    email: "leonardo.vasconcelos@email.com",
    telefone: "(11) 95555-7777",
    detalhes: "Professor de Matemática solicita agendar reposição de aula do dia 10/04 que foi perdida por motivo de doença.",
    prioridade: "Média",
    categoria: "Pedagógico",
    responsavel: "Coordenador Paulo",
    dataCriacao: "2025-04-15 13:45"
  },
  {
    id: 15,
    tipo: "Declaração de Frequência",
    solicitante: "Regina Duarte",
    status: "Aprovada",
    data: "2025-04-20",
    email: "regina.duarte@email.com",
    telefone: "(11) 97777-6666",
    detalhes: "Solicita declaração de frequência do filho Lucas para apresentar ao empregador (benefício auxílio educação).",
    prioridade: "Baixa",
    categoria: "Documentação",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 18, usuario: "Secretária Paula", texto: "Declaração emitida e enviada por e-mail conforme solicitado.", data: "2025-04-20 16:15" }
    ],
    documentos: ["declaracao_frequencia.pdf"],
    dataCriacao: "2025-04-20 10:30",
    dataAtualizacao: "2025-04-20 16:15"
  },
  {
    id: 16,
    tipo: "Abono de Faltas",
    solicitante: "Ricardo Pereira",
    status: "Pendente",
    data: "2025-04-25",
    email: "ricardo.pereira@email.com",
    telefone: "(11) 98888-7777",
    detalhes: "Solicita abono de faltas do filho Daniel no período de 15 a 20/04 por motivo de cirurgia.",
    prioridade: "Média",
    categoria: "Pedagógico",
    responsavel: "Coordenador Paulo",
    comentarios: [
      { id: 19, usuario: "Coordenador Paulo", texto: "Recebido atestado médico. Encaminhando para análise do diretor.", data: "2025-04-26 11:20" }
    ],
    documentos: ["atestado_medico.pdf"],
    dataCriacao: "2025-04-25 09:50",
    dataAtualizacao: "2025-04-26 11:20"
  },
  {
    id: 17,
    tipo: "Matrícula Fora do Prazo",
    solicitante: "Juliana Mendes",
    status: "Aprovada",
    data: "2025-05-05",
    email: "juliana.mendes@email.com",
    telefone: "(11) 92222-4444",
    detalhes: "Solicita matrícula fora do prazo regular para a filha Laura no 4º ano por motivo de mudança recente para a cidade.",
    prioridade: "Alta",
    categoria: "Matrícula",
    responsavel: "Diretor Teste",
    comentarios: [
      { id: 20, usuario: "Secretária Paula", texto: "Verificada disponibilidade de vaga no 4º ano B.", data: "2025-05-06 10:30" },
      { id: 21, usuario: "Diretor Teste", texto: "Aprovada matrícula em caráter excepcional. Aluna deve passar por avaliação diagnóstica.", data: "2025-05-07 14:45" }
    ],
    dataCriacao: "2025-05-05 15:20",
    dataAtualizacao: "2025-05-07 14:45"
  },
  {
    id: 18,
    tipo: "Certificado de Conclusão",
    solicitante: "Paulo Guimarães",
    status: "Pendente",
    data: "2025-05-10",
    email: "paulo.guimaraes@email.com",
    telefone: "(11) 94444-3333",
    detalhes: "Solicita emissão de certificado de conclusão do Ensino Médio para fins de matrícula em faculdade.",
    prioridade: "Alta",
    categoria: "Documentação",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 22, usuario: "Secretária Paula", texto: "Verificando pendências antes da emissão do certificado.", data: "2025-05-11 09:15" }
    ],
    dataCriacao: "2025-05-10 16:40",
    dataAtualizacao: "2025-05-11 09:15"
  },
  {
    id: 19,
    tipo: "Autorização de Saída",
    solicitante: "Carolina Ribeiro",
    status: "Aprovada",
    data: "2025-05-15",
    email: "carolina.ribeiro@email.com",
    telefone: "(11) 96666-8888",
    detalhes: "Autorização para que o filho Matheus seja retirado da escola pelo tio João nas segundas e quartas-feiras.",
    prioridade: "Média",
    categoria: "Administrativo",
    responsavel: "Secretária Paula",
    comentarios: [
      { id: 23, usuario: "Secretária Paula", texto: "Documentação do responsável adicional recebida e registrada no sistema.", data: "2025-05-15 14:20" },
      { id: 24, usuario: "Diretor Teste", texto: "Aprovado. Comunicar portaria e professores.", data: "2025-05-16 09:30" }
    ],
    documentos: ["rg_tio.pdf", "termo_autorizacao_assinado.pdf"],
    dataCriacao: "2025-05-15 11:10",
    dataAtualizacao: "2025-05-16 09:30"
  },
  {
    id: 20,
    tipo: "Segunda Chamada de Prova",
    solicitante: "Felipe Gomes",
    status: "Pendente",
    data: "2025-05-18",
    email: "felipe.gomes@email.com",
    telefone: "(11) 99999-1111",
    detalhes: "Solicita segunda chamada para prova de História realizada em 15/05 por motivo de consulta médica.",
    prioridade: "Alta",
    categoria: "Pedagógico",
    dataCriacao: "2025-05-18 08:40"
  }
];

/**
 * Componente GestaoSolicitacoes
 * 
 * Este componente gerencia todas as solicitações administrativas e acadêmicas
 * recebidas pela instituição, permitindo:
 * - Visualizar solicitações com filtros e buscas avançadas
 * - Aprovar ou rejeitar solicitações com registro de histórico
 * - Adicionar comentários e anexar documentos
 * - Acompanhar o status e tempos de resposta
 * - Gerar relatórios e estatísticas
 */
const GestaoSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(mockSolicitacoes);
  const [filtros, setFiltros] = useState({
    categoria: "",
    status: "",
    periodo: ""
  });
  const [busca, setBusca] = useState("");
  const [solicitacaoDetalhes, setSolicitacaoDetalhes] = useState<Solicitacao | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [novaSolicitacao, setMostrarNovaSolicitacao] = useState(false);
  
  // Filtrar solicitações de acordo com os filtros aplicados
  const solicitacoesFiltradas = solicitacoes.filter(sol => {
    // Filtro por categoria
    if (filtros.categoria && sol.categoria !== filtros.categoria) return false;
    
    // Filtro por status
    if (filtros.status && sol.status !== filtros.status) return false;
    
    // Filtro por termo de busca
    if (busca && !sol.solicitante.toLowerCase().includes(busca.toLowerCase()) && 
        !sol.tipo.toLowerCase().includes(busca.toLowerCase())) return false;
    
    return true;
  });
  
  // Função para aprovar uma solicitação
  const aprovarSolicitacao = (id: number) => {
    setSolicitacoes(solicitacoes.map(s => 
      s.id === id 
        ? { ...s, status: "Aprovada", dataAtualizacao: format(new Date(), "yyyy-MM-dd HH:mm") } 
        : s
    ));
    toast.success("Solicitação aprovada com sucesso!");
  };
  
  // Função para rejeitar uma solicitação
  const rejeitarSolicitacao = (id: number) => {
    setSolicitacoes(solicitacoes.map(s => 
      s.id === id 
        ? { ...s, status: "Rejeitada", dataAtualizacao: format(new Date(), "yyyy-MM-dd HH:mm") } 
        : s
    ));
    toast.success("Solicitação rejeitada");
  };
  
  // Função para exibir detalhes da solicitação
  const verDetalhes = (id: number) => {
    const solicitacao = solicitacoes.find(s => s.id === id);
    if (solicitacao) {
      setSolicitacaoDetalhes(solicitacao);
    }
  };
  
  // Função para exportar solicitações como CSV
  const exportarCSV = () => {
    const csv = Papa.unparse(solicitacoesFiltradas);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `solicitacoes_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
    toast.success("Arquivo CSV exportado com sucesso!");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <Inbox className="w-6 h-6" /> Painel de Solicitações
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-1"
          >
            <Filter className="w-4 h-4" /> Filtros
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setMostrarNovaSolicitacao(true)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Nova Solicitação
          </Button>
        </div>
      </div>
      
      {/* Barra de filtros */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-indigo-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-indigo-800 mb-1">Busca</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou tipo..."
                    className="pl-9 w-full rounded border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-indigo-800 mb-1">Categoria</label>
                <select
                  className="w-full rounded border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filtros.categoria}
                  onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                >
                  <option value="">Todas as categorias</option>
                  {CATEGORIAS_SOLICITACAO.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-indigo-800 mb-1">Status</label>
                <select
                  className="w-full rounded border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filtros.status}
                  onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                >
                  <option value="">Todos os status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Rejeitada">Rejeitada</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setBusca("");
                    setFiltros({
                      categoria: "",
                      status: "",
                      periodo: ""
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tabela de solicitações */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-indigo-50">
              <tr>
                <th className="py-3 px-4 text-indigo-700 font-semibold">Tipo</th>
                <th className="py-3 px-4 text-indigo-700 font-semibold">Solicitante</th>
                <th className="py-3 px-4 text-indigo-700 font-semibold">Status</th>
                <th className="py-3 px-4 text-indigo-700 font-semibold">Data</th>
                <th className="py-3 px-4 text-indigo-700 font-semibold">Prioridade</th>
                <th className="py-3 px-4 text-indigo-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Inbox className="w-10 h-10 text-gray-300 mb-2" />
                      <p>Nenhuma solicitação encontrada</p>
                    </div>
                  </td>
                </tr>
              ) : (
                solicitacoesFiltradas.map((sol, index) => (
                  <motion.tr 
                    key={sol.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => verDetalhes(sol.id)}
                  >
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        {sol.tipo}
                      </div>
                    </td>
                    <td className="py-3 px-4">{sol.solicitante}</td>
                    <td className="py-3 px-4">
                      {sol.status === "Aprovada" && (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 rounded-full px-2 py-1 text-xs">
                          <CheckCircle2 className="w-3 h-3" />Aprovada
                        </span>
                      )}
                      {sol.status === "Rejeitada" && (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 rounded-full px-2 py-1 text-xs">
                          <XCircle className="w-3 h-3" />Rejeitada
                        </span>
                      )}
                      {sol.status === "Pendente" && (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 rounded-full px-2 py-1 text-xs">
                          <Clock className="w-3 h-3" />Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {format(parseISO(sol.data), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4">
                      {sol.prioridade === "Alta" && (
                        <span className="text-red-700 bg-red-50 rounded-full px-2 py-1 text-xs">
                          Alta
                        </span>
                      )}
                      {sol.prioridade === "Média" && (
                        <span className="text-amber-700 bg-amber-50 rounded-full px-2 py-1 text-xs">
                          Média
                        </span>
                      )}
                      {sol.prioridade === "Baixa" && (
                        <span className="text-green-700 bg-green-50 rounded-full px-2 py-1 text-xs">
                          Baixa
                        </span>
                      )}
                      {!sol.prioridade && (
                        <span className="text-gray-500 bg-gray-50 rounded-full px-2 py-1 text-xs">
                          Não definida
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            verDetalhes(sol.id);
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {sol.status === "Pendente" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                aprovarSolicitacao(sol.id);
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                rejeitarSolicitacao(sol.id);
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Rodapé da tabela com paginação/estatísticas */}
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            Exibindo {solicitacoesFiltradas.length} de {solicitacoes.length} solicitações
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={exportarCSV}
          >
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>
      
      {/* Modal de detalhes */}
      <AnimatePresence>
        {solicitacaoDetalhes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={() => setSolicitacaoDetalhes(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      solicitacaoDetalhes.categoria === "Matrícula" ? "bg-blue-100 text-blue-800" :
                      solicitacaoDetalhes.categoria === "Transferência" ? "bg-purple-100 text-purple-800" :
                      solicitacaoDetalhes.categoria === "Documentação" ? "bg-amber-100 text-amber-800" :
                      solicitacaoDetalhes.categoria === "Financeiro" ? "bg-green-100 text-green-800" :
                      solicitacaoDetalhes.categoria === "Pedagógico" ? "bg-indigo-100 text-indigo-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {solicitacaoDetalhes.categoria || "Sem categoria"}
                    </span>
                    {solicitacaoDetalhes.prioridade && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        solicitacaoDetalhes.prioridade === "Alta" ? "bg-red-100 text-red-800" :
                        solicitacaoDetalhes.prioridade === "Média" ? "bg-amber-100 text-amber-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        Prioridade {solicitacaoDetalhes.prioridade}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">
                    {solicitacaoDetalhes.tipo}
                  </h3>
                  <p className="text-gray-500">
                    Solicitado por {solicitacaoDetalhes.solicitante} em {format(parseISO(solicitacaoDetalhes.data), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  {solicitacaoDetalhes.status === "Aprovada" && (
                    <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 rounded-full px-3 py-1">
                      <CheckCircle2 className="w-4 h-4" />Aprovada
                    </span>
                  )}
                  {solicitacaoDetalhes.status === "Rejeitada" && (
                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 rounded-full px-3 py-1">
                      <XCircle className="w-4 h-4" />Rejeitada
                    </span>
                  )}
                  {solicitacaoDetalhes.status === "Pendente" && (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 rounded-full px-3 py-1">
                      <Clock className="w-4 h-4" />Pendente
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Detalhes da Solicitação</h4>
                    <p className="text-gray-800">{solicitacaoDetalhes.detalhes || "Sem detalhes adicionais."}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Informações de Contato</h4>
                    <div className="space-y-1">
                      {solicitacaoDetalhes.email && (
                        <p className="text-gray-800 flex items-center gap-2">
                          <span className="text-indigo-500 font-medium">Email:</span> {solicitacaoDetalhes.email}
                        </p>
                      )}
                      {solicitacaoDetalhes.telefone && (
                        <p className="text-gray-800 flex items-center gap-2">
                          <span className="text-indigo-500 font-medium">Telefone:</span> {solicitacaoDetalhes.telefone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {solicitacaoDetalhes.documentos && solicitacaoDetalhes.documentos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Documentos Anexados</h4>
                      <div className="space-y-2">
                        {solicitacaoDetalhes.documentos.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            <span className="text-gray-800">{doc}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Histórico de Ações</h4>
                  <div className="space-y-3">
                    {/* Data de criação */}
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Plus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Solicitação criada</p>
                        <p className="text-xs text-gray-500">
                          {solicitacaoDetalhes.dataCriacao 
                            ? format(new Date(solicitacaoDetalhes.dataCriacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                            : format(parseISO(solicitacaoDetalhes.data), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Comentários */}
                    {solicitacaoDetalhes.comentarios && solicitacaoDetalhes.comentarios.map((comentario, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div className={`absolute top-8 bottom-0 left-4 w-0.5 ${
                            index === (solicitacaoDetalhes.comentarios?.length || 0) - 1 && !solicitacaoDetalhes.dataAtualizacao 
                              ? 'bg-transparent' : 'bg-gray-200'
                          }`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{comentario.usuario}</p>
                          <p className="text-sm text-gray-700 mb-1">{comentario.texto}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(comentario.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Atualização de status (se houver) */}
                    {solicitacaoDetalhes.dataAtualizacao && (
                      <div className="flex gap-3">
                        <div className="relative">
                          <div className={`h-8 w-8 rounded-full ${
                            solicitacaoDetalhes.status === "Aprovada" ? "bg-green-100" : "bg-red-100"
                          } flex items-center justify-center`}>
                            {solicitacaoDetalhes.status === "Aprovada" 
                              ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                              : <XCircle className="w-4 h-4 text-red-600" />
                            }
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Solicitação {solicitacaoDetalhes.status === "Aprovada" ? "aprovada" : "rejeitada"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(solicitacaoDetalhes.dataAtualizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                {solicitacaoDetalhes.status === "Pendente" ? (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSolicitacaoDetalhes(null)}
                    >
                      Fechar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        rejeitarSolicitacao(solicitacaoDetalhes.id);
                        setSolicitacaoDetalhes(null);
                      }}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        aprovarSolicitacao(solicitacaoDetalhes.id);
                        setSolicitacaoDetalhes(null);
                      }}
                    >
                      Aprovar
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSolicitacaoDetalhes(null)}
                    >
                      Fechar
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestaoSolicitacoes; 