import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CalendarDays, 
  Plus, 
  Trash2, 
  FileText,
  Tag,
  Filter,
  SortAsc,
  Edit
} from "lucide-react";
import { format, addDays, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

// Tipos de dados
export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  prazo: string; // formato: YYYY-MM-DD
  prioridade: "baixa" | "media" | "alta";
  categoria: string;
  concluida: boolean;
  criadoEm: string; // formato: YYYY-MM-DD
}

// Propriedades do componente
interface TodoProps {
  // Modo do componente: 'simples' mostra apenas a lista, 'completo' mostra filtros e outras opções
  modo?: "simples" | "completo";
  categorias?: string[];
  // Callback chamado quando uma tarefa é alterada
  onTaskChange?: (tasks: Task[]) => void;
  // Tarefas iniciais (se não fornecidas, usará o mock)
  tarefasIniciais?: Task[];
  // Altura máxima da lista (para uso dentro de cards)
  alturaMaxima?: string;
}

// Cores para prioridades
const CORES_PRIORIDADE = {
  baixa: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  media: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  alta: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" }
};

// Categorias padrão para tarefas escolares
const CATEGORIAS_PADRAO = [
  "Administrativo",
  "Pedagógico",
  "Reunião",
  "Planejamento",
  "Avaliação",
  "Alunos"
];

// Tarefas mockadas para desenvolvimento
const TAREFAS_MOCK: Task[] = [
  {
    id: 1,
    titulo: "Preparar materiais para reunião pedagógica",
    descricao: "Organizar apresentação e documentos para a reunião mensal",
    prazo: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Reunião",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 2,
    titulo: "Revisar resultados de avaliação",
    descricao: "Analisar desempenho dos alunos na última avaliação bimestral",
    prazo: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Avaliação",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 3,
    titulo: "Organizar treinamento para Olimpíada",
    descricao: "Preparar material extra para alunos participantes da olimpíada de matemática",
    prazo: format(addDays(new Date(), 14), "yyyy-MM-dd"),
    prioridade: "baixa",
    categoria: "Pedagógico",
    concluida: true,
    criadoEm: format(addDays(new Date(), -5), "yyyy-MM-dd")
  },
  {
    id: 4,
    titulo: "Atualizar plano de aula",
    descricao: "Revisar e atualizar plano de aula do próximo bimestre",
    prazo: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Planejamento",
    concluida: false,
    criadoEm: format(addDays(new Date(), -2), "yyyy-MM-dd")
  }
];

/**
 * Componente Todo
 * 
 * Gerenciador de tarefas para a interface do sistema escolar,
 * permitindo adicionar, editar, excluir e filtrar tarefas com
 * diferentes prioridades, categorias e prazos.
 */
export default function Todo({
  modo = "completo",
  categorias = CATEGORIAS_PADRAO,
  onTaskChange,
  tarefasIniciais,
  alturaMaxima = "350px"
}: TodoProps) {
  // Estados
  const [tarefas, setTarefas] = useState<Task[]>(tarefasIniciais || TAREFAS_MOCK);
  const [showAddTarefa, setShowAddTarefa] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [ordenacao, setOrdenacao] = useState<string>("prazo"); // prazo, prioridade, categoria
  const [tarefaAtual, setTarefaAtual] = useState<Task | null>(null);
  const [novaTarefa, setNovaTarefa] = useState<Omit<Task, "id" | "criadoEm">>({
    titulo: "",
    descricao: "",
    prazo: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: categorias[0],
    concluida: false
  });

  // Notificar o componente pai quando as tarefas mudarem
  useEffect(() => {
    if (onTaskChange) {
      onTaskChange(tarefas);
    }
  }, [tarefas, onTaskChange]);

  // Filtragem e ordenação das tarefas
  const tarefasFiltradas = tarefas
    .filter(tarefa => 
      (filtroCategoria === "" || tarefa.categoria === filtroCategoria) &&
      (filtroPrioridade === "" || tarefa.prioridade === filtroPrioridade) &&
      (filtroStatus === "todas" || 
       (filtroStatus === "pendentes" && !tarefa.concluida) || 
       (filtroStatus === "concluidas" && tarefa.concluida) ||
       (filtroStatus === "atrasadas" && isPast(new Date(tarefa.prazo)) && !tarefa.concluida) ||
       (filtroStatus === "hoje" && isToday(new Date(tarefa.prazo))))
    )
    .sort((a, b) => {
      switch (ordenacao) {
        case "prazo":
          return new Date(a.prazo).getTime() - new Date(b.prazo).getTime();
        case "prioridade":
          const prioridadeOrder = { alta: 0, media: 1, baixa: 2 };
          return prioridadeOrder[a.prioridade] - prioridadeOrder[b.prioridade];
        case "categoria":
          return a.categoria.localeCompare(b.categoria);
        default:
          return 0;
      }
    });

  // Contagem de tarefas por status
  const contagem = {
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
    atrasadas: tarefas.filter(t => isPast(new Date(t.prazo)) && !t.concluida).length,
    hoje: tarefas.filter(t => isToday(new Date(t.prazo))).length,
    total: tarefas.length
  };

  /**
   * Renderiza o ícone de prioridade
   * @param prioridade Nível de prioridade
   * @returns Componente do ícone
   */
  const renderPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "media":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "baixa":
        return <FileText className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  /**
   * Manipula a alternância de status completo/pendente de uma tarefa
   * @param id ID da tarefa
   */
  const handleToggleTarefa = (id: number) => {
    setTarefas(tarefas.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
    toast.success("Status da tarefa atualizado!");
  };

  /**
   * Adiciona uma nova tarefa
   * @param e Evento do formulário
   */
  const handleAddTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaTarefa.titulo || !novaTarefa.prazo) {
      toast.error("Preencha pelo menos o título e o prazo!");
      return;
    }
    
    const newTask: Task = {
      ...novaTarefa,
      id: Date.now(),
      criadoEm: format(new Date(), "yyyy-MM-dd")
    };
    
    setTarefas([...tarefas, newTask]);
    setShowAddTarefa(false);
    setNovaTarefa({
      titulo: "",
      descricao: "",
      prazo: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      prioridade: "media",
      categoria: categorias[0],
      concluida: false
    });
    
    toast.success("Tarefa adicionada com sucesso!");
  };

  /**
   * Abre o formulário para editar uma tarefa
   * @param tarefa Tarefa a ser editada
   */
  const handleEditTarefa = (tarefa: Task) => {
    setTarefaAtual(tarefa);
    setShowAddTarefa(true);
  };

  /**
   * Salva as alterações em uma tarefa
   * @param e Evento do formulário
   */
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tarefaAtual) {
      setTarefas(tarefas.map(t => 
        t.id === tarefaAtual.id ? tarefaAtual : t
      ));
      
      setShowAddTarefa(false);
      setTarefaAtual(null);
      toast.success("Tarefa atualizada com sucesso!");
    }
  };

  /**
   * Remove uma tarefa
   * @param id ID da tarefa
   */
  const handleRemoveTarefa = (id: number) => {
    setTarefas(tarefas.filter(t => t.id !== id));
    toast.success("Tarefa removida com sucesso!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            Tarefas e Lembretes
          </h3>
          {modo === "completo" && (
            <p className="text-sm text-gray-600 mt-1">
              {contagem.pendentes} pendentes, {contagem.concluidas} concluídas
            </p>
          )}
        </div>
        
        <div className="mt-3 md:mt-0">
          <Button 
            size="sm"
            onClick={() => {
              setTarefaAtual(null);
              setShowAddTarefa(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-1" /> 
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      {/* Filtros (apenas no modo completo) */}
      {modo === "completo" && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex flex-wrap gap-3">
            {/* Filtro por status */}
            <div className="flex items-center">
              <label htmlFor="filtroStatus" className="text-sm text-gray-500 mr-2 flex items-center">
                <Filter className="w-4 h-4 mr-1" /> Status:
              </label>
              <select
                id="filtroStatus"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="todas">Todas</option>
                <option value="pendentes">Pendentes</option>
                <option value="concluidas">Concluídas</option>
                <option value="atrasadas">Atrasadas</option>
                <option value="hoje">Para hoje</option>
              </select>
            </div>
            
            {/* Filtro por categoria */}
            <div className="flex items-center">
              <label htmlFor="filtroCategoria" className="text-sm text-gray-500 mr-2 flex items-center">
                <Tag className="w-4 h-4 mr-1" /> Categoria:
              </label>
              <select
                id="filtroCategoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro por prioridade */}
            <div className="flex items-center">
              <label htmlFor="filtroPrioridade" className="text-sm text-gray-500 mr-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" /> Prioridade:
              </label>
              <select
                id="filtroPrioridade"
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Todas</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            
            {/* Ordenação */}
            <div className="flex items-center ml-auto">
              <label htmlFor="ordenacao" className="text-sm text-gray-500 mr-2 flex items-center">
                <SortAsc className="w-4 h-4 mr-1" /> Ordenar por:
              </label>
              <select
                id="ordenacao"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="prazo">Prazo</option>
                <option value="prioridade">Prioridade</option>
                <option value="categoria">Categoria</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de tarefas */}
      <div 
        className="overflow-y-auto p-4"
        style={{ maxHeight: alturaMaxima }}
      >
        {tarefasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>Nenhuma tarefa encontrada</p>
            <p className="text-sm">Adicione uma nova tarefa ou ajuste os filtros</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tarefasFiltradas.map((tarefa) => (
              <motion.li 
                key={tarefa.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start p-3 rounded-lg border 
                  ${tarefa.concluida ? 'bg-gray-50 border-gray-200' : 
                    isPast(new Date(tarefa.prazo)) && !tarefa.concluida ? 
                    'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
              >
                {/* Checkbox para marcar como concluída */}
                <button
                  onClick={() => handleToggleTarefa(tarefa.id)}
                  className="flex-shrink-0 mt-0.5 mr-3"
                  aria-label={tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída"}
                >
                  {tarefa.concluida ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 hover:border-indigo-500" />
                  )}
                </button>
                
                {/* Conteúdo da tarefa */}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${tarefa.concluida ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {tarefa.titulo}
                    </h4>
                    
                    {/* Ações da tarefa */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTarefa(tarefa)}
                        className="text-gray-400 hover:text-indigo-600"
                        aria-label="Editar tarefa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTarefa(tarefa.id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Remover tarefa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Descrição (se houver) */}
                  {tarefa.descricao && (
                    <p className={`text-xs mb-2 ${tarefa.concluida ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tarefa.descricao}
                    </p>
                  )}
                  
                  {/* Metadados */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {/* Data de prazo */}
                    <span className={`flex items-center ${
                      isPast(new Date(tarefa.prazo)) && !tarefa.concluida 
                        ? 'text-red-600' 
                        : isToday(new Date(tarefa.prazo)) 
                          ? 'text-amber-600' 
                          : 'text-gray-500'
                    }`}>
                      <CalendarDays className="w-3.5 h-3.5 mr-1" />
                      {format(new Date(tarefa.prazo), "dd/MM/yyyy", { locale: ptBR })}
                      {isPast(new Date(tarefa.prazo)) && !tarefa.concluida && " (atrasada)"}
                      {isToday(new Date(tarefa.prazo)) && " (hoje)"}
                    </span>
                    
                    {/* Categoria */}
                    <span className="flex items-center bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3 mr-1" />
                      {tarefa.categoria}
                    </span>
                    
                    {/* Prioridade */}
                    <span className={`flex items-center px-2 py-0.5 rounded
                      ${CORES_PRIORIDADE[tarefa.prioridade].bg} 
                      ${CORES_PRIORIDADE[tarefa.prioridade].text}`}
                    >
                      {renderPrioridade(tarefa.prioridade)}
                      <span className="ml-1 capitalize">{tarefa.prioridade}</span>
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Modal para adicionar/editar tarefa */}
      <AnimatePresence>
        {showAddTarefa && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-lg max-w-md w-full"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {tarefaAtual ? "Editar Tarefa" : "Nova Tarefa"}
                </h3>
              </div>
              
              <form onSubmit={tarefaAtual ? handleSaveEdit : handleAddTarefa}>
                <div className="p-4 space-y-4">
                  {/* Título */}
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                      Título*
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      value={tarefaAtual ? tarefaAtual.titulo : novaTarefa.titulo}
                      onChange={(e) => tarefaAtual 
                        ? setTarefaAtual({...tarefaAtual, titulo: e.target.value}) 
                        : setNovaTarefa({...novaTarefa, titulo: e.target.value})
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Digite o título da tarefa"
                      required
                    />
                  </div>
                  
                  {/* Descrição */}
                  <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="descricao"
                      value={tarefaAtual ? tarefaAtual.descricao : novaTarefa.descricao}
                      onChange={(e) => tarefaAtual 
                        ? setTarefaAtual({...tarefaAtual, descricao: e.target.value}) 
                        : setNovaTarefa({...novaTarefa, descricao: e.target.value})
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Descreva a tarefa (opcional)"
                      rows={3}
                    />
                  </div>
                  
                  {/* Data prazo */}
                  <div>
                    <label htmlFor="prazo" className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo*
                    </label>
                    <input
                      type="date"
                      id="prazo"
                      value={tarefaAtual ? tarefaAtual.prazo : novaTarefa.prazo}
                      onChange={(e) => tarefaAtual 
                        ? setTarefaAtual({...tarefaAtual, prazo: e.target.value}) 
                        : setNovaTarefa({...novaTarefa, prazo: e.target.value})
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prioridade */}
                    <div>
                      <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridade
                      </label>
                      <select
                        id="prioridade"
                        value={tarefaAtual ? tarefaAtual.prioridade : novaTarefa.prioridade}
                        onChange={(e) => {
                          const value = e.target.value as "baixa" | "media" | "alta";
                          tarefaAtual 
                            ? setTarefaAtual({...tarefaAtual, prioridade: value}) 
                            : setNovaTarefa({...novaTarefa, prioridade: value});
                        }}
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                    
                    {/* Categoria */}
                    <div>
                      <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <select
                        id="categoria"
                        value={tarefaAtual ? tarefaAtual.categoria : novaTarefa.categoria}
                        onChange={(e) => tarefaAtual 
                          ? setTarefaAtual({...tarefaAtual, categoria: e.target.value}) 
                          : setNovaTarefa({...novaTarefa, categoria: e.target.value})
                        }
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {categorias.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddTarefa(false);
                      setTarefaAtual(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {tarefaAtual ? "Salvar Alterações" : "Adicionar Tarefa"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 