import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  FileText, 
  Plus,
  MessageCircle,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Tag,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";

// Interface para as props do componente
interface EventosAcademicosDashboardProps {
  mockEventosAcademicos: Array<{
    id: number;
    titulo: string;
    data: string;
    tipo: string;
    descricao?: string;
    responsavel?: string;
    participantes?: string[];
    status?: string;
    local?: string;
    horario?: string;
  }>;
  cardVariants: any;
}

/**
 * Componente de Eventos Acadêmicos para o Dashboard do Coordenador
 * 
 * Este componente gerencia a visualização e interação com eventos acadêmicos,
 * permitindo adicionar, editar e gerenciar eventos do calendário escolar.
 */
export default function EventosAcademicosDashboard({
  mockEventosAcademicos,
  cardVariants
}: EventosAcademicosDashboardProps) {
  // Estado para o modal de criação/edição de evento
  const [modalEvento, setModalEvento] = useState<{
    id?: number;
    titulo: string;
    data: string;
    tipo: string;
    descricao: string;
    responsavel: string;
    local: string;
    horario: string;
    isNew?: boolean;
  } | null>(null);
  
  // Estado para o modal de detalhes do evento
  const [eventoDetalhe, setEventoDetalhe] = useState<number | null>(null);
  
  // Estado para o modal de notificação
  const [modalNotificacao, setModalNotificacao] = useState<{
    eventoId: number;
    titulo: string;
  } | null>(null);
  
  // Estado para filtros de eventos
  const [filtroTipo, setFiltroTipo] = useState("");
  const [buscarEvento, setBuscarEvento] = useState("");
  
  // Função para abrir o modal de criação de evento
  const abrirModalNovoEvento = () => {
    setModalEvento({
      titulo: "",
      data: new Date().toISOString().split('T')[0],
      tipo: "Reunião",
      descricao: "",
      responsavel: "",
      local: "",
      horario: "14:00",
      isNew: true
    });
  };
  
  // Função para abrir o modal de edição de evento
  const abrirModalEditarEvento = (eventoId: number) => {
    const evento = mockEventosAcademicos.find(e => e.id === eventoId);
    if (!evento) return;
    
    setModalEvento({
      id: evento.id,
      titulo: evento.titulo,
      data: evento.data,
      tipo: evento.tipo,
      descricao: evento.descricao || "",
      responsavel: evento.responsavel || "",
      local: evento.local || "",
      horario: evento.horario || "14:00"
    });
  };
  
  // Função para fechar o modal de evento
  const fecharModalEvento = () => {
    setModalEvento(null);
  };
  
  // Função para salvar evento
  const salvarEvento = () => {
    if (!modalEvento) return;
    
    if (modalEvento.isNew) {
      toast.success(`Evento "${modalEvento.titulo}" criado com sucesso!`);
    } else {
      toast.success(`Evento "${modalEvento.titulo}" atualizado com sucesso!`);
    }
    
    fecharModalEvento();
  };
  
  // Função para abrir modal de detalhes do evento
  const abrirDetalheEvento = (eventoId: number) => {
    setEventoDetalhe(eventoId);
  };
  
  // Função para fechar modal de detalhes do evento
  const fecharDetalheEvento = () => {
    setEventoDetalhe(null);
  };
  
  // Função para abrir modal de notificação
  const abrirModalNotificacao = (eventoId: number) => {
    const evento = mockEventosAcademicos.find(e => e.id === eventoId);
    if (!evento) return;
    
    setModalNotificacao({
      eventoId: eventoId,
      titulo: evento.titulo
    });
  };
  
  // Função para fechar modal de notificação
  const fecharModalNotificacao = () => {
    setModalNotificacao(null);
  };
  
  // Função para enviar notificação
  const enviarNotificacao = () => {
    if (!modalNotificacao) return;
    
    toast.success(`Notificações enviadas para o evento: ${modalNotificacao.titulo}`);
    fecharModalNotificacao();
  };
  
  // Filtrar eventos com base na busca e no tipo
  const eventosFiltrados = mockEventosAcademicos.filter(evento => {
    const matchTipo = !filtroTipo || evento.tipo === filtroTipo;
    const matchBusca = !buscarEvento || 
                      evento.titulo.toLowerCase().includes(buscarEvento.toLowerCase()) ||
                      (evento.descricao && evento.descricao.toLowerCase().includes(buscarEvento.toLowerCase()));
    return matchTipo && matchBusca;
  });

  // Tipos de eventos disponíveis (obtidos dos dados existentes)
  const tiposEventos = Array.from(new Set(mockEventosAcademicos.map(e => e.tipo)));

  return (
    <motion.div
      key="eventos"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-700">Eventos Acadêmicos</h2>
        <Button className="flex gap-2" onClick={abrirModalNovoEvento}>
          <Plus className="w-5 h-5" /> Adicionar Evento
        </Button>
      </div>
      
      {/* Filtros de eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Busca de eventos */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar evento por título ou descrição..."
              className="border rounded-lg pl-10 pr-4 py-2 w-full"
              value={buscarEvento}
              onChange={(e) => setBuscarEvento(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filtrar por tipo */}
        <div className="col-span-1 bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <Tag className="w-4 h-4 mr-1" /> Filtrar por tipo
            </span>
            <select
              className="border rounded-lg px-3 py-1.5 text-sm"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              {tiposEventos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabela de eventos */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-indigo-700 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Eventos Planejados
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-indigo-100">
                <th className="py-3 px-4 text-indigo-700">Evento</th>
                <th className="py-3 px-4 text-indigo-700">Data</th>
                <th className="py-3 px-4 text-indigo-700">Tipo</th>
                <th className="py-3 px-4 text-indigo-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.length > 0 ? (
                eventosFiltrados.map(evento => (
                  <tr key={evento.id} className="border-b last:border-b-0 hover:bg-indigo-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-indigo-900">{evento.titulo}</div>
                      {evento.descricao && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{evento.descricao}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-indigo-400 mr-2" />
                        <span>{format(parseISO(evento.data), "dd/MM/yyyy")}</span>
                      </div>
                      {evento.horario && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                          <span>{evento.horario}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        evento.tipo === 'Reunião' ? 'bg-blue-100 text-blue-800' : 
                        evento.tipo === 'Avaliação' ? 'bg-purple-100 text-purple-800' : 
                        evento.tipo === 'Acadêmico' ? 'bg-green-100 text-green-800' : 
                        evento.tipo === 'Entrega' ? 'bg-amber-100 text-amber-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {evento.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                          title="Ver detalhes"
                          onClick={() => abrirDetalheEvento(evento.id)}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          title="Enviar notificação"
                          onClick={() => abrirModalNotificacao(evento.id)}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                          title="Editar evento"
                          onClick={() => abrirModalEditarEvento(evento.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    Nenhum evento encontrado com os filtros atuais
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Grid de calendário e próximos eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" /> Calendário Acadêmico
          </h3>
          <div className="bg-indigo-50 rounded-lg p-4 text-center mb-4">
            <h4 className="font-medium text-indigo-800">Junho 2024</h4>
            <p className="text-sm text-indigo-600">Mês atual</p>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-indigo-700 mb-1">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const hasEvent = mockEventosAcademicos.some(e => 
                parseInt(e.data.split('-')[2]) === day && 
                parseInt(e.data.split('-')[1]) === 6
              );
              return (
                <div 
                  key={day} 
                  className={`rounded-lg p-1 h-10 flex items-center justify-center border ${
                    hasEvent ? 'bg-indigo-100 border-indigo-300 font-medium text-indigo-800 hover:bg-indigo-200 cursor-pointer' : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                  onClick={() => hasEvent && toast.success(`Visualizando eventos do dia ${day}/06/2024`)}
                >
                  <div className="relative">
                    {day}
                    {hasEvent && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              className="w-full"
              onClick={() => toast.success("Planejamento anual aberto")}
            >
              Ver Planejamento Anual
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
            <FileText className="h-5 w-5 text-indigo-600" /> Próximos Eventos
          </h3>
          <div className="space-y-4">
            {mockEventosAcademicos
              .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
              .slice(0, 4)
              .map(evento => (
                <div 
                  key={evento.id} 
                  className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all"
                  onClick={() => abrirDetalheEvento(evento.id)}
                >
                  <div className={`p-2 rounded-lg mr-3 flex-shrink-0 ${
                    evento.tipo === 'Reunião' ? 'bg-blue-100' : 
                    evento.tipo === 'Avaliação' ? 'bg-purple-100' : 
                    evento.tipo === 'Acadêmico' ? 'bg-green-100' : 
                    evento.tipo === 'Entrega' ? 'bg-amber-100' :
                    'bg-indigo-100'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      evento.tipo === 'Reunião' ? 'text-blue-600' : 
                      evento.tipo === 'Avaliação' ? 'text-purple-600' : 
                      evento.tipo === 'Acadêmico' ? 'text-green-600' : 
                      evento.tipo === 'Entrega' ? 'text-amber-600' :
                      'text-indigo-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{evento.titulo}</h4>
                    <div className="text-sm text-gray-500 mt-0.5 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {format(parseISO(evento.data), "dd/MM/yyyy")}
                      {evento.horario && (
                        <>
                          <span className="mx-1">•</span> 
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {evento.horario}
                        </>
                      )}
                    </div>
                    {evento.responsavel && (
                      <div className="text-sm text-gray-500 mt-0.5 flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {evento.responsavel}
                      </div>
                    )}
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    evento.tipo === 'Reunião' ? 'bg-blue-100 text-blue-800' : 
                    evento.tipo === 'Avaliação' ? 'bg-purple-100 text-purple-800' : 
                    evento.tipo === 'Acadêmico' ? 'bg-green-100 text-green-800' : 
                    evento.tipo === 'Entrega' ? 'bg-amber-100 text-amber-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {evento.tipo}
                  </span>
                </div>
              ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <Button 
              variant="outline"
              onClick={() => toast.success("Filtrando eventos por período")}
              className="flex gap-2 items-center"
            >
              <Calendar className="w-4 h-4" /> Filtrar por Período
            </Button>
            <Button 
              onClick={abrirModalNovoEvento}
              className="flex gap-2 items-center"
            >
              <Plus className="w-4 h-4" /> Adicionar Evento
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Modais */}
      
      {/* Modal de criação/edição de evento */}
      {modalEvento && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                <Calendar className="w-5 h-5 mr-2" /> 
                {modalEvento.isNew ? "Novo Evento" : "Editar Evento"}
              </h3>
              <button onClick={fecharModalEvento} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Evento
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Digite o título do evento..."
                  value={modalEvento.titulo}
                  onChange={(e) => setModalEvento({...modalEvento, titulo: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={modalEvento.data}
                    onChange={(e) => setModalEvento({...modalEvento, data: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={modalEvento.horario}
                    onChange={(e) => setModalEvento({...modalEvento, horario: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evento
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={modalEvento.tipo}
                  onChange={(e) => setModalEvento({...modalEvento, tipo: e.target.value})}
                >
                  <option value="Reunião">Reunião</option>
                  <option value="Avaliação">Avaliação</option>
                  <option value="Acadêmico">Acadêmico</option>
                  <option value="Entrega">Entrega</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Digite o local do evento..."
                  value={modalEvento.local}
                  onChange={(e) => setModalEvento({...modalEvento, local: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Digite o nome do responsável..."
                  value={modalEvento.responsavel}
                  onChange={(e) => setModalEvento({...modalEvento, responsavel: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
                  placeholder="Digite uma descrição detalhada do evento..."
                  value={modalEvento.descricao}
                  onChange={(e) => setModalEvento({...modalEvento, descricao: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={fecharModalEvento}>
                  Cancelar
                </Button>
                <Button onClick={salvarEvento}>
                  {modalEvento.isNew ? "Criar Evento" : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Modal de detalhes do evento */}
      {eventoDetalhe !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {(() => {
              const evento = mockEventosAcademicos.find(e => e.id === eventoDetalhe);
              if (!evento) return null;
              
              return (
                <>
                  <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" /> 
                      Detalhes do Evento
                    </h3>
                    <button onClick={fecharDetalheEvento} className="text-gray-500 hover:text-gray-700">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{evento.titulo}</h2>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        evento.tipo === 'Reunião' ? 'bg-blue-100 text-blue-800' : 
                        evento.tipo === 'Avaliação' ? 'bg-purple-100 text-purple-800' : 
                        evento.tipo === 'Acadêmico' ? 'bg-green-100 text-green-800' : 
                        evento.tipo === 'Entrega' ? 'bg-amber-100 text-amber-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {evento.tipo}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-indigo-600 uppercase font-medium mb-2">Data e Hora</div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                          <span className="font-medium">{format(parseISO(evento.data), "dd/MM/yyyy")}</span>
                        </div>
                        {evento.horario && (
                          <div className="flex items-center text-gray-700 mt-2">
                            <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                            <span className="font-medium">{evento.horario}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-indigo-600 uppercase font-medium mb-2">Local</div>
                        <div className="text-gray-700 font-medium">
                          {evento.local || "A definir"}
                        </div>
                      </div>
                    </div>
                    
                    {evento.descricao && (
                      <div className="mb-6">
                        <div className="text-sm text-indigo-600 uppercase font-medium mb-2">Descrição</div>
                        <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {evento.descricao}
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <div className="text-sm text-indigo-600 uppercase font-medium mb-2">Responsável</div>
                      <div className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 mr-2 text-indigo-500" />
                        <span className="font-medium">{evento.responsavel || "A definir"}</span>
                      </div>
                    </div>
                    
                    {evento.participantes && (
                      <div className="mb-6">
                        <div className="text-sm text-indigo-600 uppercase font-medium mb-2">Participantes</div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {evento.participantes.map((participante, idx) => (
                              <span 
                                key={idx} 
                                className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                              >
                                {participante}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between gap-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          fecharDetalheEvento();
                          abrirModalEditarEvento(evento.id);
                        }}
                        className="flex gap-2 items-center"
                      >
                        <Plus className="w-4 h-4" /> Editar Evento
                      </Button>
                      <Button 
                        onClick={() => {
                          fecharDetalheEvento();
                          abrirModalNotificacao(evento.id);
                        }}
                        className="flex gap-2 items-center"
                      >
                        <MessageCircle className="w-4 h-4" /> Enviar Notificação
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
      
      {/* Modal de notificação */}
      {modalNotificacao && (
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
                <MessageCircle className="w-5 h-5 mr-2" /> Enviar Notificação
              </h3>
              <button onClick={fecharModalNotificacao} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evento
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  value={modalNotificacao.titulo}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinatários
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Professores envolvidos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Alunos e responsáveis</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Equipe administrativa</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
                  placeholder="Digite a mensagem da notificação..."
                  defaultValue={`Prezados,\n\nGostaríamos de lembrar sobre o evento "${modalNotificacao.titulo}" que ocorrerá em breve.\n\nAtenciosamente,\nCoordenação Pedagógica`}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canais de envio
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Aplicativo</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">SMS</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={fecharModalNotificacao}>
                  Cancelar
                </Button>
                <Button onClick={enviarNotificacao}>
                  Enviar Notificação
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 