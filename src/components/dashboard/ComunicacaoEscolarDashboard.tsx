import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Users, 
  User,
  Upload, 
  Download, 
  Clock, 
  FileText,
  Search,
  Filter,
  Send,
  Calendar,
  Bell,
  XCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

// Interface para as props do componente
interface ComunicacaoEscolarDashboardProps {
  cardVariants: any;
}

/**
 * Componente de Comunicação Escolar para o Dashboard do Coordenador
 * 
 * Este componente gerencia a comunicação com professores, responsáveis e direção
 */
export default function ComunicacaoEscolarDashboard({
  cardVariants
}: ComunicacaoEscolarDashboardProps) {
  // Estado para os destinatários selecionados
  const [destinatarios, setDestinatarios] = useState({
    todosProfessores: false,
    professores1Ano: false,
    professores2Ano: false,
    professores3Ano: false,
    todosResponsaveis: false,
    responsaveis1Ano: false,
    responsaveis2Ano: false,
    responsaveis3Ano: false,
    diretoria: false,
    secretaria: false
  });
  
  // Estado para o formulário de mensagem
  const [mensagem, setMensagem] = useState({
    assunto: "",
    conteudo: "",
    anexos: [] as File[],
    prioridade: "normal"
  });

  // Estado para modal de visualização de mensagem
  const [modalVisualizarMensagem, setModalVisualizarMensagem] = useState<{
    isOpen: boolean;
    mensagem: any;
  }>({
    isOpen: false,
    mensagem: null
  });
  
  // Estado para modal de nova mensagem
  const [modalNovaMensagem, setModalNovaMensagem] = useState(false);
  
  // Estado para modal de confirmação
  const [modalConfirmacao, setModalConfirmacao] = useState<{
    isOpen: boolean;
    tipo: string;
    mensagemId?: number;
    titulo: string;
    descricao: string;
  }>({
    isOpen: false,
    tipo: "",
    mensagemId: undefined,
    titulo: "",
    descricao: ""
  });

  // Função para alternar seleção de destinatários
  const toggleDestinatario = (key: keyof typeof destinatarios) => {
    setDestinatarios(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Função para atualizar campos do formulário
  const handleInputChange = (campo: keyof typeof mensagem, valor: string) => {
    setMensagem(prev => ({
      ...prev,
      [campo]: valor
    }));
  };
  
  // Função para lidar com arquivos selecionados
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setMensagem(prev => ({
        ...prev,
        anexos: [...prev.anexos, ...fileList]
      }));
    }
  };
  
  // Função para remover anexo
  const removerAnexo = (index: number) => {
    setMensagem(prev => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index)
    }));
  };
  
  // Função para enviar mensagem
  const enviarMensagem = () => {
    // Aqui você implementaria a lógica para enviar a mensagem
    toast.success("Mensagem enviada com sucesso!");
    
    // Resetar formulário
    setMensagem({
      assunto: "",
      conteudo: "",
      anexos: [],
      prioridade: "normal"
    });
    
    // Fechar modal se estiver aberto
    setModalNovaMensagem(false);
  };

  // Mock de mensagens para o histórico
  const mockMensagens = [
    { id: 1, data: "05/06/2024 14:30", assunto: "Reunião Pedagógica", destinatarios: "Professores", status: "Enviada", leituras: 18, prioridade: "Alta" },
    { id: 2, data: "02/06/2024 09:15", assunto: "Resultados do Bimestre", destinatarios: "Professores, Direção", status: "Enviada", leituras: 24, prioridade: "Normal" },
    { id: 3, data: "01/06/2024 16:45", assunto: "Evento Cultural", destinatarios: "Todos", status: "Enviada", leituras: 156, prioridade: "Normal" },
    { id: 4, data: "28/05/2024 11:20", assunto: "Orientações para Avaliações", destinatarios: "Professores", status: "Enviada", leituras: 20, prioridade: "Alta" },
    { id: 5, data: "25/05/2024 10:05", assunto: "Cronograma de Reuniões", destinatarios: "Professores, Direção", status: "Enviada", leituras: 22, prioridade: "Normal" },
    { id: 6, data: "22/05/2024 15:40", assunto: "Comunicado Importante", destinatarios: "Todos", status: "Enviada", leituras: 145, prioridade: "Urgente" },
  ];
  
  // Função para abrir modal de visualização de mensagem
  const visualizarMensagem = (mensagem: any) => {
    setModalVisualizarMensagem({
      isOpen: true,
      mensagem
    });
  };
  
  // Função para abrir modal de confirmação
  const abrirConfirmacao = (tipo: string, mensagemId?: number) => {
    let titulo = "";
    let descricao = "";
    
    if (tipo === "excluir") {
      titulo = "Excluir Mensagem";
      descricao = "Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.";
    } else if (tipo === "reenviar") {
      titulo = "Reenviar Mensagem";
      descricao = "Deseja reenviar esta mensagem para os mesmos destinatários?";
    }
    
    setModalConfirmacao({
      isOpen: true,
      tipo,
      mensagemId,
      titulo,
      descricao
    });
  };
  
  // Função para confirmar ação
  const confirmarAcao = () => {
    const { tipo, mensagemId } = modalConfirmacao;
    
    if (tipo === "excluir") {
      // Lógica para excluir mensagem
      toast.success(`Mensagem #${mensagemId} excluída com sucesso`);
    } else if (tipo === "reenviar") {
      // Lógica para reenviar mensagem
      toast.success(`Mensagem #${mensagemId} reenviada com sucesso`);
    }
    
    setModalConfirmacao(prev => ({ ...prev, isOpen: false }));
  };
  
  return (
    <motion.div
      key="comunicacao"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Cabeçalho da seção */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Comunicação Escolar</h2>
          <p className="text-gray-500 mt-1">Gerencie todas as comunicações com a comunidade escolar</p>
        </div>
        <Button 
          className="flex gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          onClick={() => setModalNovaMensagem(true)}
        >
          <MessageCircle className="w-5 h-5" /> Nova Mensagem
        </Button>
      </div>
      
      {/* Placeholder para conteúdo principal */}
      <div className="space-y-6">
        {/* Painel de comunicação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Painel de destinatários */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Users className="h-5 w-5 text-indigo-600" /> Destinatários
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="uppercase tracking-wider">Professores</span>
                </div>
                <div className="flex flex-col gap-2 pl-6">
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.todosProfessores}
                      onChange={() => toggleDestinatario('todosProfessores')}
                    /> 
                    Todos os professores
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.professores1Ano}
                      onChange={() => toggleDestinatario('professores1Ano')}
                    /> 
                    Professores do 1º ano
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.professores2Ano}
                      onChange={() => toggleDestinatario('professores2Ano')}
                    /> 
                    Professores do 2º ano
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.professores3Ano}
                      onChange={() => toggleDestinatario('professores3Ano')}
                    /> 
                    Professores do 3º ano
                  </label>
                </div>
              </div>
              
              <div>
                <div className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span className="uppercase tracking-wider">Responsáveis</span>
                </div>
                <div className="flex flex-col gap-2 pl-6">
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.todosResponsaveis}
                      onChange={() => toggleDestinatario('todosResponsaveis')}
                    /> 
                    Todos os responsáveis
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.responsaveis1Ano}
                      onChange={() => toggleDestinatario('responsaveis1Ano')}
                    /> 
                    Responsáveis do 1º ano
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.responsaveis2Ano}
                      onChange={() => toggleDestinatario('responsaveis2Ano')}
                    /> 
                    Responsáveis do 2º ano
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.responsaveis3Ano}
                      onChange={() => toggleDestinatario('responsaveis3Ano')}
                    /> 
                    Responsáveis do 3º ano
                  </label>
                </div>
              </div>
              
              <div>
                <div className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="uppercase tracking-wider">Direção</span>
                </div>
                <div className="flex flex-col gap-2 pl-6">
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.diretoria}
                      onChange={() => toggleDestinatario('diretoria')}
                    /> 
                    Diretor(a)
                  </label>
                  <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                      checked={destinatarios.secretaria}
                      onChange={() => toggleDestinatario('secretaria')}
                    /> 
                    Secretaria
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                  <Bell className="w-4 h-4" />
                  Resumo da seleção
                </h4>
                <p className="text-xs text-gray-600">
                  {Object.values(destinatarios).filter(Boolean).length === 0 ? (
                    "Nenhum destinatário selecionado"
                  ) : (
                    `${Object.values(destinatarios).filter(Boolean).length} grupos selecionados`
                  )}
                </p>
                <div className="mt-2 text-xs flex flex-wrap gap-1">
                  {destinatarios.todosProfessores && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Todos os professores</span>
                  )}
                  {destinatarios.todosResponsaveis && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Todos os responsáveis</span>
                  )}
                  {destinatarios.diretoria && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Diretor(a)</span>
                  )}
                  {/* Outros grupos seriam adicionados aqui */}
                </div>
              </div>
            </div>
          </div>
          
          {/* Composição da mensagem */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2 pb-2 border-b border-gray-100">
              <MessageCircle className="h-5 w-5 text-indigo-600" /> Composição da Mensagem
            </h3>
            
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">Assunto</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 transition-all focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 hover:border-indigo-300" 
                  placeholder="Digite o assunto da mensagem..." 
                  value={mensagem.assunto}
                  onChange={(e) => handleInputChange('assunto', e.target.value)}
                />
              </div>
              
              <div className="group">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600">Conteúdo</label>
                  <div className="flex gap-2">
                    <select 
                      className="text-xs border rounded-md py-1.5 px-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                      value={mensagem.prioridade}
                      onChange={(e) => handleInputChange('prioridade', e.target.value)}
                    >
                      <option value="normal">Prioridade: Normal</option>
                      <option value="alta">Prioridade: Alta</option>
                      <option value="urgente">Prioridade: Urgente</option>
                    </select>
                  </div>
                </div>
                <textarea 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 min-h-[180px] transition-all focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 hover:border-indigo-300" 
                  placeholder="Digite sua mensagem aqui..." 
                  value={mensagem.conteudo}
                  onChange={(e) => handleInputChange('conteudo', e.target.value)}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">Anexos</label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-indigo-50 transition-colors cursor-pointer group">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    multiple
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer flex flex-col items-center justify-center text-gray-500 group-hover:text-indigo-600 transition-colors"
                  >
                    <Upload className="h-10 w-10 mb-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium">Clique para enviar ou arraste arquivos aqui</span>
                    <span className="text-xs mt-1 text-gray-400">PDF, DOC, JPEG, PNG (Máx 10MB)</span>
                  </label>
                </div>
                
                {/* Lista de anexos */}
                {mensagem.anexos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FileText className="h-4 w-4 text-indigo-500" /> 
                      Anexos ({mensagem.anexos.length})
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 rounded-lg border border-gray-100 p-2">
                      {mensagem.anexos.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-indigo-400 mr-2" />
                            <span className="truncate max-w-xs">{file.name}</span>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                            onClick={() => removerAnexo(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4 justify-end">
                <Button 
                  variant="outline"
                  className="border-indigo-200 hover:bg-indigo-50 transition-colors"
                  onClick={() => toast.success("Rascunho salvo")}
                >
                  Salvar Rascunho
                </Button>
                <Button 
                  onClick={enviarMensagem}
                  disabled={!mensagem.assunto || !mensagem.conteudo || Object.values(destinatarios).filter(Boolean).length === 0}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Send className="h-4 w-4" /> Enviar Mensagem
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Histórico de comunicações */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" /> Histórico de Comunicações
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar mensagens..."
                  className="border border-gray-200 rounded-lg pl-9 py-2 pr-3 text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all hover:border-indigo-300"
                />
              </div>
              
              <select className="border border-gray-200 rounded-lg p-2 text-sm w-full md:w-auto focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all hover:border-indigo-300">
                <option value="todos">Todos os tipos</option>
                <option value="enviadas">Enviadas</option>
                <option value="rascunhos">Rascunhos</option>
                <option value="agendadas">Agendadas</option>
              </select>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 border-indigo-200 hover:bg-indigo-50 transition-colors w-full md:w-auto"
                onClick={() => toast.success("Filtros aplicados")}
              >
                <Filter className="h-4 w-4" /> Filtros
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <th className="py-3 px-4 text-indigo-700 font-semibold">Data/Hora</th>
                  <th className="py-3 px-4 text-indigo-700 font-semibold">Assunto</th>
                  <th className="py-3 px-4 text-indigo-700 font-semibold">Destinatários</th>
                  <th className="py-3 px-4 text-indigo-700 font-semibold">Prioridade</th>
                  <th className="py-3 px-4 text-indigo-700 font-semibold">Status</th>
                  <th className="py-3 px-4 text-indigo-700 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockMensagens.map(msg => (
                  <tr key={msg.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600">{msg.data}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{msg.assunto}</td>
                    <td className="py-3 px-4 text-gray-600">{msg.destinatarios}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        msg.prioridade === 'Alta' ? 'bg-amber-100 text-amber-700' : 
                        msg.prioridade === 'Urgente' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {msg.prioridade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {msg.status} • {msg.leituras} leituras
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-1">
                        <button 
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                          onClick={() => visualizarMensagem(msg)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                          onClick={() => abrirConfirmacao("reenviar", msg.id)}
                          title="Reenviar"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          onClick={() => {
                            setMensagem({
                              assunto: `Re: ${msg.assunto}`,
                              conteudo: "",
                              anexos: [],
                              prioridade: "normal"
                            });
                            setModalNovaMensagem(true);
                          }}
                          title="Responder"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          onClick={() => abrirConfirmacao("excluir", msg.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Exibindo {mockMensagens.length} mensagens de {mockMensagens.length} no total
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="text-gray-400 cursor-not-allowed">Anterior</Button>
              <Button variant="outline" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-200">1</Button>
              <Button variant="outline" size="sm" disabled className="text-gray-400 cursor-not-allowed">Próximo</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modais de confirmação e visualização serão adicionados nas próximas etapas */}
      
      {/* Modal de Nova Mensagem */}
      {modalNovaMensagem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Nova Mensagem
              </h3>
              <button 
                onClick={() => setModalNovaMensagem(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Painel de destinatários */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5">
                <h4 className="font-medium text-lg mb-4 text-indigo-700">Destinatários</h4>
                
                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-sm text-indigo-700 mb-2">Professores</div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.todosProfessores}
                          onChange={() => toggleDestinatario('todosProfessores')}
                        /> 
                        Todos os professores
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.professores1Ano}
                          onChange={() => toggleDestinatario('professores1Ano')}
                        /> 
                        Professores do 1º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.professores2Ano}
                          onChange={() => toggleDestinatario('professores2Ano')}
                        /> 
                        Professores do 2º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.professores3Ano}
                          onChange={() => toggleDestinatario('professores3Ano')}
                        /> 
                        Professores do 3º ano
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-sm text-indigo-700 mb-2">Responsáveis</div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.todosResponsaveis}
                          onChange={() => toggleDestinatario('todosResponsaveis')}
                        /> 
                        Todos os responsáveis
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.responsaveis1Ano}
                          onChange={() => toggleDestinatario('responsaveis1Ano')}
                        /> 
                        Responsáveis do 1º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.responsaveis2Ano}
                          onChange={() => toggleDestinatario('responsaveis2Ano')}
                        /> 
                        Responsáveis do 2º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.responsaveis3Ano}
                          onChange={() => toggleDestinatario('responsaveis3Ano')}
                        /> 
                        Responsáveis do 3º ano
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-sm text-indigo-700 mb-2">Direção</div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.diretoria}
                          onChange={() => toggleDestinatario('diretoria')}
                        /> 
                        Diretor(a)
                      </label>
                      <label className="flex items-center gap-2 hover:bg-white/80 p-2 rounded-lg cursor-pointer text-sm transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500" 
                          checked={destinatarios.secretaria}
                          onChange={() => toggleDestinatario('secretaria')}
                        /> 
                        Secretaria
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Composição da mensagem */}
              <div className="md:col-span-2">
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">Assunto</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all hover:border-indigo-300" 
                      placeholder="Digite o assunto da mensagem..." 
                      value={mensagem.assunto}
                      onChange={(e) => handleInputChange('assunto', e.target.value)}
                    />
                  </div>
                  
                  <div className="group">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600">Conteúdo</label>
                      <div className="flex gap-2">
                        <select 
                          className="text-xs border rounded-md py-1.5 px-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all bg-white"
                          value={mensagem.prioridade}
                          onChange={(e) => handleInputChange('prioridade', e.target.value)}
                        >
                          <option value="normal">Prioridade: Normal</option>
                          <option value="alta">Prioridade: Alta</option>
                          <option value="urgente">Prioridade: Urgente</option>
                        </select>
                      </div>
                    </div>
                    <textarea 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 min-h-[200px] focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all hover:border-indigo-300" 
                      placeholder="Digite sua mensagem aqui..." 
                      value={mensagem.conteudo}
                      onChange={(e) => handleInputChange('conteudo', e.target.value)}
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">Anexos</label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-indigo-50 transition-colors cursor-pointer group">
                      <input 
                        type="file" 
                        className="hidden" 
                        id="modal-file-upload" 
                        multiple
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="modal-file-upload" 
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-500 group-hover:text-indigo-600 transition-colors"
                      >
                        <Upload className="h-10 w-10 mb-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="font-medium">Clique para enviar ou arraste arquivos aqui</span>
                        <span className="text-xs mt-1 text-gray-400">PDF, DOC, JPEG, PNG (Máx 10MB)</span>
                      </label>
                    </div>
                    
                    {/* Lista de anexos */}
                    {mensagem.anexos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FileText className="h-4 w-4 text-indigo-500" /> 
                          Anexos ({mensagem.anexos.length})
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 rounded-lg border border-gray-100 p-2">
                          {mensagem.anexos.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-indigo-400 mr-2" />
                                <span className="truncate max-w-xs">{file.name}</span>
                              </div>
                              <button 
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                onClick={() => removerAnexo(index)}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-4 justify-between items-center">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700 bg-indigo-50 px-3 py-2 rounded-lg">
                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                          Agendar envio
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="border-gray-200 hover:bg-gray-50 transition-colors"
                        onClick={() => setModalNovaMensagem(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={enviarMensagem}
                        disabled={!mensagem.assunto || !mensagem.conteudo || Object.values(destinatarios).filter(Boolean).length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        <Send className="h-4 w-4" /> Enviar Mensagem
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Visualização de Mensagem */}
      {modalVisualizarMensagem.isOpen && modalVisualizarMensagem.mensagem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Detalhes da Mensagem
              </h3>
              <button 
                onClick={() => setModalVisualizarMensagem({ isOpen: false, mensagem: null })}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Data</div>
                    <div className="font-medium text-indigo-700">{modalVisualizarMensagem.mensagem.data}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium flex items-center gap-1 text-green-700">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> {modalVisualizarMensagem.mensagem.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Prioridade</div>
                    <div className="font-medium">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                        modalVisualizarMensagem.mensagem.prioridade === 'Alta' ? 'bg-amber-100 text-amber-700' : 
                        modalVisualizarMensagem.mensagem.prioridade === 'Urgente' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {modalVisualizarMensagem.mensagem.prioridade}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Leituras</div>
                    <div className="font-medium text-blue-600">{modalVisualizarMensagem.mensagem.leituras}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2 text-gray-800">{modalVisualizarMensagem.mensagem.assunto}</h4>
                <div className="text-sm text-gray-600 mb-3">
                  Para: <span className="font-medium text-indigo-700">{modalVisualizarMensagem.mensagem.destinatarios}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-gray-700 min-h-[150px] leading-relaxed">
                  <p>Esta é uma mensagem de exemplo para {modalVisualizarMensagem.mensagem.destinatarios}.</p>
                  <p className="mt-4">Foi enviada em {modalVisualizarMensagem.mensagem.data} com prioridade {modalVisualizarMensagem.mensagem.prioridade.toLowerCase()}.</p>
                  <p className="mt-4">Atenciosamente,<br />Coordenação Pedagógica</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-indigo-700">
                  <FileText className="h-4 w-4" /> Anexos
                </h4>
                <div className="flex gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm flex items-center group hover:bg-gray-100 transition-colors cursor-pointer">
                    <FileText className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>documento_exemplo.pdf</span>
                    <button className="ml-2 text-indigo-500 hover:text-indigo-700 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-indigo-700">
                  <Eye className="h-4 w-4" /> Histórico de leituras
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm max-h-40 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <div className="font-medium">João Silva (Professor - Matemática)</div>
                      <div className="text-xs text-indigo-600">Lida em 05/06/2024 15:20</div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <div className="font-medium">Ana Santos (Professora - Português)</div>
                      <div className="text-xs text-indigo-600">Lida em 05/06/2024 14:45</div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <div className="font-medium">Ricardo Ferreira (Professor - História)</div>
                      <div className="text-xs text-indigo-600">Lida em 05/06/2024 16:30</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                    onClick={() => abrirConfirmacao("reenviar", modalVisualizarMensagem.mensagem.id)}
                  >
                    <Send className="h-4 w-4" /> Reenviar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setMensagem({
                        assunto: `Re: ${modalVisualizarMensagem.mensagem.assunto}`,
                        conteudo: "",
                        anexos: [],
                        prioridade: "normal"
                      });
                      setModalVisualizarMensagem({ isOpen: false, mensagem: null });
                      setModalNovaMensagem(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4" /> Responder
                  </Button>
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                  onClick={() => {
                    setModalVisualizarMensagem({ isOpen: false, mensagem: null });
                  }}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Confirmação */}
      {modalConfirmacao.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-xl font-bold text-indigo-700">
                {modalConfirmacao.titulo}
              </h3>
              <button 
                onClick={() => setModalConfirmacao(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-center">{modalConfirmacao.descricao}</p>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  className="min-w-[100px] border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => setModalConfirmacao(prev => ({ ...prev, isOpen: false }))}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmarAcao}
                  className={`min-w-[100px] ${
                    modalConfirmacao.tipo === 'excluir' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                  } shadow-md hover:shadow-lg transition-all`}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
} 