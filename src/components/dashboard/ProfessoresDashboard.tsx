import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  XCircle, 
  FileText, 
  AlertTriangle, 
  BookOpenCheck,
  Clock,
  CheckCircle2,
  Eye,
  Send,
  Mail,
  Phone,
  Bookmark,
  Award,
  BookOpen,
  User,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// Interface para as props do componente
interface ProfessoresDashboardProps {
  mockProfessores: Array<{
    id: number;
    nome: string;
    disciplina: string;
    turmas: string[];
    email: string;
    status: string;
  }>;
  mockEventosAcademicos: Array<{
    id: number;
    titulo: string;
    data: string;
    tipo: string;
  }>;
  cardVariants: any;
}

// Interface para o modal de ações
interface ModalAcao {
  tipo: 'acompanhar' | 'mensagem' | 'lembrete';
  titulo: string;
  professor?: string;
  assunto?: string;
}

// Interface para o professor detalhado
interface ProfessorDetalhado {
  id: number;
  nome: string;
  disciplina: string;
  turmas: string[];
  email: string;
  status: string;
  telefone?: string;
  formacao?: string;
  especializacao?: string;
  tempoExperiencia?: string;
  dataContratacao?: string;
  biografia?: string;
  habilidades?: string[];
  avaliacaoDesempenho?: number;
}

// Componente de gerenciamento de professores
export default function ProfessoresDashboard({ 
  mockProfessores, 
  mockEventosAcademicos,
  cardVariants 
}: ProfessoresDashboardProps) {
  // Estado para o professor selecionado (para modal de horários)
  const [professorSelecionado, setProfessorSelecionado] = useState<null | {
    id: number;
    nome: string;
    disciplina?: string;
    turmas?: string[];
    email?: string;
    status?: string;
    horarios?: Record<string, any>;
  }>(null);
  
  // Estado para o modal de ações (acompanhar, mensagem, lembrete)
  const [modalAcao, setModalAcao] = useState<ModalAcao | null>(null);
  
  // Mensagem padrão para o textarea
  const [mensagem, setMensagem] = useState("");
  
  // Estado para o modal de perfil do professor
  const [professorPerfil, setProfessorPerfil] = useState<ProfessorDetalhado | null>(null);
  
  // Estado para controlar o modal recém-aberto (para animações)
  const [modalOrigemId, setModalOrigemId] = useState<string | null>(null);

  // Função para abrir o modal de ação
  const abrirModalAcao = (tipo: ModalAcao['tipo'], titulo: string, professor?: string, assunto?: string, origem?: string) => {
    if (origem) {
      setModalOrigemId(origem);
    }
    
    setModalAcao({ tipo, titulo, professor, assunto });
    // Definir uma mensagem padrão com base no tipo de ação
    if (tipo === 'acompanhar') {
      setMensagem(`Prezado(a) ${professor || 'Professor(a)'},\n\nGostaria de agendar uma reunião para acompanhamento do seu trabalho pedagógico.\n\nAtenciosamente,\nCoordenação Pedagógica`);
    } else if (tipo === 'mensagem') {
      setMensagem(`Prezado(a) ${professor || 'Professor(a)'},\n\n`);
    } else if (tipo === 'lembrete') {
      setMensagem(`Prezado(a) Professor(a),\n\nGostaria de lembrá-lo(a) sobre ${assunto || 'as pendências'}.\n\nAtenciosamente,\nCoordenação Pedagógica`);
    }
  };

  // Função para fechar o modal
  const fecharModalAcao = () => {
    setModalAcao(null);
    setMensagem("");
    setModalOrigemId(null);
  };

  // Função para enviar a ação
  const enviarAcao = () => {
    if (!modalAcao) return;
    
    if (modalAcao.tipo === 'acompanhar') {
      toast.success(`Acompanhamento agendado ${modalAcao.professor ? `com ${modalAcao.professor}` : ''}`);
    } else if (modalAcao.tipo === 'mensagem') {
      toast.success(`Mensagem enviada ${modalAcao.professor ? `para ${modalAcao.professor}` : 'para todos os professores'}`);
    } else if (modalAcao.tipo === 'lembrete') {
      toast.success(`Lembrete enviado sobre ${modalAcao.assunto || 'pendências'}`);
    }
    
    fecharModalAcao();
  };
  
  // Função para abrir o perfil detalhado do professor
  const abrirPerfilProfessor = (professorId: number, origem?: string) => {
    if (origem) {
      setModalOrigemId(origem);
    }
    
    const professor = mockProfessores.find(p => p.id === professorId);
    if (!professor) return;
    
    // Dados adicionais simulados para o perfil detalhado
    const dadosDetalhados: ProfessorDetalhado = {
      ...professor,
      telefone: "(11) 99999-" + Math.floor(1000 + Math.random() * 9000),
      formacao: ["Licenciatura em " + professor.disciplina, "Mestrado em Educação"][Math.floor(Math.random() * 2)],
      especializacao: ["Educação Inclusiva", "Tecnologias Educacionais", "Psicopedagogia"][Math.floor(Math.random() * 3)],
      tempoExperiencia: (3 + Math.floor(Math.random() * 15)) + " anos",
      dataContratacao: "0" + (1 + Math.floor(Math.random() * 9)) + "/0" + (1 + Math.floor(Math.random() * 9)) + "/202" + (1 + Math.floor(Math.random() * 3)),
      biografia: "Profissional dedicado(a) e com ampla experiência na área de " + professor.disciplina + ". Comprometido(a) com o desenvolvimento dos alunos e sempre buscando inovações pedagógicas.",
      habilidades: ["Comunicação", "Metodologias ativas", "Avaliação formativa", "Tecnologias digitais", "Mediação de conflitos"].slice(0, 3 + Math.floor(Math.random() * 3)),
      avaliacaoDesempenho: 7.5 + Math.random() * 2.5
    };
    
    setProfessorPerfil(dadosDetalhados);
  };
  
  // Função para fechar o modal de perfil
  const fecharPerfilProfessor = () => {
    setProfessorPerfil(null);
    setModalOrigemId(null);
  };
  
  // Função para ver os horários a partir do perfil
  const verHorariosDoPerfilProfessor = () => {
    if (!professorPerfil) return;
    
    // Manter uma referência do perfil antes de fechá-lo
    const perfil = {...professorPerfil};
    
    // Fechar o modal de perfil
    setProfessorPerfil(null);
    
    // Definir a origem como 'perfil' para o modal de horários saber de onde veio
    setModalOrigemId('perfil');
    
    // Abrir o modal de horários
    setTimeout(() => {
      setProfessorSelecionado(perfil);
    }, 100);
  };
  
  // Função para voltar ao perfil depois de fechar os horários
  const voltarAoPerfil = (professor: any) => {
    if (!professor || !professor.id) return;
    
    // Fechar o modal de horários
    setProfessorSelecionado(null);
    
    // Reabrir o modal de perfil
    setTimeout(() => {
      abrirPerfilProfessor(professor.id);
    }, 100);
  };

  return (
    <motion.div
      key="professores"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cabeçalho com título e botões de ação */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-700">Equipe de Professores</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex gap-2 bg-indigo-50 border-indigo-200 hover:bg-indigo-100" 
            onClick={() => setProfessorSelecionado({ nome: '', horarios: {}, id: 0 })}
          >
            <Calendar className="w-5 h-5 text-indigo-600" /> Ver Horários
          </Button>
          <Button 
            className="flex gap-2 bg-indigo-600 hover:bg-indigo-700" 
            onClick={() => abrirModalAcao('mensagem', 'Mensagem para Todos')}
          >
            <MessageCircle className="w-5 h-5" /> Mensagem para Todos
          </Button>
        </div>
      </div>
      
      {/* Modal de Horários dos Professores */}
      {professorSelecionado !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.95, y: 30 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 30 }} 
            transition={{ type: "spring", stiffness: 120 }} 
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> 
                {professorSelecionado.id ? `Horários de ${professorSelecionado.nome}` : 'Horários dos Professores'}
              </h3>
              <div className="flex items-center gap-2">
                {modalOrigemId === 'perfil' && professorSelecionado.id && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => voltarAoPerfil(professorSelecionado)}
                    className="text-indigo-600 text-sm"
                  >
                    <User className="h-4 w-4 mr-1" /> Voltar ao Perfil
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setProfessorSelecionado(null)}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {professorSelecionado.id ? (
              // Visualização de um professor específico
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{professorSelecionado.nome}</h4>
                    <p className="text-gray-500">{professorSelecionado.disciplina || 'Professor'}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
                  <h5 className="font-semibold text-indigo-800 px-4 py-3 bg-gradient-to-r from-indigo-50 to-white border-b">Disponibilidade Semanal</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-left font-medium border-b border-indigo-100"></th>
                          <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Segunda</th>
                          <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Terça</th>
                          <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quarta</th>
                          <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quinta</th>
                          <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Sexta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Manhã (7h-12h)', 'Tarde (13h-18h)', 'Noite (19h-22h)'].map((periodo, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 font-medium text-gray-700 border-r border-indigo-100">{periodo}</td>
                            {['seg', 'ter', 'qua', 'qui', 'sex'].map((dia, j) => {
                              // Simulando dados de disponibilidade
                              const disponivel = Math.random() > 0.3;
                              const aula = disponivel && Math.random() > 0.4;
                              return (
                                <td 
                                  key={j} 
                                  className="py-3 text-center relative"
                                >
                                  <div className={`mx-2 rounded-lg py-2 px-1 ${
                                    !disponivel ? 'bg-red-50 border border-red-100' : 
                                    aula ? 'bg-green-50 border border-green-100' : 
                                    'bg-blue-50 border border-blue-100'
                                  }`}>
                                    {!disponivel ? (
                                      <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center mb-1">
                                          <XCircle className="w-5 h-5 text-red-500" />
                                        </div>
                                        <span className="text-xs font-medium text-red-700">Indisponível</span>
                                      </div>
                                    ) : aula ? (
                                      <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mb-1">
                                          <Users className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium text-green-700">
                                          Turma {['1A', '2B', '3A'][Math.floor(Math.random() * 3)]}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-700">Disponível</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-700 mb-2">Restrições de Horário</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Segunda-feira - Indisponível no período da manhã (Compromisso pessoal)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Quarta-feira - Indisponível após as 16h (Pós-graduação)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-700 mb-2">Preferências</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Prefere lecionar no período da manhã</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Disponível para aulas extras às sextas-feiras</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => toast.success(`Horário de ${professorSelecionado.nome} atualizado`)}
                  >
                    Editar Horários
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => toast.success(`E-mail enviado para ${professorSelecionado.nome}`)}
                  >
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            ) : (
              // Visualização de todos os professores
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-800">Disponibilidade Geral - Semana Atual</h4>
                  <div className="flex gap-3 items-center text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
                      <span>Disponível</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                      <span>Indisponível</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
                      <span>Em aula</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-hidden rounded-xl shadow-md bg-white">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-left font-medium border-b border-indigo-100">Professor</th>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Segunda</th>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Terça</th>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quarta</th>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quinta</th>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Sexta</th>
                        <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProfessores.map((prof, idx) => (
                        <tr key={prof.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 border-r border-indigo-50">
                            <div 
                              className="flex items-center gap-3 cursor-pointer hover:text-indigo-700"
                              onClick={() => abrirPerfilProfessor(prof.id)}
                            >
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {prof.nome.charAt(0)}
                              </div>
                              <span className="hover:font-semibold transition-all">{prof.nome}</span>
                            </div>
                          </td>
                          {['seg', 'ter', 'qua', 'qui', 'sex'].map((dia, i) => {
                            // Simulando dados de disponibilidade semanal
                            const disponibilidade = ['disponível', 'indisponível', 'aula'][Math.floor(Math.random() * 3)];
                            return (
                              <td 
                                key={i} 
                                className="py-3 text-center"
                              >
                                <div className={`mx-2 rounded-lg py-1.5 ${
                                  disponibilidade === 'disponível' ? 'bg-green-50 border border-green-100' : 
                                  disponibilidade === 'indisponível' ? 'bg-red-50 border border-red-100' : 
                                  'bg-blue-50 border border-blue-100'
                                }`}>
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                      disponibilidade === 'disponível' ? 'bg-green-400' : 
                                      disponibilidade === 'indisponível' ? 'bg-red-400' : 
                                      'bg-blue-400'
                                    }`}></div>
                                    <span className={`text-xs font-medium ${
                                      disponibilidade === 'disponível' ? 'text-green-700' : 
                                      disponibilidade === 'indisponível' ? 'text-red-700' : 
                                      'text-blue-700'
                                    }`}>
                                      {disponibilidade === 'disponível' ? 'Disponível' : 
                                       disponibilidade === 'indisponível' ? 'Indisponível' : 
                                       'Em aula'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setProfessorSelecionado(prof)}
                              className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => toast.success("Planilha de horários exportada")}
                  >
                    <FileText className="w-4 h-4" /> Exportar Planilha
                  </Button>
                  
                  <Button 
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => toast.success("Enviando solicitação de atualização de disponibilidade para todos os professores")}
                  >
                    <MessageCircle className="w-4 h-4" /> Solicitar Atualização
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Modal de Ações (Acompanhar, Mensagem, Lembrete) */}
      {modalAcao && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]">
          <motion.div 
            initial={{ scale: 0.95, y: 30 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 30 }} 
            transition={{ type: "spring", stiffness: 120 }} 
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                {modalAcao.tipo === 'acompanhar' && <Users className="w-6 h-6" />}
                {modalAcao.tipo === 'mensagem' && <MessageCircle className="w-6 h-6" />}
                {modalAcao.tipo === 'lembrete' && <AlertTriangle className="w-6 h-6" />}
                {modalAcao.titulo}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fecharModalAcao}
                className="rounded-full h-8 w-8 p-0"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Destinatário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2" 
                  value={modalAcao.professor || 'Todos os professores'} 
                  disabled 
                />
              </div>
              
              {/* Assunto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2" 
                  value={modalAcao.assunto || (
                    modalAcao.tipo === 'acompanhar' 
                      ? 'Acompanhamento pedagógico' 
                      : modalAcao.tipo === 'mensagem' 
                        ? 'Comunicação pedagógica' 
                        : 'Lembrete sobre pendências'
                  )} 
                />
              </div>
              
              {/* Mensagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea 
                  className="w-full border rounded-lg px-3 py-2 min-h-[150px]" 
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>
              
              {/* Opções adicionais */}
              {modalAcao.tipo === 'acompanhar' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agendar para</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2" min={new Date().toISOString().split('T')[0]} />
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={fecharModalAcao}>Cancelar</Button>
                <Button 
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={enviarAcao}
                >
                  <Send className="w-4 h-4" />
                  {modalAcao.tipo === 'acompanhar' ? 'Agendar' : 'Enviar'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Perfil Detalhado do Professor */}
      {professorPerfil && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[55]">
          <motion.div 
            initial={{ scale: 0.95, y: 30 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 30 }} 
            transition={{ type: "spring", stiffness: 120 }} 
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <User className="w-6 h-6" /> 
                Perfil do Professor
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fecharPerfilProfessor}
                className="rounded-full h-8 w-8 p-0"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Cabeçalho do perfil */}
              <div className="flex items-center gap-6 border-b pb-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-700">
                  {professorPerfil.nome.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold">{professorPerfil.nome}</h4>
                  <p className="text-lg text-gray-600">{professorPerfil.disciplina}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      professorPerfil.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {professorPerfil.status}
                    </span>
                    
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {professorPerfil.tempoExperiencia} de experiência
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => abrirModalAcao('mensagem', 'Enviar Mensagem', professorPerfil.nome, undefined, 'perfil')}
                  >
                    <MessageCircle className="w-4 h-4" /> Mensagem
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => abrirModalAcao('acompanhar', 'Acompanhamento Pedagógico', professorPerfil.nome, undefined, 'perfil')}
                  >
                    <Users className="w-4 h-4" /> Acompanhar
                  </Button>
                </div>
              </div>
              
              {/* Informações de contato e detalhes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-lg font-semibold text-indigo-700 mb-4">Informações de Contato</h5>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Mail className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">E-mail</div>
                        <div className="font-medium">{professorPerfil.email}</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Phone className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Telefone</div>
                        <div className="font-medium">{professorPerfil.telefone}</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Data de Contratação</div>
                        <div className="font-medium">{professorPerfil.dataContratacao}</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-indigo-700 mb-4">Formação Acadêmica</h5>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Formação Principal</div>
                        <div className="font-medium">{professorPerfil.formacao}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Bookmark className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Especialização</div>
                        <div className="font-medium">{professorPerfil.especializacao}</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Turmas e habilidades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h5 className="text-lg font-semibold text-indigo-700 mb-4">Turmas Atribuídas</h5>
                  <div className="flex flex-wrap gap-2">
                    {professorPerfil.turmas.map(turma => (
                      <div 
                        key={turma} 
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" /> {turma}
                      </div>
                    ))}
                  </div>
                  
                  <h5 className="text-lg font-semibold text-indigo-700 mb-4 mt-6">Desempenho</h5>
                  {/* Definindo um valor padrão para evitar erros de tipo */}
                  {(() => {
                    const avaliacao = typeof professorPerfil.avaliacaoDesempenho === 'number' ? professorPerfil.avaliacaoDesempenho : 0;
                    return (
                      <>
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium">Avaliação Geral</span>
                          <span className={`font-bold ${
                            avaliacao >= 9 ? 'text-green-600' : 
                            avaliacao >= 7 ? 'text-blue-600' : 
                            'text-amber-600'
                          }`}>
                            {avaliacao.toFixed(1)}/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className={`h-2 rounded-full ${
                              avaliacao >= 9 ? 'bg-green-600' : 
                              avaliacao >= 7 ? 'bg-blue-600' : 
                              'bg-amber-600'
                            }`} 
                            style={{ width: `${(avaliacao/10) * 100}%` }}
                          ></div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-indigo-700 mb-4">Habilidades e Competências</h5>
                  <div className="flex flex-wrap gap-2">
                    {professorPerfil.habilidades?.map((habilidade, idx) => (
                      <div 
                        key={idx} 
                        className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium"
                      >
                        {habilidade}
                      </div>
                    ))}
                  </div>
                  
                  <h5 className="text-lg font-semibold text-indigo-700 mb-4 mt-6">Biografia</h5>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {professorPerfil.biografia}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => verHorariosDoPerfilProfessor()}
                >
                  <Calendar className="w-4 h-4" /> Ver Horários
                </Button>
                <Button 
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => toast.success(`Relatório de desempenho gerado para ${professorPerfil.nome}`)}
                >
                  <FileText className="w-4 h-4" /> Gerar Relatório
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Tabela de professores com design aprimorado */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-indigo-700 border-b border-indigo-100">
                <th className="py-3 px-4">Professor</th>
                <th className="py-3 px-4">Disciplina</th>
                <th className="py-3 px-4">Turmas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockProfessores.map((prof, index) => (
                <tr 
                  key={prof.id} 
                  className={`border-b last:border-b-0 hover:bg-indigo-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4 font-medium">
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:text-indigo-700"
                      onClick={() => abrirPerfilProfessor(prof.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {prof.nome.charAt(0)}
                      </div>
                      <span className="hover:font-semibold transition-all">{prof.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{prof.disciplina}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {prof.turmas.map(turma => (
                        <span 
                          key={turma} 
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                        >
                          {turma}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prof.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prof.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800"
                      onClick={() => abrirModalAcao('acompanhar', 'Acompanhamento Pedagógico', prof.nome)}
                    >
                      Acompanhar
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-indigo-200 hover:bg-indigo-50"
                      onClick={() => setProfessorSelecionado(prof)}
                    >
                      Horários
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => abrirModalAcao('mensagem', 'Enviar Mensagem', prof.nome)}
                    >
                      Mensagem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Cards de estatísticas e eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de pendências */}
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" /> Pendências dos Professores
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="bg-red-100 p-1.5 rounded-full mr-3 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Notas não lançadas (3)</p>
                <p className="text-xs text-gray-600">Prazo final: 15/06/2024</p>
                <button 
                  className="text-xs text-indigo-600 font-medium mt-1 hover:text-indigo-800"
                  onClick={() => abrirModalAcao('lembrete', 'Enviar Lembrete', undefined, 'notas não lançadas')}
                >
                  Enviar lembrete →
                </button>
              </div>
            </li>
            <li className="flex items-start p-3 rounded-lg bg-amber-50 border border-amber-100">
              <div className="bg-amber-100 p-1.5 rounded-full mr-3 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Relatórios a entregar (2)</p>
                <p className="text-xs text-gray-600">Conselho de classe: 10/06/2024</p>
                <button 
                  className="text-xs text-indigo-600 font-medium mt-1 hover:text-indigo-800"
                  onClick={() => abrirModalAcao('lembrete', 'Enviar Lembrete', undefined, 'relatórios pendentes')}
                >
                  Enviar lembrete →
                </button>
              </div>
            </li>
            <li className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="bg-blue-100 p-1.5 rounded-full mr-3 mt-0.5">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Planos de aula (5)</p>
                <p className="text-xs text-gray-600">Próximo semestre</p>
                <button 
                  className="text-xs text-indigo-600 font-medium mt-1 hover:text-indigo-800"
                  onClick={() => abrirModalAcao('lembrete', 'Enviar Lembrete', undefined, 'planos de aula')}
                >
                  Enviar lembrete →
                </button>
              </div>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => abrirModalAcao('mensagem', 'Notificar Todos os Professores')}
            >
              Notificar Todos
            </Button>
          </div>
        </motion.div>
        
        {/* Card de eventos acadêmicos */}
        <motion.div 
          custom={1} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" /> Próximos Eventos Acadêmicos
          </h3>
          <ul className="space-y-3">
            {mockEventosAcademicos.slice(0, 3).map((evento, idx) => (
              <li key={idx} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-indigo-800">{evento.titulo}</div>
                    <div className="text-xs text-indigo-600 mt-1">{evento.data.split('-').reverse().join('/')}</div>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                    onClick={() => abrirModalAcao('mensagem', 'Notificar Sobre Evento', undefined, evento.titulo)}
                  >
                    Ver detalhes →
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => abrirModalAcao('mensagem', 'Calendário Acadêmico', undefined, 'Eventos acadêmicos')}
            >
              Ver Calendário Completo
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 