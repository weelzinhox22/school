import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X,
  FileText
} from "lucide-react";

// Dados mockados para desenvolvimento
// Serão substituídos por chamadas à API no backend
const TURMAS_MOCK = [
  { id: 1, codigo: "1A", nome: "1º Ano A", turno: "Manhã", qtdAlunos: 35, professor: "Maria Silva" },
  { id: 2, codigo: "1B", nome: "1º Ano B", turno: "Tarde", qtdAlunos: 32, professor: "João Souza" },
  { id: 3, codigo: "2A", nome: "2º Ano A", turno: "Manhã", qtdAlunos: 30, professor: "Ana Lima" },
  { id: 4, codigo: "2B", nome: "2º Ano B", turno: "Tarde", qtdAlunos: 28, professor: "Carlos Mendes" },
  { id: 5, codigo: "3A", nome: "3º Ano A", turno: "Manhã", qtdAlunos: 33, professor: "Paulo Ferreira" },
  { id: 6, codigo: "3B", nome: "3º Ano B", turno: "Tarde", qtdAlunos: 30, professor: "Fernanda Santos" },
];

const PROFESSORES_MOCK = [
  { id: 1, nome: "Maria Silva", disciplina: "Matemática" },
  { id: 2, nome: "João Souza", disciplina: "Português" },
  { id: 3, nome: "Ana Lima", disciplina: "História" },
  { id: 4, nome: "Carlos Mendes", disciplina: "Geografia" },
  { id: 5, nome: "Paulo Ferreira", disciplina: "Ciências" },
  { id: 6, nome: "Fernanda Santos", disciplina: "Inglês" },
];

const TURNOS = ["Manhã", "Tarde"];

interface Turma {
  id: number;
  codigo: string;
  nome: string;
  turno: string;
  qtdAlunos: number;
  professor: string;
}

/**
 * Componente de Gestão de Turmas
 * 
 * Este componente gerencia a listagem, criação, edição e exclusão de turmas,
 * bem como a visualização de estatísticas relacionadas às turmas.
 */
export default function GestaoTurmas() {
  // Estados do componente
  const [turmas, setTurmas] = useState<Turma[]>(TURMAS_MOCK);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [showAddTurma, setShowAddTurma] = useState(false);
  const [showEditTurma, setShowEditTurma] = useState(false);
  const [showDeleteTurma, setShowDeleteTurma] = useState<number | null>(null);
  const [novaTurma, setNovaTurma] = useState({
    codigo: "",
    nome: "",
    turno: "Manhã",
    qtdAlunos: 30,
    professor: ""
  });

  // Filtragem de turmas com base nos filtros aplicados
  const turmasFiltradas = turmas.filter(turma => 
    (filtroTurno === "" || turma.turno === filtroTurno) &&
    (filtroTexto === "" || 
      turma.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      turma.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      turma.professor.toLowerCase().includes(filtroTexto.toLowerCase()))
  );

  // Contagem de turmas por turno para estatísticas
  const turmasPorTurno = {
    "Manhã": turmas.filter(t => t.turno === "Manhã").length,
    "Tarde": turmas.filter(t => t.turno === "Tarde").length,
    "Total": turmas.length
  };

  // Média de alunos por turma
  const mediaAlunosPorTurma = turmas.length > 0 
    ? Math.round(turmas.reduce((acc, t) => acc + t.qtdAlunos, 0) / turmas.length) 
    : 0;

  /**
   * Função para lidar com adição de uma nova turma
   * @param e Evento do formulário
   */
  function handleAddTurma(e: React.FormEvent) {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!novaTurma.codigo || !novaTurma.nome || !novaTurma.professor) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    
    // Adiciona nova turma com ID gerado
    const newTurma = {
      ...novaTurma,
      id: Date.now()
    };
    
    setTurmas([...turmas, newTurma]);
    setShowAddTurma(false);
    setNovaTurma({
      codigo: "",
      nome: "",
      turno: "Manhã",
      qtdAlunos: 30,
      professor: ""
    });
    
    toast.success("Turma adicionada com sucesso!");
  }

  /**
   * Função para abrir o modal de edição de turma
   * @param turma Dados da turma a ser editada
   */
  function handleEditTurma(turma: Turma) {
    setTurmaSelecionada(turma);
    setShowEditTurma(true);
  }

  /**
   * Função para salvar a edição de uma turma
   * @param e Evento do formulário
   */
  function handleSaveEditTurma(e: React.FormEvent) {
    e.preventDefault();
    
    if (turmaSelecionada) {
      // Atualização da turma no array de turmas
      setTurmas(turmas.map(t => 
        t.id === turmaSelecionada.id ? turmaSelecionada : t
      ));
      
      setShowEditTurma(false);
      setTurmaSelecionada(null);
      toast.success("Turma atualizada com sucesso!");
    }
  }

  /**
   * Função para confirmar a exclusão de uma turma
   */
  function confirmarExclusaoTurma() {
    if (showDeleteTurma) {
      // Remoção da turma do array
      setTurmas(turmas.filter(t => t.id !== showDeleteTurma));
      setShowDeleteTurma(null);
      toast.success("Turma removida com sucesso!");
    }
  }

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Gestão de Turmas
            </h2>
            <p className="text-gray-600">Gerencie as turmas, professores e alunos da instituição.</p>
          </div>
          <Button 
            className="flex gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" 
            onClick={() => setShowAddTurma(true)}
          >
            <Plus className="w-5 h-5" />
            Nova Turma
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Estatística de turmas da manhã */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Turmas Manhã</p>
            <p className="text-2xl font-bold text-gray-800">{turmasPorTurno["Manhã"]}</p>
          </div>
        </motion.div>

        {/* Estatística de turmas da tarde */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <Calendar className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Turmas Tarde</p>
            <p className="text-2xl font-bold text-gray-800">{turmasPorTurno["Tarde"]}</p>
          </div>
        </motion.div>

        {/* Estatística de média de alunos */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Users className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Média Alunos/Turma</p>
            <p className="text-2xl font-bold text-gray-800">{mediaAlunosPorTurma}</p>
          </div>
        </motion.div>
      </div>

      {/* Tabela principal de turmas com filtro de busca */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Barra de filtros */}
        <div className="border-b border-gray-100 p-4 bg-gray-50 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 text-gray-400 bg-white border border-gray-200 rounded-lg p-2 px-3 shadow-sm">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por código, nome ou professor..." 
              className="border-none outline-none bg-transparent w-full text-gray-700"
              value={filtroTexto}
              onChange={e => setFiltroTexto(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm" 
            value={filtroTurno} 
            onChange={e => setFiltroTurno(e.target.value)}
          >
            <option value="">Todos os turnos</option>
            {TURNOS.map(turno => (
              <option key={turno} value={turno}>{turno}</option>
            ))}
          </select>
        </div>

        {/* Tabela com lista de turmas */}
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Código</th>
                <th className="py-3 font-semibold text-gray-700">Nome</th>
                <th className="py-3 font-semibold text-gray-700">Turno</th>
                <th className="py-3 font-semibold text-gray-700">Alunos</th>
                <th className="py-3 font-semibold text-gray-700">Professor</th>
                <th className="py-3 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmasFiltradas.map(turma => (
                <tr key={turma.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-indigo-700 cursor-pointer hover:underline" title="Ver detalhes">
                    {turma.codigo}
                  </td>
                  <td className="py-3 text-gray-600">{turma.nome}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      turma.turno === "Manhã" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {turma.turno}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{turma.qtdAlunos}</td>
                  <td className="py-3 text-gray-600">{turma.professor}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => handleEditTurma(turma)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => setShowDeleteTurma(turma.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 border-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mensagem quando não há turmas */}
          {turmasFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Nenhuma turma encontrada.</p>
              <p className="text-sm">Verifique os filtros ou adicione uma nova turma.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal para adicionar turma */}
      {showAddTurma && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Nova Turma
            </h3>

            {/* Formulário de cadastro de turma */}
            <form onSubmit={handleAddTurma} className="flex flex-col gap-4">
              {/* Campo de Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código da Turma</label>
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  placeholder="Ex: 1A" 
                  required 
                  value={novaTurma.codigo} 
                  onChange={e => setNovaTurma({ ...novaTurma, codigo: e.target.value })} 
                />
              </div>

              {/* Campo de Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  placeholder="Ex: 1º Ano A" 
                  required 
                  value={novaTurma.nome} 
                  onChange={e => setNovaTurma({ ...novaTurma, nome: e.target.value })} 
                />
              </div>

              {/* Campo de Turno */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  value={novaTurma.turno} 
                  onChange={e => setNovaTurma({ ...novaTurma, turno: e.target.value })}
                >
                  {TURNOS.map(turno => (
                    <option key={turno} value={turno}>{turno}</option>
                  ))}
                </select>
              </div>

              {/* Campo de Quantidade de Alunos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Alunos</label>
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  type="number" 
                  min="1"
                  required 
                  value={novaTurma.qtdAlunos} 
                  onChange={e => setNovaTurma({ ...novaTurma, qtdAlunos: parseInt(e.target.value) })} 
                />
              </div>

              {/* Campo de Professor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor Responsável</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  required
                  value={novaTurma.professor} 
                  onChange={e => setNovaTurma({ ...novaTurma, professor: e.target.value })}
                >
                  <option value="">Selecione um professor</option>
                  {PROFESSORES_MOCK.map(prof => (
                    <option key={prof.id} value={prof.nome}>{prof.nome} ({prof.disciplina})</option>
                  ))}
                </select>
              </div>

              {/* Botões de ação do modal */}
              <div className="flex gap-2 justify-end mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddTurma(false)}
                  className="border-gray-300"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Salvar Turma
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar turma */}
      {showEditTurma && turmaSelecionada && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
              <Edit className="w-6 h-6 text-indigo-600" />
              Editar Turma
            </h3>

            {/* Formulário de edição de turma */}
            <form onSubmit={handleSaveEditTurma} className="flex flex-col gap-4">
              {/* Campo de Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código da Turma</label>
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  required 
                  value={turmaSelecionada.codigo} 
                  onChange={e => setTurmaSelecionada({...turmaSelecionada, codigo: e.target.value})} 
                />
              </div>

              {/* Campo de Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  required 
                  value={turmaSelecionada.nome} 
                  onChange={e => setTurmaSelecionada({...turmaSelecionada, nome: e.target.value})} 
                />
              </div>

              {/* Campo de Turno */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  value={turmaSelecionada.turno} 
                  onChange={e => setTurmaSelecionada({...turmaSelecionada, turno: e.target.value})}
                >
                  {TURNOS.map(turno => (
                    <option key={turno} value={turno}>{turno}</option>
                  ))}
                </select>
              </div>

              {/* Campo de Quantidade de Alunos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Alunos</label>
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  type="number" 
                  min="1"
                  required 
                  value={turmaSelecionada.qtdAlunos} 
                  onChange={e => setTurmaSelecionada({...turmaSelecionada, qtdAlunos: parseInt(e.target.value)})} 
                />
              </div>

              {/* Campo de Professor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor Responsável</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  required
                  value={turmaSelecionada.professor} 
                  onChange={e => setTurmaSelecionada({...turmaSelecionada, professor: e.target.value})}
                >
                  <option value="">Selecione um professor</option>
                  {PROFESSORES_MOCK.map(prof => (
                    <option key={prof.id} value={prof.nome}>{prof.nome} ({prof.disciplina})</option>
                  ))}
                </select>
              </div>

              {/* Botões de ação do modal */}
              <div className="flex gap-2 justify-end mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditTurma(false)}
                  className="border-gray-300"
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
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteTurma !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm border border-gray-200">
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600 text-sm">
                Você realmente deseja excluir esta turma? Todos os dados associados a ela serão perdidos.
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDeleteTurma(null)}
                className="border-gray-300 text-gray-700"
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                onClick={confirmarExclusaoTurma}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sim, Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 