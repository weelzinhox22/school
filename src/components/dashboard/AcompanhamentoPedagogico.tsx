import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Users, Calendar, FileText, TrendingUp, 
  AlertTriangle, Plus, CheckCircle2, Clock, Eye, MessageCircle, Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// Interface para as props do modal
interface ModalAcaoProps {
  isOpen: boolean;
  onClose: () => void;
  tipoAcao: string;
  destino: string;
}

// Componente do Modal de Ação - Implementação melhorada
const ModalAcao: React.FC<ModalAcaoProps> = ({ isOpen, onClose, tipoAcao, destino }) => {
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [data, setData] = useState("");
  const [prioridade, setPrioridade] = useState("normal");
  const [anexos, setAnexos] = useState<File[]>([]);

  // Resetar formulário ao abrir
  useEffect(() => {
    if (isOpen) {
      setAssunto("");
      setMensagem("");
      setData("");
      setPrioridade("normal");
    }
  }, [isOpen]);

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagemSucesso = tipoAcao === "revisar" ? "Revisão enviada" : 
                   tipoAcao === "feedback" ? "Feedback enviado" : 
                   tipoAcao === "relatorio" ? "Relatório visualizado" : 
                   tipoAcao === "agendar" ? "Observação agendada" : 
                   tipoAcao === "plano" ? "Plano criado" : 
                   tipoAcao === "detalhes" ? "Detalhes visualizados" :
                   tipoAcao === "gerenciar" ? "Projeto atualizado" :
                   tipoAcao === "projeto" ? "Projeto criado" : "Ação realizada";
    
    toast.success(`${mensagemSucesso} para ${destino} com sucesso!`);
    onClose();
  };

  if (!isOpen) return null;

  // Determinar título e botão com base no tipo de ação
  const getTitulo = () => {
    switch (tipoAcao) {
      case "revisar": return "Revisar Plano";
      case "feedback": return "Enviar Feedback";
      case "relatorio": return "Visualizar Relatório";
      case "agendar": return "Agendar Observação";
      case "plano": return "Criar Plano";
      case "detalhes": return "Detalhes do Projeto";
      case "gerenciar": return "Gerenciar Projeto";
      case "projeto": return "Novo Projeto";
      default: return "Realizar Ação";
    }
  };

  const getBotaoTexto = () => {
    switch (tipoAcao) {
      case "revisar": return "Enviar Revisão";
      case "feedback": return "Enviar Feedback";
      case "relatorio": return "Fechar";
      case "agendar": return "Agendar";
      case "plano": return "Criar";
      case "detalhes": return "Fechar";
      case "gerenciar": return "Salvar Alterações";
      case "projeto": return "Criar Projeto";
      default: return "Enviar";
    }
  };

  // Determinar a largura do modal com base no tipo
  const getModalWidth = () => {
    switch (tipoAcao) {
      case "detalhes": 
      case "gerenciar": 
      case "projeto": return "max-w-3xl";
      case "relatorio": return "max-w-2xl";
      default: return "max-w-lg";
    }
  };

  // Determinar altura máxima do conteúdo do modal
  const getContentHeight = () => {
    switch (tipoAcao) {
      case "detalhes":
      case "relatorio": return "max-h-[60vh] overflow-y-auto pr-2";
      case "revisar":
      case "plano":
      case "gerenciar":
      case "projeto": return "max-h-[550px] overflow-y-auto pr-2";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`bg-white rounded-xl p-6 w-full ${getModalWidth()} shadow-2xl border border-indigo-100`}
        style={{ 
          maxHeight: '80vh',
          minWidth: tipoAcao === "detalhes" || tipoAcao === "gerenciar" || tipoAcao === "projeto" ? '750px' : 
                   tipoAcao === "revisar" || tipoAcao === "relatorio" ? '650px' : '500px',
          width: tipoAcao === "detalhes" || tipoAcao === "gerenciar" || tipoAcao === "projeto" ? '750px' : 
                tipoAcao === "revisar" || tipoAcao === "relatorio" ? '650px' : '500px',
          overflowY: 'auto'
        }}
      >
        <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center sticky top-0 bg-white py-2 z-10">
          {tipoAcao === "detalhes" && <Eye className="mr-2 h-5 w-5" />}
          {tipoAcao === "relatorio" && <FileText className="mr-2 h-5 w-5" />}
          {tipoAcao === "feedback" && <MessageCircle className="mr-2 h-5 w-5" />}
          {tipoAcao === "agendar" && <Calendar className="mr-2 h-5 w-5" />}
          {tipoAcao === "plano" && <BookOpen className="mr-2 h-5 w-5" />}
          {tipoAcao === "revisar" && <CheckCircle2 className="mr-2 h-5 w-5" />}
          {tipoAcao === "gerenciar" && <Settings className="mr-2 h-5 w-5" />}
          {tipoAcao === "projeto" && <Plus className="mr-2 h-5 w-5" />}
          {getTitulo()}
        </h3>
        
        <div className={getContentHeight()}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {tipoAcao === "detalhes" || tipoAcao === "gerenciar" || tipoAcao === "projeto" ? "Projeto" : 
                tipoAcao === "revisar" ? "Plano" : "Destinatário"}
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md bg-gray-50" 
                value={destino} 
                disabled 
              />
            </div>
            
            {/* Campos específicos para revisão de planos */}
            {tipoAcao === "revisar" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Status da Revisão</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="aprovado"
                    required
                  >
                    <option value="aprovado">Aprovado</option>
                    <option value="ajustes">Necessita Ajustes</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Professor</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    value={destino.replace("Plano de ", "")}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Disciplina</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    value={destino.includes("João") ? "Matemática" : 
                           destino.includes("Ana") ? "Português" :
                           destino.includes("Carlos") ? "História" :
                           destino.includes("Mariana") ? "Geografia" : "Ciências"}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Turma</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      value={destino.includes("João") ? "1A" : 
                             destino.includes("Ana") ? "1A" :
                             destino.includes("Carlos") ? "2A" :
                             destino.includes("Mariana") ? "2B" : "3A"}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data Limite</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      value={destino.includes("João") ? "15/06/2024" : 
                             destino.includes("Ana") ? "10/06/2024" :
                             destino.includes("Carlos") ? "12/06/2024" :
                             destino.includes("Mariana") ? "18/06/2024" : "08/06/2024"}
                      disabled
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Assunto para maioria das ações, exceto visualizações */}
            {tipoAcao !== "relatorio" && tipoAcao !== "detalhes" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {tipoAcao === "plano" || tipoAcao === "projeto" ? "Título" : "Assunto"}
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={assunto} 
                  onChange={(e) => setAssunto(e.target.value)} 
                  placeholder={tipoAcao === "plano" || tipoAcao === "projeto" ? "Digite o título..." : "Digite o assunto..."} 
                  required 
                />
              </div>
            )}
            
            {/* Data para agendamentos e planos */}
            {(tipoAcao === "agendar" || tipoAcao === "plano" || tipoAcao === "projeto") && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {tipoAcao === "agendar" ? "Data da Observação" : "Data Limite"}
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={data} 
                  onChange={(e) => setData(e.target.value)} 
                  required 
                />
              </div>
            )}
            
            {/* Hora para agendamentos */}
            {tipoAcao === "agendar" && (
              <div>
                <label className="block text-sm font-medium mb-1">Horário</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border rounded-md" 
                  required 
                />
              </div>
            )}
            
            {/* Campos para projetos */}
            {(tipoAcao === "projeto" || tipoAcao === "gerenciar") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Disciplinas</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md" 
                    multiple 
                    size={4}
                    required
                  >
                    <option value="matematica">Matemática</option>
                    <option value="portugues">Português</option>
                    <option value="historia">História</option>
                    <option value="geografia">Geografia</option>
                    <option value="ciencias">Ciências</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Turmas</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md" 
                    multiple 
                    size={4}
                    required
                  >
                    <option value="1A">1A</option>
                    <option value="1B">1B</option>
                    <option value="2A">2A</option>
                    <option value="2B">2B</option>
                    <option value="3A">3A</option>
                    <option value="3B">3B</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Conteúdo específico para detalhes do projeto */}
            {tipoAcao === "detalhes" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Coordenador</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md bg-gray-50" 
                    value={destino.replace("Projeto ", "") === "Feira de Ciências" ? "Roberto Santos" : 
                           destino.replace("Projeto ", "") === "Clube de Leitura" ? "Ana Lima" :
                           destino.replace("Projeto ", "") === "Olimpíada de Matemática" ? "João Souza" :
                           "Mariana Costa"}
                    disabled 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md bg-gray-50" 
                    value={destino.replace("Projeto ", "") === "Feira de Ciências" ? "Em andamento" : 
                           destino.replace("Projeto ", "") === "Clube de Leitura" ? "Planejamento" :
                           destino.replace("Projeto ", "") === "Olimpíada de Matemática" ? "Em andamento" :
                           "Concluído"}
                    disabled 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Disciplinas</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md bg-gray-50" 
                    value={destino.replace("Projeto ", "") === "Feira de Ciências" ? "Ciências, Matemática" : 
                           destino.replace("Projeto ", "") === "Clube de Leitura" ? "Português, História" :
                           destino.replace("Projeto ", "") === "Olimpíada de Matemática" ? "Matemática" :
                           "Geografia, Ciências"}
                    disabled 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Turmas</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md bg-gray-50" 
                    value={destino.replace("Projeto ", "") === "Feira de Ciências" ? "1A, 1B, 2A" : 
                           destino.replace("Projeto ", "") === "Clube de Leitura" ? "2A, 2B, 3A" :
                           destino.replace("Projeto ", "") === "Olimpíada de Matemática" ? "1A, 1B, 2A, 2B, 3A, 3B" :
                           "3A, 3B"}
                    disabled 
                  />
                </div>
                <div className="col-span-2 mt-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Descrição</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md h-[80px] bg-gray-50" 
                    value={destino.replace("Projeto ", "") === "Feira de Ciências" ? "Projeto interdisciplinar que relaciona conteúdos de Ciências e Matemática. Os alunos apresentarão experimentos científicos em estandes na feira escolar." : 
                           destino.replace("Projeto ", "") === "Clube de Leitura" ? "Projeto que visa incentivar a leitura integrando conhecimentos de Literatura e História. Os alunos lerão e discutirão obras relacionadas a diferentes períodos históricos." :
                           destino.replace("Projeto ", "") === "Olimpíada de Matemática" ? "Preparação dos alunos para competições nacionais de matemática, com aulas extras e resolução de problemas desafiadores." :
                           "Projeto sobre sustentabilidade e meio ambiente, integrando Geografia e Ciências. Os alunos realizaram pesquisas e ações práticas sobre preservação ambiental."}
                    disabled 
                  />
                </div>
              </div>
            )}
            
            {/* Prioridade para alguns tipos de ações */}
            {(tipoAcao === "feedback" || tipoAcao === "plano") && (
              <div>
                <label className="block text-sm font-medium mb-1">Prioridade</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                >
                  <option value="baixa">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            )}
            
            {/* Mensagem/observações para a maioria das ações */}
            {tipoAcao !== "detalhes" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {tipoAcao === "relatorio" ? "Observações" : 
                   tipoAcao === "revisar" ? "Comentários" : 
                   tipoAcao === "plano" || tipoAcao === "projeto" ? "Descrição" : "Mensagem"}
                </label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]" 
                  value={mensagem} 
                  onChange={(e) => setMensagem(e.target.value)} 
                  placeholder={`Digite ${tipoAcao === "relatorio" ? "suas observações" : 
                                tipoAcao === "revisar" ? "seus comentários" :
                                tipoAcao === "plano" || tipoAcao === "projeto" ? "a descrição" : "sua mensagem"}...`} 
                  required={tipoAcao !== "relatorio"} 
                />
              </div>
            )}
            
            {/* Anexos para alguns tipos de ações */}
            {(tipoAcao === "feedback" || tipoAcao === "plano" || tipoAcao === "projeto") && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Anexos (opcional)</label>
                <input 
                  type="file" 
                  className="w-full px-3 py-2 border rounded-md" 
                  multiple
                />
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose} className="hover:bg-indigo-50">
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600">
                {getBotaoTexto()}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Interface para as props do componente
interface AcompanhamentoPedagogicoProps {
  cardVariants: any;
}

// Componente principal
const AcompanhamentoPedagogico: React.FC<AcompanhamentoPedagogicoProps> = ({ cardVariants }) => {
  // Estado para controlar o modal
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoAcao, setTipoAcao] = useState("");
  const [destinoAcao, setDestinoAcao] = useState("");

  // Função para abrir o modal
  const abrirModal = (tipo: string, destino: string) => {
    setTipoAcao(tipo);
    setDestinoAcao(destino);
    setModalAberto(true);
  };

  // Dados mock para o componente
  const planosAula = [
    { id: 1, professor: "João Souza", disciplina: "Matemática", turma: "1A", status: "Pendente", dataLimite: "15/06/2024" },
    { id: 2, professor: "Ana Lima", disciplina: "Português", turma: "1A", status: "Aprovado", dataLimite: "10/06/2024" },
    { id: 3, professor: "Carlos Oliveira", disciplina: "História", turma: "2A", status: "Em revisão", dataLimite: "12/06/2024" },
    { id: 4, professor: "Mariana Costa", disciplina: "Geografia", turma: "2B", status: "Pendente", dataLimite: "18/06/2024" },
    { id: 5, professor: "Roberto Santos", disciplina: "Ciências", turma: "3A", status: "Aprovado", dataLimite: "08/06/2024" },
  ];

  const observacoesAula = [
    { professor: "João Souza", turma: "1A", disciplina: "Matemática", data: "05/06/2024", status: "Realizada" },
    { professor: "Ana Lima", turma: "1B", disciplina: "Português", data: "08/06/2024", status: "Agendada" },
    { professor: "Carlos Oliveira", turma: "2A", disciplina: "História", data: "02/06/2024", status: "Realizada" },
    { professor: "Mariana Costa", turma: "2B", disciplina: "Geografia", data: "10/06/2024", status: "Agendada" },
  ];

  const desenvolvimentoDocente = [
    { professor: "João Souza", tipo: "Capacitação", titulo: "Matemática para ENEM", status: "Em progresso", progresso: 60 },
    { professor: "Ana Lima", tipo: "Projeto", titulo: "Oficinas de escrita criativa", status: "Concluído", progresso: 100 },
    { professor: "Carlos Oliveira", tipo: "Capacitação", titulo: "História Contemporânea", status: "Não iniciado", progresso: 0 },
    { professor: "Mariana Costa", tipo: "Projeto", titulo: "Mapeamento geográfico", status: "Em progresso", progresso: 40 },
  ];

  const projetosInterdisciplinares = [
    { nome: "Feira de Ciências", coordenador: "Roberto Santos", disciplinas: ["Ciências", "Matemática"], turmas: ["1A", "1B", "2A"], status: "Em andamento" },
    { nome: "Clube de Leitura", coordenador: "Ana Lima", disciplinas: ["Português", "História"], turmas: ["2A", "2B", "3A"], status: "Planejamento" },
    { nome: "Olimpíada de Matemática", coordenador: "João Souza", disciplinas: ["Matemática"], turmas: ["1A", "1B", "2A", "2B", "3A", "3B"], status: "Em andamento" },
    { nome: "Projeto Sustentabilidade", coordenador: "Mariana Costa", disciplinas: ["Geografia", "Ciências"], turmas: ["3A", "3B"], status: "Concluído" },
  ];

  return (
    <motion.div
      key="acompanhamento"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-indigo-700">Acompanhamento Pedagógico</h2>
        <div className="flex gap-2">
          <Button 
            className="flex gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600" 
            onClick={() => toast.success("Planejamento pedagógico exportado")}
          >
            <FileText className="w-5 h-5" /> Exportar Planejamento
          </Button>
        </div>
      </div>
      
      {/* Planejamento pedagógico */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl shadow-lg p-6 border border-indigo-100">
        <h3 className="text-lg font-medium text-indigo-700 mb-4">Planejamento de Aulas e Projetos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-indigo-50 text-indigo-700 border-b">
                  <th className="py-3 px-2 rounded-tl-lg">Professor</th>
                  <th className="py-3 px-2">Disciplina</th>
                  <th className="py-3 px-2">Turma</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Data Limite</th>
                  <th className="py-3 px-2 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {planosAula.map((plano, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50 transition-colors">
                    <td className="py-3 px-2 font-medium">{plano.professor}</td>
                    <td className="py-3 px-2">{plano.disciplina}</td>
                    <td className="py-3 px-2">{plano.turma}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        plano.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 
                        plano.status === 'Em revisão' ? 'bg-blue-100 text-blue-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {plano.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">{plano.dataLimite}</td>
                    <td className="py-3 px-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-indigo-100 hover:text-indigo-700 flex items-center gap-1"
                        onClick={() => abrirModal("revisar", `Plano de ${plano.professor}`)}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Revisar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 shadow-inner">
            <h4 className="font-medium text-indigo-800 mb-3">Próximos passos</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 bg-white/70 p-3 rounded-lg shadow-sm">
                <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">5 planos pendentes de revisão</p>
                  <p className="text-xs text-gray-500">Prazo final: 20/06/2024</p>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-white/70 p-3 rounded-lg shadow-sm">
                <div className="bg-blue-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Planejar reunião pedagógica</p>
                  <p className="text-xs text-gray-500">Data: 15/06/2024</p>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-white/70 p-3 rounded-lg shadow-sm">
                <div className="bg-green-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Feedback sobre projetos</p>
                  <p className="text-xs text-gray-500">Para: Equipe de professores</p>
                </div>
              </li>
            </ul>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
              onClick={() => abrirModal("plano", "Novo Plano de Acompanhamento")}
            >
              Novo Plano
            </Button>
          </div>
        </div>
      </div>
      
      {/* Observações de aula e Desenvolvimento Docente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow-lg p-6 border border-indigo-100"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" /> Observações de Aula
          </h3>
          <div className="overflow-y-auto max-h-80">
            <ul className="space-y-3">
              {observacoesAula.map((obs, idx) => (
                <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{obs.professor}</span> - {obs.disciplina}
                      <div className="text-xs text-gray-500">Turma {obs.turma} • {obs.data}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs self-start ${
                      obs.status === 'Realizada' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {obs.status}
                    </span>
                  </div>
                  {obs.status === 'Realizada' && (
                    <div className="mt-2 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs hover:bg-blue-100 hover:text-blue-700 flex items-center"
                        onClick={() => abrirModal("relatorio", `Relatório de ${obs.professor}`)}
                      >
                        <FileText className="h-3 w-3 mr-1" /> Ver Relatório
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-xs bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 flex items-center"
                        onClick={() => abrirModal("feedback", obs.professor)}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" /> Enviar Feedback
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
              onClick={() => abrirModal("agendar", "Nova Observação de Aula")}
            >
              Agendar Nova Observação
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          custom={1} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow-lg p-6 border border-indigo-100"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" /> Desenvolvimento Docente
          </h3>
          <div className="overflow-y-auto max-h-80">
            <ul className="space-y-3">
              {desenvolvimentoDocente.map((dev, idx) => (
                <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{dev.professor}</span>
                      <div className="text-xs text-gray-500">{dev.tipo}: {dev.titulo}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs self-start ${
                      dev.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                      dev.status === 'Em progresso' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {dev.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        dev.status === 'Concluído' ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                        dev.status === 'Em progresso' ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 
                        'bg-gradient-to-r from-amber-500 to-amber-400'
                      }`}
                      style={{ width: `${dev.progresso}%` }}
                    />
                  </div>
                  <div className="text-xs text-right text-gray-500">{dev.progresso}% concluído</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
              onClick={() => abrirModal("plano", "Plano de Desenvolvimento Docente")}
            >
              Novo Plano de Desenvolvimento
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Projetos interdisciplinares */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" /> Projetos Interdisciplinares
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-indigo-700 border-b">
                <th className="py-3 px-4 rounded-tl-lg font-semibold">Projeto</th>
                <th className="py-3 px-4 font-semibold">Coordenador</th>
                <th className="py-3 px-4 font-semibold">Disciplinas</th>
                <th className="py-3 px-4 font-semibold">Turmas</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 rounded-tr-lg font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {projetosInterdisciplinares.map((projeto, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50 transition-colors">
                  <td className="py-3 px-4 font-medium">{projeto.nome}</td>
                  <td className="py-3 px-4">{projeto.coordenador}</td>
                  <td className="py-3 px-4">{projeto.disciplinas.join(", ")}</td>
                  <td className="py-3 px-4">{projeto.turmas.join(", ")}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs inline-block min-w-[90px] text-center ${
                      projeto.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                      projeto.status === 'Em andamento' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {projeto.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-blue-100 hover:text-blue-700 whitespace-nowrap"
                        onClick={() => abrirModal("detalhes", `Projeto ${projeto.nome}`)}
                      >
                        Detalhes
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 whitespace-nowrap"
                        onClick={() => abrirModal("gerenciar", `Projeto ${projeto.nome}`)}
                      >
                        Gerenciar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <Button 
            className="flex gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
            onClick={() => abrirModal("projeto", "Novo Projeto Interdisciplinar")}
          >
            <Plus className="w-5 h-5" /> Novo Projeto
          </Button>
        </div>
      </div>

      {/* Modal */}
      <ModalAcao 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        tipoAcao={tipoAcao} 
        destino={destinoAcao} 
      />
    </motion.div>
  );
};

export default AcompanhamentoPedagogico; 