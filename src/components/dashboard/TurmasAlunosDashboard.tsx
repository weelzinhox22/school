import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  Search, 
  AlertTriangle, 
  UserX, 
  TrendingUp,
  User,
  Calendar,
  MessageCircle,
  XCircle,
  Plus,
  Filter,
  ChevronDown,
  ChevronRight,
  File,
  BarChart2,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// Interface para as props do componente
interface TurmasAlunosDashboardProps {
  TURMAS: string[];
  mockNotas: Array<{
    turma: string;
    turno: string;
    media: number;
  }>;
  mockRankingTurmas: Array<{
    turma: string;
    media: number;
    frequencia: number;
  }>;
  mockAlunos: Array<{
    id: number;
    nome: string;
    turma: string;
    media: number;
    frequencia: number;
    status: string;
  }>;
  cardVariants: any;
}

// Interface para o modal de aluno
interface ModalAluno {
  id: number;
  nome: string;
  turma: string;
  media: number;
  frequencia: number;
  status: string;
  matricula?: string;
  responsavel?: string;
  contato?: string;
  email?: string;
  notas?: Record<string, number>;
  faltas?: Record<string, number>;
  observacoes?: string[];
}

/**
 * Componente de Turmas e Alunos para o Dashboard do Coordenador
 * 
 * Este componente gerencia a visualização e interação com turmas e alunos,
 * permitindo filtros, visualização de detalhes e ações relacionadas.
 */
export default function TurmasAlunosDashboard({
  TURMAS,
  mockNotas,
  mockRankingTurmas,
  mockAlunos,
  cardVariants
}: TurmasAlunosDashboardProps) {
  // Estado para a turma selecionada
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  
  // Estado para busca de alunos
  const [buscarAluno, setBuscarAluno] = useState("");
  
  // Estado para o modal de detalhe do aluno
  const [alunoDetalhe, setAlunoDetalhe] = useState<ModalAluno | null>(null);
  
  // Estado para o modal de mensagem
  const [modalMensagem, setModalMensagem] = useState<{
    aluno?: string;
    turma?: string;
    assunto?: string;
  } | null>(null);
  
  // Estado para o modal de relatório
  const [modalRelatorio, setModalRelatorio] = useState<{
    tipo: 'turma' | 'aluno' | 'geral';
    titulo: string;
    turma?: string;
    aluno?: string;
  } | null>(null);
  
  // Função para abrir o modal de detalhe do aluno
  const abrirDetalheAluno = (alunoId: number) => {
    const aluno = mockAlunos.find(a => a.id === alunoId);
    if (!aluno) return;
    
    // Criando dados adicionais simulados para o aluno
    const alunoDetalhado: ModalAluno = {
      ...aluno,
      matricula: "2024" + aluno.id.toString().padStart(4, '0'),
      responsavel: ["Maria Silva", "José Santos", "Ana Oliveira"][Math.floor(Math.random() * 3)],
      contato: "(11) 99999-" + Math.floor(1000 + Math.random() * 9000),
      email: `responsavel.${aluno.nome.toLowerCase().replace(' ', '.')}@email.com`,
      notas: {
        "Português": 5 + Math.random() * 5,
        "Matemática": 5 + Math.random() * 5,
        "História": 5 + Math.random() * 5,
        "Geografia": 5 + Math.random() * 5,
        "Ciências": 5 + Math.random() * 5
      },
      faltas: {
        "Português": Math.floor(Math.random() * 10),
        "Matemática": Math.floor(Math.random() * 10),
        "História": Math.floor(Math.random() * 10),
        "Geografia": Math.floor(Math.random() * 10),
        "Ciências": Math.floor(Math.random() * 10)
      },
      observacoes: [
        "Apresenta bom comportamento em sala de aula.",
        "Participa ativamente das discussões.",
        "Precisa melhorar a organização do material.",
        "Demonstra facilidade em trabalhos em grupo."
      ].filter(() => Math.random() > 0.3)
    };
    
    setAlunoDetalhe(alunoDetalhado);
  };
  
  // Função para fechar o modal de detalhe do aluno
  const fecharDetalheAluno = () => {
    setAlunoDetalhe(null);
  };
  
  // Função para abrir o modal de mensagem
  const abrirModalMensagem = (aluno?: string, turma?: string, assunto?: string) => {
    setModalMensagem({ aluno, turma, assunto });
  };
  
  // Função para fechar o modal de mensagem
  const fecharModalMensagem = () => {
    setModalMensagem(null);
  };
  
  // Função para enviar mensagem
  const enviarMensagem = () => {
    if (modalMensagem?.aluno) {
      toast.success(`Mensagem enviada para responsáveis de ${modalMensagem.aluno}`);
    } else if (modalMensagem?.turma) {
      toast.success(`Mensagem enviada para responsáveis da turma ${modalMensagem.turma}`);
    } else {
      toast.success("Mensagem enviada para todos os responsáveis");
    }
    fecharModalMensagem();
  };
  
  // Função para abrir o modal de relatório
  const abrirModalRelatorio = (tipo: 'turma' | 'aluno' | 'geral', titulo: string, turma?: string, aluno?: string) => {
    setModalRelatorio({ tipo, titulo, turma, aluno });
  };
  
  // Função para fechar o modal de relatório
  const fecharModalRelatorio = () => {
    setModalRelatorio(null);
  };
  
  // Função para gerar relatório
  const gerarRelatorio = () => {
    if (modalRelatorio?.tipo === 'turma') {
      toast.success(`Relatório da turma ${modalRelatorio.turma} gerado`);
    } else if (modalRelatorio?.tipo === 'aluno') {
      toast.success(`Relatório do aluno ${modalRelatorio.aluno} gerado`);
    } else {
      toast.success("Relatório geral de turmas gerado");
    }
    fecharModalRelatorio();
  };
  
  // Filtrar alunos com base na busca e na turma selecionada
  const alunosFiltrados = mockAlunos.filter(aluno => {
    const matchTurma = !turmaSelecionada || aluno.turma === turmaSelecionada;
    const matchBusca = !buscarAluno || aluno.nome.toLowerCase().includes(buscarAluno.toLowerCase());
    return matchTurma && matchBusca;
  });

  return (
    <motion.div
      key="turmas"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-700">Turmas e Alunos</h2>
        <div className="flex gap-2">
          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            value={turmaSelecionada}
            onChange={e => setTurmaSelecionada(e.target.value)}
          >
            <option value="">Todas as turmas</option>
            {TURMAS.map(turma => (
              <option key={turma} value={turma}>{turma}</option>
            ))}
          </select>
          <Button 
            className="flex gap-2" 
            onClick={() => abrirModalRelatorio('geral', 'Relatório de Turmas')}
          >
            <FileText className="w-5 h-5" /> Gerar Relatório
          </Button>
        </div>
      </div>
      
      {/* Filtro e busca de alunos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Busca de alunos */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar aluno por nome..."
              className="border rounded-lg pl-10 pr-4 py-2 w-full"
              value={buscarAluno}
              onChange={(e) => setBuscarAluno(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filtros rápidos */}
        <div className="col-span-1 bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <Filter className="w-4 h-4 mr-1" /> Filtros
            </span>
            <div className="flex gap-2">
              <button 
                className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                onClick={() => {
                  // Filtrar alunos com média baixa
                  setBuscarAluno("");
                  setTurmaSelecionada("");
                  toast.success("Filtrado: Alunos com baixo desempenho");
                }}
              >
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Baixo desempenho
                </div>
              </button>
              <button 
                className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                onClick={() => {
                  // Filtrar alunos com faltas
                  setBuscarAluno("");
                  setTurmaSelecionada("");
                  toast.success("Filtrado: Alunos com faltas frequentes");
                }}
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Faltas
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de alunos */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium">
            {turmaSelecionada 
              ? `Alunos da turma ${turmaSelecionada}` 
              : "Todos os alunos"}
            <span className="text-sm text-gray-500 ml-2">
              ({alunosFiltrados.length} alunos)
            </span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Média Geral
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alunosFiltrados.length > 0 ? (
                alunosFiltrados.map(aluno => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={() => abrirDetalheAluno(aluno.id)}
                      >
                        {aluno.nome}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {aluno.turma}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        aluno.media >= 7 
                          ? 'bg-green-100 text-green-800' 
                          : aluno.media >= 5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {aluno.media.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        aluno.frequencia >= 75 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {aluno.frequencia}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        aluno.status === 'Regular' 
                          ? 'bg-green-100 text-green-800' 
                          : aluno.status === 'Atenção' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="Enviar mensagem"
                          onClick={() => abrirModalMensagem(aluno.nome)}
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-purple-600 hover:text-purple-900"
                          title="Gerar relatório"
                          onClick={() => abrirModalRelatorio('aluno', `Relatório de ${aluno.nome}`, aluno.turma, aluno.nome)}
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum aluno encontrado com os filtros atuais
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Estatísticas de Turmas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ranking de turmas */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-indigo-700 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2" /> Ranking de Turmas
            </h3>
            <button 
              className="text-sm text-indigo-600 hover:underline flex items-center"
              onClick={() => abrirModalRelatorio('geral', 'Ranking de Turmas')}
            >
              Ver relatório <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {mockRankingTurmas
              .sort((a, b) => b.media - a.media)
              .slice(0, 5)
              .map((turma, index) => (
                <div key={turma.turma} className="flex items-center">
                  <div className="w-6 text-gray-500 font-medium">#{index + 1}</div>
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{turma.turma}</span>
                      <span className={`text-sm font-medium ${
                        turma.media >= 7 
                          ? 'text-green-600' 
                          : turma.media >= 5 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {turma.media.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          turma.media >= 7 
                            ? 'bg-green-500' 
                            : turma.media >= 5 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${(turma.media / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <button
              className="text-sm text-gray-500 hover:text-indigo-600 flex items-center"
              onClick={() => {
                setTurmaSelecionada("");
                toast.success("Exibindo todas as turmas");
              }}
            >
              Ver todas as turmas <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        
        {/* Médias por turma */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-indigo-700 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" /> Médias por Turma
            </h3>
            <button 
              className="text-sm text-indigo-600 hover:underline flex items-center"
              onClick={() => abrirModalRelatorio('geral', 'Desempenho por Turmas')}
            >
              Ver relatório <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockNotas.map(turma => (
              <motion.div
                key={turma.turma}
                whileHover={{ scale: 1.02 }}
                className="bg-indigo-50 rounded-lg p-4 cursor-pointer"
                onClick={() => {
                  setTurmaSelecionada(turma.turma);
                  toast.success(`Filtrado: Turma ${turma.turma}`);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{turma.turma}</h4>
                    <p className="text-sm text-gray-500">{turma.turno}</p>
                  </div>
                  <span className={`text-lg font-bold ${
                    turma.media >= 7 
                      ? 'text-green-600' 
                      : turma.media >= 5 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {turma.media.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-2.5 mb-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      turma.media >= 7 
                        ? 'bg-green-500' 
                        : turma.media >= 5 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${(turma.media / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>10</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 pt-4 border-t">
            <button
              className="text-sm text-indigo-600 flex items-center"
              onClick={() => abrirModalMensagem(undefined, undefined, "Comunicado sobre desempenho")}
            >
              <MessageCircle className="w-4 h-4 mr-1" /> Enviar comunicado geral
            </button>
            <button
              className="text-sm text-indigo-600 flex items-center"
              onClick={() => abrirModalRelatorio('geral', 'Comparativo de Turmas')}
            >
              <FileText className="w-4 h-4 mr-1" /> Relatório comparativo
            </button>
          </div>
        </div>
      </div>
      
      {/* Modais */}
      {/* Modal de Detalhe do Aluno */}
      {alunoDetalhe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                <User className="w-5 h-5 mr-2" /> Perfil do Aluno
              </h3>
              <button onClick={fecharDetalheAluno} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informações básicas */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Informações Básicas</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Nome:</span> {alunoDetalhe.nome}</p>
                    <p className="text-sm"><span className="font-medium">Matrícula:</span> {alunoDetalhe.matricula}</p>
                    <p className="text-sm"><span className="font-medium">Turma:</span> {alunoDetalhe.turma}</p>
                    <p className="text-sm"><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        alunoDetalhe.status === 'Regular' 
                          ? 'bg-green-100 text-green-800' 
                          : alunoDetalhe.status === 'Atenção' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {alunoDetalhe.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Contato do Responsável</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Nome:</span> {alunoDetalhe.responsavel}</p>
                    <p className="text-sm"><span className="font-medium">Telefone:</span> {alunoDetalhe.contato}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {alunoDetalhe.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button onClick={() => {
                    fecharDetalheAluno();
                    abrirModalMensagem(alunoDetalhe.nome);
                  }} className="w-full flex gap-2">
                    <MessageCircle className="w-4 h-4" /> Enviar Mensagem
                  </Button>
                  <Button onClick={() => {
                    fecharDetalheAluno();
                    abrirModalRelatorio('aluno', `Relatório de ${alunoDetalhe.nome}`, alunoDetalhe.turma, alunoDetalhe.nome);
                  }} variant="outline" className="w-full flex gap-2">
                    <FileText className="w-4 h-4" /> Gerar Relatório
                  </Button>
                </div>
              </div>
              
              {/* Desempenho acadêmico */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-4">Desempenho Acadêmico</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Média Geral</p>
                      <p className={`text-xl font-bold ${
                        alunoDetalhe.media >= 7 
                          ? 'text-green-600' 
                          : alunoDetalhe.media >= 5 
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>
                        {alunoDetalhe.media.toFixed(1)}
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Frequência</p>
                      <p className={`text-xl font-bold ${
                        alunoDetalhe.frequencia >= 75 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {alunoDetalhe.frequencia}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Notas por disciplina */}
                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-2">Notas por Disciplina</h5>
                    <div className="space-y-2">
                      {alunoDetalhe.notas && Object.entries(alunoDetalhe.notas).map(([disciplina, nota]) => (
                        <div key={disciplina} className="flex items-center justify-between">
                          <span className="text-sm">{disciplina}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            nota >= 7 
                              ? 'bg-green-100 text-green-800' 
                              : nota >= 5 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {nota.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Faltas por disciplina */}
                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-2">Faltas por Disciplina</h5>
                    <div className="space-y-2">
                      {alunoDetalhe.faltas && Object.entries(alunoDetalhe.faltas).map(([disciplina, faltas]) => (
                        <div key={disciplina} className="flex items-center justify-between">
                          <span className="text-sm">{disciplina}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            faltas <= 3 
                              ? 'bg-green-100 text-green-800' 
                              : faltas <= 6 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {faltas} faltas
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Observações */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Observações</h4>
                  {alunoDetalhe.observacoes && alunoDetalhe.observacoes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {alunoDetalhe.observacoes.map((obs, index) => (
                        <li key={index} className="text-sm">{obs}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhuma observação registrada.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Modal de Mensagem */}
      {modalMensagem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" /> Enviar Mensagem
              </h3>
              <button onClick={fecharModalMensagem} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinatário
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  value={modalMensagem.aluno 
                    ? `Responsável de ${modalMensagem.aluno}`
                    : modalMensagem.turma
                      ? `Responsáveis da Turma ${modalMensagem.turma}`
                      : "Todos os responsáveis"
                  }
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Digite o assunto da mensagem..."
                  defaultValue={modalMensagem.assunto || ""}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg h-32 resize-none"
                  placeholder="Digite sua mensagem..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={fecharModalMensagem}>
                  Cancelar
                </Button>
                <Button onClick={enviarMensagem}>
                  Enviar Mensagem
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Modal de Relatório */}
      {modalRelatorio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                <FileText className="w-5 h-5 mr-2" /> {modalRelatorio.titulo}
              </h3>
              <button onClick={fecharModalRelatorio} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Relatório
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  {modalRelatorio.tipo === 'aluno' && (
                    <>
                      <option value="completo">Relatório Completo</option>
                      <option value="notas">Boletim de Notas</option>
                      <option value="frequencia">Relatório de Frequência</option>
                      <option value="comportamento">Relatório de Comportamento</option>
                    </>
                  )}
                  {modalRelatorio.tipo === 'turma' && (
                    <>
                      <option value="desempenho">Desempenho Geral</option>
                      <option value="frequencia">Frequência Geral</option>
                      <option value="comportamento">Comportamento Geral</option>
                      <option value="ranking">Ranking de Alunos</option>
                    </>
                  )}
                  {modalRelatorio.tipo === 'geral' && (
                    <>
                      <option value="desempenho">Desempenho por Turmas</option>
                      <option value="frequencia">Frequência por Turmas</option>
                      <option value="ranking">Ranking de Turmas</option>
                      <option value="disciplinas">Desempenho por Disciplinas</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="bimestre1">1º Bimestre</option>
                  <option value="bimestre2">2º Bimestre</option>
                  <option value="bimestre3">3º Bimestre</option>
                  <option value="bimestre4">4º Bimestre</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="formato" value="pdf" className="mr-2" defaultChecked />
                    <span>PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="formato" value="excel" className="mr-2" />
                    <span>Excel</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={fecharModalRelatorio} className="flex gap-2">
                  <XCircle className="w-4 h-4" /> Cancelar
                </Button>
                <Button onClick={gerarRelatorio} className="flex gap-2">
                  <FileText className="w-4 h-4" /> Gerar Relatório
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <Printer className="w-4 h-4" /> Imprimir
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 