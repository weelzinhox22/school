import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Award, 
  TrendingUp, 
  Users, 
  UserCog, 
  TrendingDown,
  Medal,
  BarChart2,
  Calendar,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  FileDown
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados mockados para desenvolvimento
// Serão substituídos por chamadas à API no backend

// Dados de alunos para o ranking
const mockRankingAlunos = [
  { id: 1, nome: "Ana Souza", turma: "1A", nota: 9.2, frequencia: 98, participacao: 95, tendencia: "subindo" },
  { id: 2, nome: "Lucas Silva", turma: "1A", nota: 8.8, frequencia: 97, participacao: 92, tendencia: "estavel" },
  { id: 3, nome: "Pedro Lima", turma: "1B", nota: 8.5, frequencia: 95, participacao: 90, tendencia: "subindo" },
  { id: 4, nome: "Carla Mendes", turma: "2A", nota: 8.1, frequencia: 96, participacao: 93, tendencia: "subindo" },
  { id: 5, nome: "Rafael Costa", turma: "2B", nota: 7.9, frequencia: 94, participacao: 88, tendencia: "estavel" },
  { id: 6, nome: "Juliana Martins", turma: "3A", nota: 7.6, frequencia: 91, participacao: 85, tendencia: "descendo" },
  { id: 7, nome: "Bruno Oliveira", turma: "3B", nota: 7.4, frequencia: 89, participacao: 84, tendencia: "estavel" },
  { id: 8, nome: "Fernanda Santos", turma: "1A", nota: 7.2, frequencia: 92, participacao: 89, tendencia: "subindo" },
  { id: 9, nome: "Gabriel Alves", turma: "2A", nota: 6.9, frequencia: 88, participacao: 82, tendencia: "descendo" },
  { id: 10, nome: "Mariana Lima", turma: "3A", nota: 6.5, frequencia: 85, participacao: 80, tendencia: "descendo" },
];

// Dados de turmas para o ranking
const mockRankingTurmas = [
  { id: 1, turma: "1A", media: 8.7, frequencia: 97, aprovados: 95, tendencia: "subindo" },
  { id: 2, turma: "1B", media: 8.2, frequencia: 95, aprovados: 92, tendencia: "estavel" },
  { id: 3, turma: "2A", media: 8.0, frequencia: 96, aprovados: 90, tendencia: "subindo" },
  { id: 4, turma: "2B", media: 7.8, frequencia: 94, aprovados: 88, tendencia: "estavel" },
  { id: 5, turma: "3A", media: 7.5, frequencia: 92, aprovados: 85, tendencia: "descendo" },
  { id: 6, turma: "3B", media: 7.3, frequencia: 91, aprovados: 83, tendencia: "descendo" },
];

// Dados de professores para o ranking
const mockRankingProfs = [
  { id: 1, nome: "Maria Silva", disciplina: "Matemática", media: 8.9, participacao: 97, avaliacaoAlunos: 9.5, tendencia: "subindo" },
  { id: 2, nome: "João Souza", disciplina: "Português", media: 8.5, participacao: 95, avaliacaoAlunos: 9.2, tendencia: "estavel" },
  { id: 3, nome: "Ana Lima", disciplina: "História", media: 8.2, participacao: 93, avaliacaoAlunos: 8.9, tendencia: "subindo" },
  { id: 4, nome: "Roberto Gomes", disciplina: "Geografia", media: 8.0, participacao: 92, avaliacaoAlunos: 8.7, tendencia: "subindo" },
  { id: 5, nome: "Juliana Castro", disciplina: "Ciências", media: 7.8, participacao: 90, avaliacaoAlunos: 8.5, tendencia: "estavel" },
  { id: 6, nome: "Carlos Mendes", disciplina: "Inglês", media: 7.5, participacao: 88, avaliacaoAlunos: 8.3, tendencia: "descendo" },
  { id: 7, nome: "Patrícia Rocha", disciplina: "Educação Física", media: 7.3, participacao: 87, avaliacaoAlunos: 8.1, tendencia: "estavel" },
  { id: 8, nome: "Fernando Alves", disciplina: "Artes", media: 7.1, participacao: 85, avaliacaoAlunos: 7.9, tendencia: "descendo" },
];

// Dados de alunos com baixo desempenho (precisam de atenção especial)
const mockBaixoDesempenho = [
  { id: 1, nome: "Gabriel Alves", turma: "2A", nota: 6.9, frequencia: 88, problema: "Notas baixas em Matemática" },
  { id: 2, nome: "Mariana Lima", turma: "3A", nota: 6.5, frequencia: 85, problema: "Frequência abaixo do esperado" },
  { id: 3, nome: "Paulo Rodrigues", turma: "1B", nota: 6.3, frequencia: 82, problema: "Baixa participação em aula" },
  { id: 4, nome: "Camila Ferreira", turma: "2B", nota: 6.1, frequencia: 80, problema: "Notas baixas em Português" },
  { id: 5, nome: "Vinícius Santos", turma: "3B", nota: 5.9, frequencia: 78, problema: "Notas baixas em várias disciplinas" },
];

/**
 * Componente GestaoRanking
 * 
 * Este componente apresenta o ranking de desempenho de alunos, turmas e professores,
 * permitindo visualizar e comparar métricas acadêmicas para identificar pontos fortes 
 * e oportunidades de melhoria na instituição.
 */
export default function GestaoRanking() {
  // Estados do componente
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("Semestre Atual");
  const [filtroDesempenho, setFiltroDesempenho] = useState("todos"); // "todos", "melhores", "atenção"
  const [showGrafico, setShowGrafico] = useState(false); // para um possível modo gráfico/tabela
  
  // Períodos disponíveis para filtro
  const periodos = [
    "Semestre Atual",
    "Semestre Anterior", 
    "Ano Letivo Completo"
  ];
  
  // Turmas disponíveis para filtro
  const turmas = ["1A", "1B", "2A", "2B", "3A", "3B"];

  /**
   * Filtra os alunos com base nos critérios selecionados
   * @returns Array de alunos filtrados
   */
  const getAlunosFiltrados = () => {
    let alunos = [...mockRankingAlunos];
    
    if (filtroTurma) {
      alunos = alunos.filter(a => a.turma === filtroTurma);
    }
    
    if (filtroDesempenho === "melhores") {
      // Retorna apenas os 5 melhores alunos
      return alunos.slice(0, 5);
    } else if (filtroDesempenho === "atencao") {
      // Retorna apenas os alunos com baixo desempenho
      return mockBaixoDesempenho;
    }
    
    return alunos;
  };

  /**
   * Filtra as turmas com base nos critérios selecionados
   * @returns Array de turmas filtradas
   */
  const getTurmasFiltradas = () => {
    let turmas = [...mockRankingTurmas];
    
    if (filtroDesempenho === "melhores") {
      // Retorna apenas as 3 melhores turmas
      return turmas.slice(0, 3);
    } else if (filtroDesempenho === "atencao") {
      // Retorna apenas as turmas com desempenho abaixo da média
      return turmas.filter(t => t.media < 7.5);
    }
    
    return turmas;
  };

  /**
   * Filtra os professores com base nos critérios selecionados
   * @returns Array de professores filtrados
   */
  const getProfessoresFiltrados = () => {
    let professores = [...mockRankingProfs];
    
    if (filtroDesempenho === "melhores") {
      // Retorna apenas os 3 melhores professores
      return professores.slice(0, 3);
    } else if (filtroDesempenho === "atencao") {
      // Retorna apenas os professores com desempenho abaixo da média
      return professores.filter(p => p.media < 7.5);
    }
    
    return professores;
  };

  /**
   * Função para exportar os rankings
   * @param tipo Tipo de ranking (alunos, turmas, professores)
   */
  const exportarRanking = (tipo: string) => {
    toast.success(`Ranking de ${tipo} exportado com sucesso!`);
  };

  /**
   * Renderiza o ícone de tendência com base no status (subindo, estável, descendo)
   * @param tendencia Status da tendência
   * @returns Componente do ícone apropriado
   */
  const renderTendencia = (tendencia: string) => {
    switch (tendencia) {
      case "subindo":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "descendo":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <span className="w-4 h-4 text-gray-400">•</span>;
    }
  };

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Ranking e Métricas de Desempenho
            </h2>
            <p className="text-gray-600">Acompanhe o desempenho de alunos, turmas e professores da instituição.</p>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Card de Média Geral da Instituição */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-100 rounded-lg">
            <BarChart2 className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Média Geral</p>
            <p className="text-2xl font-bold text-gray-800">7.8</p>
          </div>
        </motion.div>

        {/* Card de Frequência Média */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <Calendar className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Frequência Média</p>
            <p className="text-2xl font-bold text-gray-800">92%</p>
          </div>
        </motion.div>

        {/* Card de Taxa de Aprovação */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Taxa de Aprovação</p>
            <p className="text-2xl font-bold text-gray-800">89%</p>
          </div>
        </motion.div>

        {/* Card de Alunos em Destaque */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-purple-100 rounded-lg">
            <Medal className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Alunos em Destaque</p>
            <p className="text-2xl font-bold text-gray-800">{mockRankingAlunos.filter(a => a.nota >= 8.5).length}</p>
          </div>
        </motion.div>
      </div>

      {/* Barra de filtros */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6"
      >
        <div className="border-b border-gray-100 p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Seletor de período */}
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            >
              {periodos.map(periodo => (
                <option key={periodo} value={periodo}>{periodo}</option>
              ))}
            </select>
            
            {/* Seletor de turma */}
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={filtroTurma}
              onChange={(e) => setFiltroTurma(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map(turma => (
                <option key={turma} value={turma}>{turma}</option>
              ))}
            </select>
            
            {/* Botões de filtro de desempenho */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filtroDesempenho === "todos" 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroDesempenho("todos")}
              >
                Todos
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filtroDesempenho === "melhores" 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroDesempenho("melhores")}
              >
                Melhores
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filtroDesempenho === "atencao" 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroDesempenho("atencao")}
              >
                Atenção Especial
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex gap-2 items-center text-gray-700"
            >
              <Filter className="w-4 h-4" />
              Filtros Avançados
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Seção de Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking de Alunos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-indigo-700">
                {filtroDesempenho === "melhores" 
                  ? "Top Alunos" 
                  : filtroDesempenho === "atencao" 
                    ? "Alunos com Atenção Especial" 
                    : "Ranking de Alunos"}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={() => exportarRanking("alunos")}
            >
              <FileDown className="w-3 h-3" />
              Exportar
            </Button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-indigo-700 text-xs border-b border-gray-200">
                <th className="py-2 font-medium">Nome</th>
                <th className="py-2 font-medium">Turma</th>
                <th className="py-2 font-medium">Nota</th>
                <th className="py-2 font-medium">Freq.</th>
                {filtroDesempenho === "atencao" ? (
                  <th className="py-2 font-medium">Problema</th>
                ) : (
                  <th className="py-2 font-medium">Tend.</th>
                )}
              </tr>
            </thead>
            <tbody>
              {getAlunosFiltrados().map((aluno, i) => (
                <tr 
                  key={aluno.id} 
                  className={`border-b border-gray-100 last:border-b-0 ${
                    i === 0 && filtroDesempenho === "melhores" ? 'bg-amber-50 font-medium' : ''
                  }`}
                >
                  <td className="py-2 font-medium text-indigo-700">
                    {i === 0 && filtroDesempenho === "melhores" && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 text-amber-700 rounded-full mr-1 text-xs">1</span>
                    )}
                    {aluno.nome}
                  </td>
                  <td className="py-2">{aluno.turma}</td>
                  <td className="py-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      aluno.nota >= 8.0 ? "bg-green-100 text-green-700" :
                      aluno.nota >= 7.0 ? "bg-blue-100 text-blue-700" :
                      aluno.nota >= 6.0 ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {aluno.nota.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2">{aluno.frequencia}%</td>
                  {filtroDesempenho === "atencao" ? (
                    <td className="py-2 text-sm text-red-600">
                      {(aluno as any).problema}
                    </td>
                  ) : (
                    <td className="py-2 flex items-center">
                      {renderTendencia(aluno.tendencia)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Ranking de Turmas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-indigo-700">
                {filtroDesempenho === "melhores" 
                  ? "Melhores Turmas" 
                  : filtroDesempenho === "atencao" 
                    ? "Turmas com Desempenho Abaixo da Média" 
                    : "Ranking de Turmas"}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={() => exportarRanking("turmas")}
            >
              <FileDown className="w-3 h-3" />
              Exportar
            </Button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-indigo-700 text-xs border-b border-gray-200">
                <th className="py-2 font-medium">Turma</th>
                <th className="py-2 font-medium">Média</th>
                <th className="py-2 font-medium">Freq.</th>
                <th className="py-2 font-medium">Aprov.</th>
                <th className="py-2 font-medium">Tend.</th>
              </tr>
            </thead>
            <tbody>
              {getTurmasFiltradas().map((turma, i) => (
                <tr 
                  key={turma.id} 
                  className={`border-b border-gray-100 last:border-b-0 ${
                    i === 0 && filtroDesempenho === "melhores" ? 'bg-amber-50 font-medium' : ''
                  }`}
                >
                  <td className="py-2 font-medium text-indigo-700">
                    {i === 0 && filtroDesempenho === "melhores" && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 text-amber-700 rounded-full mr-1 text-xs">1</span>
                    )}
                    {turma.turma}
                  </td>
                  <td className="py-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      turma.media >= 8.0 ? "bg-green-100 text-green-700" :
                      turma.media >= 7.0 ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {turma.media.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2">{turma.frequencia}%</td>
                  <td className="py-2">{turma.aprovados}%</td>
                  <td className="py-2 flex items-center">
                    {renderTendencia(turma.tendencia)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Ranking de Professores */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-indigo-700">
                {filtroDesempenho === "melhores" 
                  ? "Melhores Professores" 
                  : filtroDesempenho === "atencao" 
                    ? "Professores com Desempenho Abaixo da Média" 
                    : "Ranking de Professores"}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={() => exportarRanking("professores")}
            >
              <FileDown className="w-3 h-3" />
              Exportar
            </Button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-indigo-700 text-xs border-b border-gray-200">
                <th className="py-2 font-medium">Nome</th>
                <th className="py-2 font-medium">Disciplina</th>
                <th className="py-2 font-medium">Média</th>
                <th className="py-2 font-medium">Aval.</th>
                <th className="py-2 font-medium">Tend.</th>
              </tr>
            </thead>
            <tbody>
              {getProfessoresFiltrados().map((prof, i) => (
                <tr 
                  key={prof.id} 
                  className={`border-b border-gray-100 last:border-b-0 ${
                    i === 0 && filtroDesempenho === "melhores" ? 'bg-amber-50 font-medium' : ''
                  }`}
                >
                  <td className="py-2 font-medium text-indigo-700">
                    {i === 0 && filtroDesempenho === "melhores" && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 text-amber-700 rounded-full mr-1 text-xs">1</span>
                    )}
                    {prof.nome}
                  </td>
                  <td className="py-2">{prof.disciplina}</td>
                  <td className="py-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      prof.media >= 8.0 ? "bg-green-100 text-green-700" :
                      prof.media >= 7.0 ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {prof.media.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2">{prof.avaliacaoAlunos}</td>
                  <td className="py-2 flex items-center">
                    {renderTendencia(prof.tendencia)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Seção de Análise e Recomendações - Visível apenas quando tiver selecionado "Atenção" */}
      {filtroDesempenho === "atencao" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Análise e Recomendações de Melhoria
          </h3>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800 font-medium mb-2">Atenção especial necessária</p>
            <p className="text-amber-700 text-sm">
              Com base nos dados analisados, identificamos {mockBaixoDesempenho.length} alunos e {mockRankingTurmas.filter(t => t.tendencia === "descendo").length} turmas 
              que necessitam de acompanhamento pedagógico mais próximo.
            </p>
          </div>
          
          <h4 className="font-medium text-gray-800 mt-4 mb-2">Ações Recomendadas:</h4>
          
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-medium mt-0.5">1</span>
              <span>Agendar reunião com professores das turmas {mockRankingTurmas.filter(t => t.tendencia === "descendo").map(t => t.turma).join(", ")} para discutir estratégias pedagógicas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-medium mt-0.5">2</span>
              <span>Criar grupos de estudos monitorados para os alunos identificados com baixo desempenho.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-medium mt-0.5">3</span>
              <span>Realizar avaliação diagnóstica específica para identificar lacunas de aprendizagem.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-medium mt-0.5">4</span>
              <span>Notificar os responsáveis e agendar reuniões individuais para acompanhamento familiar.</span>
            </li>
          </ul>
          
          <div className="flex justify-end mt-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Gerar Plano de Ação Detalhado
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 