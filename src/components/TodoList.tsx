import { useState } from "react";
import Todo, { Task } from "@/components/Todo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, Bell, FileUp, BookOpen, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { format, addDays } from "date-fns";

// Propriedades do componente
interface TodoListProps {
  userRole: "diretor" | "coordenador" | "professor";
  userName?: string;
}

// Tarefas por perfil para desenvolvimento
const TAREFAS_DIRETOR: Task[] = [
  {
    id: 1,
    titulo: "Revisar orçamento trimestral",
    descricao: "Verificar gastos e planejamento para o próximo trimestre",
    prazo: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Administrativo",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 2,
    titulo: "Reunião com coordenadores",
    descricao: "Discutir resultados das últimas avaliações e planos de melhoria",
    prazo: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Reunião",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 3,
    titulo: "Aprovar calendário de eventos",
    descricao: "Revisar e aprovar o calendário proposto para o próximo semestre",
    prazo: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Planejamento",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  }
];

const TAREFAS_COORDENADOR: Task[] = [
  {
    id: 1,
    titulo: "Preparar relatório de desempenho das turmas",
    descricao: "Analisar resultados e identificar pontos de melhoria",
    prazo: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Avaliação",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 2,
    titulo: "Observação de aula - Prof. Carlos",
    descricao: "Acompanhar aula e providenciar feedback construtivo",
    prazo: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Pedagógico",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 3,
    titulo: "Organizar conselho de classe",
    descricao: "Preparar materiais e agenda para o conselho",
    prazo: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Reunião",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 4,
    titulo: "Feedback para professores",
    descricao: "Realizar reuniões individuais com professores sobre desempenho",
    prazo: format(addDays(new Date(), 8), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Avaliação",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  }
];

const TAREFAS_PROFESSOR: Task[] = [
  {
    id: 1,
    titulo: "Corrigir avaliações bimestrais",
    descricao: "Corrigir e lançar notas das últimas provas",
    prazo: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Avaliação",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 2,
    titulo: "Preparar plano de aula - próxima semana",
    descricao: "Organizar materiais e atividades para as próximas aulas",
    prazo: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    prioridade: "alta",
    categoria: "Planejamento",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 3,
    titulo: "Atender pais de alunos",
    descricao: "Reunião com pais de Maria Silva - Turma 2B",
    prazo: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Alunos",
    concluida: false,
    criadoEm: format(new Date(), "yyyy-MM-dd")
  },
  {
    id: 4,
    titulo: "Elaborar atividade de recuperação",
    descricao: "Criar atividades para os alunos com dificuldades",
    prazo: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    prioridade: "media",
    categoria: "Pedagógico",
    concluida: true,
    criadoEm: format(addDays(new Date(), -2), "yyyy-MM-dd")
  }
];

// Lembretes do sistema para cada perfil
const LEMBRETES_DIRETOR = [
  {
    id: 1,
    titulo: "Vencimento de licenças de software",
    conteudo: "As licenças dos softwares educacionais vencem em 15 dias",
    tipo: "administrativo"
  },
  {
    id: 2,
    titulo: "Reunião com Conselho Escolar",
    conteudo: "Agendada para a próxima semana",
    tipo: "evento"
  },
  {
    id: 3,
    titulo: "Prestação de contas trimestral",
    conteudo: "O prazo final é dia 25 deste mês",
    tipo: "administrativo"
  }
];

const LEMBRETES_COORDENADOR = [
  {
    id: 1,
    titulo: "Avaliações bimestrais",
    conteudo: "Período de aplicação começa na próxima semana",
    tipo: "evento"
  },
  {
    id: 2,
    titulo: "Índice de faltas elevado",
    conteudo: "3 alunos da turma 1B estão com faltas acima do limite",
    tipo: "pedagógico"
  },
  {
    id: 3,
    titulo: "Relatórios de desempenho",
    conteudo: "Pendentes para as turmas 2A e 3B",
    tipo: "administrativo"
  }
];

const LEMBRETES_PROFESSOR = [
  {
    id: 1,
    titulo: "Prazo para lançamento de notas",
    conteudo: "Termina nesta sexta-feira",
    tipo: "administrativo"
  },
  {
    id: 2,
    titulo: "Conselho de classe",
    conteudo: "Agendado para o dia 15 às 14h",
    tipo: "evento"
  },
  {
    id: 3,
    titulo: "Alunos com baixo desempenho",
    conteudo: "4 alunos da turma 2A precisam de atenção especial",
    tipo: "pedagógico"
  }
];

/**
 * Componente TodoList
 * 
 * Interface de gerenciamento de tarefas adaptada aos diferentes perfis de usuário
 * no sistema escolar (diretor, coordenador e professor), incluindo tarefas e lembretes.
 */
export default function TodoList({ userRole, userName = "Usuário" }: TodoListProps) {
  // Define as tarefas iniciais com base no perfil do usuário
  const getTarefasIniciais = () => {
    switch (userRole) {
      case "diretor":
        return TAREFAS_DIRETOR;
      case "coordenador":
        return TAREFAS_COORDENADOR;
      case "professor":
        return TAREFAS_PROFESSOR;
      default:
        return [];
    }
  };

  // Define os lembretes com base no perfil do usuário
  const getLembretes = () => {
    switch (userRole) {
      case "diretor":
        return LEMBRETES_DIRETOR;
      case "coordenador":
        return LEMBRETES_COORDENADOR;
      case "professor":
        return LEMBRETES_PROFESSOR;
      default:
        return [];
    }
  };

  // Estados
  const [tarefas, setTarefas] = useState<Task[]>(getTarefasIniciais());
  const [lembretes, setLembretes] = useState(getLembretes());
  const [tipoVisualizacao, setTipoVisualizacao] = useState<"tarefas" | "lembretes">("tarefas");

  // Define as categorias específicas para cada perfil
  const getCategorias = () => {
    switch (userRole) {
      case "diretor":
        return ["Administrativo", "Pedagógico", "Reunião", "Planejamento", "Financeiro", "Institucional"];
      case "coordenador":
        return ["Administrativo", "Pedagógico", "Reunião", "Avaliação", "Alunos", "Professores"];
      case "professor":
        return ["Pedagógico", "Planejamento", "Avaliação", "Alunos", "Materiais", "Atividades"];
      default:
        return [];
    }
  };

  /**
   * Atualiza o estado das tarefas quando alteradas pelo componente filho
   * @param novasTarefas Array atualizado de tarefas
   */
  const handleTaskChange = (novasTarefas: Task[]) => {
    setTarefas(novasTarefas);
  };

  /**
   * Remove um lembrete da lista
   * @param id ID do lembrete a ser removido
   */
  const removerLembrete = (id: number) => {
    setLembretes(lembretes.filter(lembrete => lembrete.id !== id));
    toast.success("Lembrete removido com sucesso");
  };

  /**
   * Converte um lembrete em tarefa
   * @param id ID do lembrete a ser convertido
   */
  const converterEmTarefa = (id: number) => {
    const lembrete = lembretes.find(l => l.id === id);
    
    if (lembrete) {
      // Cria uma nova tarefa baseada no lembrete
      const novaTarefa: Task = {
        id: Date.now(),
        titulo: lembrete.titulo,
        descricao: lembrete.conteudo,
        prazo: format(addDays(new Date(), 3), "yyyy-MM-dd"),
        prioridade: "media",
        categoria: lembrete.tipo === "administrativo" ? "Administrativo" : 
                  lembrete.tipo === "pedagógico" ? "Pedagógico" : "Planejamento",
        concluida: false,
        criadoEm: format(new Date(), "yyyy-MM-dd")
      };
      
      // Adiciona a tarefa e remove o lembrete
      setTarefas([...tarefas, novaTarefa]);
      setLembretes(lembretes.filter(l => l.id !== id));
      
      toast.success("Lembrete convertido em tarefa");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              Gerenciador de Tarefas
            </CardTitle>
            <CardDescription>
              {userRole === "diretor" && "Organize suas tarefas administrativas e pedagógicas"}
              {userRole === "coordenador" && "Acompanhe suas responsabilidades pedagógicas"} 
              {userRole === "professor" && "Gerencie suas tarefas docentes"}
            </CardDescription>
          </div>
          
          {/* Contador de tarefas */}
          <Badge variant="outline" className="px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            {tarefas.filter(t => !t.concluida).length} pendentes
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <Tabs defaultValue="tarefas" onValueChange={(v) => setTipoVisualizacao(v as any)}>
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="tarefas" className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Tarefas
            </TabsTrigger>
            <TabsTrigger value="lembretes" className="flex items-center gap-1">
              <Bell className="w-4 h-4" /> Lembretes
              <Badge className="ml-1 bg-amber-500">
                {lembretes.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tarefas">
            <Todo 
              modo="completo"
              categorias={getCategorias()}
              tarefasIniciais={tarefas}
              onTaskChange={handleTaskChange}
              alturaMaxima="400px"
            />
          </TabsContent>
          
          <TabsContent value="lembretes">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Lembretes do Sistema
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Notificações e lembretes importantes
                </p>
              </div>
              
              <div className="overflow-y-auto p-4" style={{ maxHeight: "400px" }}>
                {lembretes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>Nenhum lembrete ativo</p>
                    <p className="text-sm">Os lembretes do sistema aparecerão aqui</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {lembretes.map((lembrete) => (
                      <li 
                        key={lembrete.id}
                        className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            {/* Ícone baseado no tipo */}
                            <div className={`flex-shrink-0 rounded-full p-1 mr-3 
                              ${lembrete.tipo === "administrativo" ? "bg-blue-100" : 
                                lembrete.tipo === "pedagógico" ? "bg-green-100" : "bg-amber-100"}`}>
                              {lembrete.tipo === "administrativo" && <FileUp className="h-5 w-5 text-blue-600" />}
                              {lembrete.tipo === "pedagógico" && <BookOpen className="h-5 w-5 text-green-600" />}
                              {lembrete.tipo === "evento" && <Calendar className="h-5 w-5 text-amber-600" />}
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-800">
                                {lembrete.titulo}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {lembrete.conteudo}
                              </p>
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {lembrete.tipo}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => converterEmTarefa(lembrete.id)}
                              className="h-8 px-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span className="text-xs">Tarefa</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => removerLembrete(lembrete.id)}
                              className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <span className="text-xs">Dispensar</span>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 