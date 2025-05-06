import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Calendar, 
  CalendarDays, 
  PlusCircle, 
  Trash2, 
  Clock,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Tag,
  Edit
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos de eventos disponíveis
const TIPO_EVENTO = ["Reunião", "Prova", "Comemorativo", "Entrega", "Outro"];

// Dados mockados para desenvolvimento
// Serão substituídos por chamadas à API no backend
const mockEventos = [
  { id: 1, titulo: "Reunião Pedagógica", data: "2024-06-10", tipo: "Reunião", descricao: "Reunião com todos os professores para discutir o planejamento do semestre." },
  { id: 2, titulo: "Prova de Matemática", data: "2024-06-14", tipo: "Prova", descricao: "Avaliação bimestral de matemática para turmas do 9º ano." },
  { id: 3, titulo: "Festa Junina", data: "2024-06-21", tipo: "Comemorativo", descricao: "Celebração junina com apresentações dos alunos e comidas típicas." },
  { id: 4, titulo: "Entrega de Boletins", data: "2024-06-28", tipo: "Entrega", descricao: "Entrega de boletins e reunião com os pais dos alunos." },
  { id: 5, titulo: "Passeio ao Museu", data: "2024-07-05", tipo: "Outro", descricao: "Visita ao museu de ciências com as turmas do 6º ano." },
  { id: 6, titulo: "Formatura 9º Ano", data: "2024-07-15", tipo: "Comemorativo", descricao: "Cerimônia de formatura para os alunos do 9º ano." },
  { id: 7, titulo: "Capacitação Professores", data: "2024-07-20", tipo: "Reunião", descricao: "Treinamento sobre novas tecnologias educacionais." },
];

// Cores para os diferentes tipos de eventos
const CORES_TIPO: Record<string, { bg: string; text: string; border: string }> = {
  "Reunião": { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
  "Prova": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  "Comemorativo": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  "Entrega": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  "Outro": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" }
};

/**
 * Componente de Gestão de Eventos
 * 
 * Este componente permite visualizar, adicionar, editar e excluir eventos
 * do calendário escolar, com uma visualização mensal e filtros por tipo.
 */
export default function GestaoEventos() {
  // Estados do componente
  const [eventos, setEventos] = useState(mockEventos);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [showAddEvento, setShowAddEvento] = useState(false);
  const [showEditEvento, setShowEditEvento] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [eventoSelecionado, setEventoSelecionado] = useState<null | typeof mockEventos[0]>(null);
  const [novoEvento, setNovoEvento] = useState({ 
    titulo: "", 
    data: format(new Date(), "yyyy-MM-dd"), 
    tipo: "Reunião",
    descricao: ""
  });

  // Filtra os eventos do mês atual
  const eventosMes = eventos.filter(e => 
    isSameMonth(parseISO(e.data), mesAtual) && 
    (filtroTipo === "Todos" || e.tipo === filtroTipo)
  );

  // Contagem de eventos por tipo
  const contagemPorTipo = {
    "Todos": eventos.length,
    "Reunião": eventos.filter(e => e.tipo === "Reunião").length,
    "Prova": eventos.filter(e => e.tipo === "Prova").length,
    "Comemorativo": eventos.filter(e => e.tipo === "Comemorativo").length,
    "Entrega": eventos.filter(e => e.tipo === "Entrega").length,
    "Outro": eventos.filter(e => e.tipo === "Outro").length
  };

  /**
   * Função para adicionar um novo evento
   * @param e Evento do formulário
   */
  function handleAddEvento(e: React.FormEvent) {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!novoEvento.titulo || !novoEvento.data) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    
    // Adiciona o novo evento com ID gerado
    const newEvento = {
      ...novoEvento,
      id: Date.now()
    };
    
    setEventos([...eventos, newEvento]);
    setShowAddEvento(false);
    
    // Reset do formulário
    setNovoEvento({ 
      titulo: "", 
      data: format(new Date(), "yyyy-MM-dd"), 
      tipo: "Reunião",
      descricao: ""
    });
    
    toast.success("Evento adicionado com sucesso!");
  }

  /**
   * Função para abrir o modal de edição de evento
   * @param evento Evento a ser editado
   */
  function handleEditEvento(evento: typeof mockEventos[0]) {
    setEventoSelecionado(evento);
    setShowEditEvento(true);
  }

  /**
   * Função para salvar a edição de um evento
   * @param e Evento do formulário
   */
  function handleSaveEditEvento(e: React.FormEvent) {
    e.preventDefault();
    
    if (eventoSelecionado) {
      // Atualiza o evento no array
      setEventos(eventos.map(ev => 
        ev.id === eventoSelecionado.id ? eventoSelecionado : ev
      ));
      
      setShowEditEvento(false);
      setEventoSelecionado(null);
      toast.success("Evento atualizado com sucesso!");
    }
  }

  /**
   * Função para remover um evento
   * @param id ID do evento a ser removido
   */
  function handleRemoveEvento(id: number) {
    setEventos(eventos.filter(e => e.id !== id));
    toast.success("Evento removido com sucesso!");
  }

  // Adicionar listener para eventos disparados do Dashboard
  useEffect(() => {
    const handleDashboardAction = (event: CustomEvent) => {
      console.log("GestaoEventos: Evento recebido:", event.detail);
      const { section, action } = event.detail || {};
      if (section === 'eventos' && action === 'add-evento') {
        console.log("GestaoEventos: Abrindo modal de adicionar evento");
        // Abrir o modal de adicionar evento
        setShowAddEvento(true);
      }
    };

    // Adicionar evento
    console.log("GestaoEventos: Adicionando event listener para dashboard-action");
    document.addEventListener('dashboard-action', handleDashboardAction as EventListener);
    
    // Remover evento ao desmontar componente
    return () => {
      console.log("GestaoEventos: Removendo event listener para dashboard-action");
      document.removeEventListener('dashboard-action', handleDashboardAction as EventListener);
    };
  }, []);

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-indigo-600" />
              Gestão de Eventos e Calendário Escolar
            </h2>
            <p className="text-gray-600">Planeje e organize eventos, reuniões e atividades da instituição.</p>
          </div>
          
          <Button 
            className="flex gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            onClick={() => setShowAddEvento(true)}
            data-action="add-evento"
            id="btn-add-evento"
            data-testid="add-evento-button"
          >
            <PlusCircle className="w-5 h-5" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Card de total de eventos */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Calendar className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Eventos</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Todos}</p>
          </div>
        </motion.div>

        {/* Card de reuniões */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-100 rounded-lg">
            <CalendarClock className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Reuniões</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Reunião}</p>
          </div>
        </motion.div>

        {/* Card de provas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-red-100 rounded-lg">
            <CalendarCheck className="w-6 h-6 text-red-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Provas</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Prova}</p>
          </div>
        </motion.div>

        {/* Card de eventos comemorativos */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <CalendarDays className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Comemorativos</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Comemorativo}</p>
          </div>
        </motion.div>
      </div>

      {/* Painel principal: calendário e eventos */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Barra de filtros */}
        <div className="border-b border-gray-100 p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos os tipos</option>
              {TIPO_EVENTO.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            
            <span className="text-sm text-gray-500">
              {eventosMes.length} evento{eventosMes.length !== 1 ? 's' : ''} em {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMesAtual(subMonths(mesAtual, 1))}
            >
              Mês Anterior
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMesAtual(new Date())}
            >
              Hoje
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMesAtual(addMonths(mesAtual, 1))}
            >
              Próximo Mês
            </Button>
          </div>
        </div>

        {/* Conteúdo principal: calendário e lista de eventos */}
        <div className="p-6 flex flex-col md:flex-row gap-8">
          {/* Calendário visual */}
          <div className="w-full md:w-3/5">
            <div className="text-xl font-bold text-indigo-700 mb-3 flex items-center justify-between">
              <span>{format(mesAtual, "MMMM yyyy", { locale: ptBR })}</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-indigo-700 mb-1">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>
            
            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const start = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 0 });
                const end = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 0 });
                const days = [];
                let day = start;
                while (day <= end) {
                  const isCurrentMonth = isSameMonth(day, mesAtual);
                  const isToday = isSameDay(day, new Date());
                  const eventosDia = eventos.filter(e => isSameDay(parseISO(e.data), day));
                  const hasEvento = eventosDia.length > 0;
                  
                  days.push(
                    <div 
                      key={day.toString()} 
                      className={`relative rounded-lg p-1 min-h-12 flex flex-col items-center justify-start border 
                        ${isCurrentMonth ? 'bg-indigo-50' : 'bg-gray-50'} 
                        ${isToday ? 'border-indigo-400 ring-1 ring-indigo-300' : 'border-gray-200'} 
                        ${hasEvento ? 'hover:bg-indigo-100 transition-colors' : ''}
                        ${hasEvento && filtroTipo !== "Todos" && !eventosDia.some(e => e.tipo === filtroTipo) ? 'opacity-50' : ''}
                      `}
                    > 
                      <span className={`text-sm font-medium ${isCurrentMonth ? 'text-indigo-900' : 'text-gray-400'} ${isToday ? 'bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                        {format(day, "d")}
                      </span>
                      
                      {/* Indicadores de eventos */}
                      {hasEvento && (
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {eventosDia.slice(0, 3).map(ev => (
                            <div 
                              key={ev.id} 
                              className={`w-2 h-2 rounded-full ${CORES_TIPO[ev.tipo].bg} ${CORES_TIPO[ev.tipo].border}`}
                              title={ev.titulo}
                            />
                          ))}
                          {eventosDia.length > 3 && (
                            <span className="text-xs text-indigo-500">+{eventosDia.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                  
                  day = addDays(day, 1);
                }
                return days;
              })()}
            </div>
            
            {/* Legenda de tipos de eventos */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {TIPO_EVENTO.map(tipo => (
                <div 
                  key={tipo} 
                  className={`flex items-center gap-1 ${CORES_TIPO[tipo].text} px-2 py-1 rounded-full ${CORES_TIPO[tipo].bg} ${CORES_TIPO[tipo].border} ${filtroTipo !== "Todos" && filtroTipo !== tipo ? 'opacity-50' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full ${CORES_TIPO[tipo].bg}`} />
                  <span>{tipo}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Lista de eventos do mês */}
          <div className="w-full md:w-2/5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <span>Eventos {filtroTipo !== "Todos" ? `(${filtroTipo})` : ""}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2">
              {eventosMes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Nenhum evento encontrado.</p>
                  <p className="text-sm">
                    {filtroTipo !== "Todos" 
                      ? `Não há eventos do tipo "${filtroTipo}" neste mês.` 
                      : "Clique no botão 'Novo Evento' para adicionar."}
                  </p>
                </div>
              ) : (
                eventosMes.map(ev => (
                  <motion.div 
                    key={ev.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-col rounded-lg p-3 ${CORES_TIPO[ev.tipo].bg} ${CORES_TIPO[ev.tipo].border} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">{ev.titulo}</div>
                        <div className="text-sm text-gray-600 mb-1">
                          {format(parseISO(ev.data), "dd/MM/yyyy")} • {ev.tipo}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 items-center">
                        <button 
                          onClick={() => handleEditEvento(ev)}
                          className={`p-1 rounded-lg hover:${CORES_TIPO[ev.tipo].bg}`}
                          title="Editar evento"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <button 
                          onClick={() => handleRemoveEvento(ev.id)}
                          className="p-1 rounded-lg hover:bg-red-100"
                          title="Remover evento"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {ev.descricao && (
                      <p className="text-sm text-gray-700 mt-1">{ev.descricao}</p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modais */}
      <AnimatePresence>
        {/* Modal para adicionar evento */}
        {showAddEvento && (
          <motion.div 
            key="modal-add-evento" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 30 }} 
              className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Adicionar Novo Evento
              </h3>

              {/* Formulário de adição de evento */}
              <form onSubmit={handleAddEvento} className="flex flex-col gap-4">
                {/* Campo de título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento*</label>
                  <input 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder="Ex: Reunião Pedagógica" 
                    required 
                    value={novoEvento.titulo} 
                    onChange={e => setNovoEvento({ ...novoEvento, titulo: e.target.value })} 
                  />
                </div>

                {/* Campo de data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data*</label>
                  <input 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    type="date"
                    required 
                    value={novoEvento.data} 
                    onChange={e => setNovoEvento({ ...novoEvento, data: e.target.value })} 
                  />
                </div>

                {/* Campo de tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    value={novoEvento.tipo} 
                    onChange={e => setNovoEvento({ ...novoEvento, tipo: e.target.value })}
                  >
                    {TIPO_EVENTO.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {/* Campo de descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full min-h-[80px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder="Detalhes sobre o evento..." 
                    value={novoEvento.descricao} 
                    onChange={e => setNovoEvento({ ...novoEvento, descricao: e.target.value })} 
                  />
                </div>

                {/* Botões de ação do modal */}
                <div className="flex gap-2 justify-end mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddEvento(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Adicionar Evento
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Modal para editar evento */}
        {showEditEvento && eventoSelecionado && (
          <motion.div 
            key="modal-edit-evento" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 30 }} 
              className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
                <Edit className="w-6 h-6 text-indigo-600" />
                Editar Evento
              </h3>

              {/* Formulário de edição de evento */}
              <form onSubmit={handleSaveEditEvento} className="flex flex-col gap-4">
                {/* Campo de título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento*</label>
                  <input 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder="Ex: Reunião Pedagógica" 
                    required 
                    value={eventoSelecionado.titulo} 
                    onChange={e => setEventoSelecionado({...eventoSelecionado, titulo: e.target.value})} 
                  />
                </div>

                {/* Campo de data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data*</label>
                  <input 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    type="date"
                    required 
                    value={eventoSelecionado.data} 
                    onChange={e => setEventoSelecionado({...eventoSelecionado, data: e.target.value})} 
                  />
                </div>

                {/* Campo de tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    value={eventoSelecionado.tipo} 
                    onChange={e => setEventoSelecionado({...eventoSelecionado, tipo: e.target.value})}
                  >
                    {TIPO_EVENTO.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {/* Campo de descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full min-h-[80px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                    placeholder="Detalhes sobre o evento..." 
                    value={eventoSelecionado.descricao} 
                    onChange={e => setEventoSelecionado({...eventoSelecionado, descricao: e.target.value})} 
                  />
                </div>

                {/* Botões de ação do modal */}
                <div className="flex gap-2 justify-end mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowEditEvento(false);
                      setEventoSelecionado(null);
                    }}
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
      </AnimatePresence>
    </div>
  );
} 