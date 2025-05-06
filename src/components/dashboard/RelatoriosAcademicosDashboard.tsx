import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart2, 
  FileText, 
  Download,
  Clock,
  Search,
  Filter,
  Calendar,
  Book,
  User,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

// Interface para as props do componente
interface RelatoriosAcademicosDashboardProps {
  mockRankingTurmas: Array<{
    turma: string;
    media: number;
    frequencia: number;
  }>;
  cardVariants: any;
  TURMAS: string[];
  TURNO_COLORS: Record<string, string>;
}

/**
 * Componente de Relatórios Acadêmicos para o Dashboard do Coordenador
 * 
 * Este componente gerencia a visualização, filtros e geração de relatórios acadêmicos
 */
export default function RelatoriosAcademicosDashboard({
  mockRankingTurmas,
  cardVariants,
  TURMAS,
  TURNO_COLORS
}: RelatoriosAcademicosDashboardProps) {
  // Estado para os filtros de relatório
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [filtroTipoRelatorio, setFiltroTipoRelatorio] = useState("Notas e Frequência");
  
  // Estado para o modal de relatório detalhado
  const [modalRelatorioDetalhado, setModalRelatorioDetalhado] = useState<{
    titulo: string;
    tipo: string;
    dados: any;
    isOpen: boolean;
  }>({
    titulo: "",
    tipo: "",
    dados: null,
    isOpen: false
  });
  
  // Estado para modal de exportação
  const [modalExportacao, setModalExportacao] = useState({
    isOpen: false,
    formato: "pdf",
    incluirGraficos: true,
    incluirComentarios: false,
    enviarEmail: false
  });
  
  // Estado para a paginação de resultados
  const [paginaAtual, setPaginaAtual] = useState(1);
  const resultadosPorPagina = 7;
  
  // Mock de alunos para o relatório
  const mockAlunosRelatorio = [
    { aluno: "Lucas Silva", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.5, faltas: 2, status: "Regular" },
    { aluno: "Ana Souza", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.2, faltas: 0, status: "Regular" },
    { aluno: "Pedro Lima", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.1, faltas: 1, status: "Atenção" },
    { aluno: "Carla Mendes", turma: "2A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 5.8, faltas: 3, status: "Recuperação" },
    { aluno: "Rafael Costa", turma: "2B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.2, faltas: 1, status: "Regular" },
    { aluno: "Julia Ferreira", turma: "3A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.5, faltas: 0, status: "Regular" },
    { aluno: "Bruno Santos", turma: "3B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.8, faltas: 2, status: "Regular" },
    { aluno: "Camila Oliveira", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 7.8, faltas: 1, status: "Regular" },
    { aluno: "Felipe Martins", turma: "2A", disciplina: "História", periodo: "1º Bimestre", nota: 6.5, faltas: 4, status: "Atenção" },
    { aluno: "Mariana Alves", turma: "3A", disciplina: "Geografia", periodo: "1º Bimestre", nota: 8.0, faltas: 0, status: "Regular" },
  ];
  
  // Filtragem de alunos com base nos filtros selecionados
  const alunosFiltrados = mockAlunosRelatorio.filter(aluno => {
    const matchTurma = !filtroTurma || aluno.turma === filtroTurma;
    const matchDisciplina = !filtroDisciplina || aluno.disciplina === filtroDisciplina;
    const matchPeriodo = !filtroPeriodo || aluno.periodo === filtroPeriodo;
    return matchTurma && matchDisciplina && matchPeriodo;
  });
  
  // Paginação
  const totalPaginas = Math.ceil(alunosFiltrados.length / resultadosPorPagina);
  const alunosPaginados = alunosFiltrados.slice(
    (paginaAtual - 1) * resultadosPorPagina,
    paginaAtual * resultadosPorPagina
  );
  
  // Função para gerar relatório com base nos filtros
  const gerarRelatorio = () => {
    toast.success("Relatório gerado com os filtros selecionados");
  };
  
  // Função para abrir o modal de relatório detalhado
  const abrirRelatorioDetalhado = (titulo: string, tipo: string, dados: any) => {
    setModalRelatorioDetalhado({
      titulo,
      tipo,
      dados,
      isOpen: true
    });
  };
  
  // Função para fechar o modal de relatório detalhado
  const fecharRelatorioDetalhado = () => {
    setModalRelatorioDetalhado(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  // Função para abrir o modal de exportação
  const abrirModalExportacao = () => {
    setModalExportacao(prev => ({
      ...prev,
      isOpen: true
    }));
  };
  
  // Função para fechar o modal de exportação
  const fecharModalExportacao = () => {
    setModalExportacao(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  // Função para exportar o relatório
  const exportarRelatorio = () => {
    toast.success(`Relatório exportado em formato ${modalExportacao.formato.toUpperCase()}`);
    fecharModalExportacao();
  };
  
  return (
    <motion.div
      key="relatorios"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cabeçalho da seção */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-700">Relatórios Acadêmicos</h2>
        <div className="flex gap-2">
          <Button 
            className="flex gap-2" 
            onClick={abrirModalExportacao}
          >
            <Download className="w-5 h-5" /> Exportar Relatório
          </Button>
        </div>
      </div>
      
      {/* Filtros de relatório */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-indigo-700 mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filtros do Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
            <select 
              className="w-full border rounded-lg px-3 py-2"
              value={filtroTurma}
              onChange={e => setFiltroTurma(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {TURMAS.map(turma => (
                <option key={turma} value={turma}>{turma}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
            <select 
              className="w-full border rounded-lg px-3 py-2"
              value={filtroDisciplina}
              onChange={e => setFiltroDisciplina(e.target.value)}
            >
              <option value="">Todas as disciplinas</option>
              <option value="Matemática">Matemática</option>
              <option value="Português">Português</option>
              <option value="História">História</option>
              <option value="Geografia">Geografia</option>
              <option value="Ciências">Ciências</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select 
              className="w-full border rounded-lg px-3 py-2"
              value={filtroPeriodo}
              onChange={e => setFiltroPeriodo(e.target.value)}
            >
              <option value="">Todos os períodos</option>
              <option value="1º Bimestre">1º Bimestre</option>
              <option value="2º Bimestre">2º Bimestre</option>
              <option value="3º Bimestre">3º Bimestre</option>
              <option value="4º Bimestre">4º Bimestre</option>
              <option value="Ano Letivo">Ano Letivo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
            <select 
              className="w-full border rounded-lg px-3 py-2"
              value={filtroTipoRelatorio}
              onChange={e => setFiltroTipoRelatorio(e.target.value)}
            >
              <option value="Notas e Frequência">Notas e Frequência</option>
              <option value="Desempenho por Disciplina">Desempenho por Disciplina</option>
              <option value="Evolução do Aluno">Evolução do Aluno</option>
              <option value="Comparativo entre Turmas">Comparativo entre Turmas</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setFiltroTurma("");
              setFiltroDisciplina("");
              setFiltroPeriodo("");
              setFiltroTipoRelatorio("Notas e Frequência");
              setPaginaAtual(1);
            }}
            className="flex gap-2 items-center"
          >
            <XCircle className="w-4 h-4" /> Limpar Filtros
          </Button>
          <Button 
            onClick={gerarRelatorio}
            className="flex gap-2 items-center"
          >
            <FileText className="w-4 h-4" /> Gerar Relatório
          </Button>
        </div>
      </div>
      
      {/* Tabela de dados do relatório */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-indigo-700 flex items-center gap-2">
            <FileText className="h-5 w-5" /> {filtroTipoRelatorio}
          </h3>
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar no relatório..."
              className="border rounded-lg pl-10 pr-4 py-2 w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-indigo-700 border-b">
                <th className="py-3 px-2">Aluno</th>
                <th className="py-3 px-2">Turma</th>
                <th className="py-3 px-2">Disciplina</th>
                <th className="py-3 px-2">Período</th>
                <th className="py-3 px-2">Nota</th>
                <th className="py-3 px-2">Faltas</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {alunosPaginados.length > 0 ? (
                alunosPaginados.map((aluno, index) => (
                  <tr 
                    key={index} 
                    className="border-b last:border-b-0 hover:bg-indigo-50 cursor-pointer transition-colors"
                    onClick={() => abrirRelatorioDetalhado(
                      `Relatório de ${aluno.aluno}`, 
                      "aluno",
                      aluno
                    )}
                  >
                    <td className="py-3 px-2 font-medium">{aluno.aluno}</td>
                    <td className="py-3 px-2">{aluno.turma}</td>
                    <td className="py-3 px-2">{aluno.disciplina}</td>
                    <td className="py-3 px-2">{aluno.periodo}</td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${
                        aluno.nota < 6.0 ? 'text-red-600' : 
                        aluno.nota < 7.0 ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>
                        {aluno.nota.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2">{aluno.faltas}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        aluno.status === 'Regular' ? 'bg-green-100 text-green-700' : 
                        aluno.status === 'Atenção' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    Nenhum resultado encontrado com os filtros atuais
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {alunosFiltrados.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Mostrando {alunosPaginados.length} de {alunosFiltrados.length} resultados
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                <Button 
                  key={pagina}
                  variant="outline" 
                  size="sm" 
                  className={`px-3 ${paginaAtual === pagina ? 'bg-indigo-50' : ''}`}
                  onClick={() => setPaginaAtual(pagina)}
                >
                  {pagina}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Gráficos e relatórios pré-configurados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" /> Desempenho por Disciplina
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { disciplina: "Mat", media: 7.4 },
                { disciplina: "Port", media: 7.9 },
                { disciplina: "Hist", media: 7.6 },
                { disciplina: "Geo", media: 8.1 },
                { disciplina: "Ciên", media: 8.2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="disciplina" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="media" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]} 
                  name="Média Geral" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              className="w-full"
              onClick={() => abrirRelatorioDetalhado(
                "Relatório Detalhado de Desempenho por Disciplina", 
                "grafico",
                { tipo: "desempenho" }
              )}
            >
              Ver Relatório Detalhado
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
            <FileText className="h-5 w-5 text-indigo-600" /> Relatórios Pré-configurados
          </h3>
          
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => abrirRelatorioDetalhado(
                "Alunos em Recuperação", 
                "lista",
                { filtro: "recuperacao" }
              )}
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <span>Alunos em Recuperação</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => abrirRelatorioDetalhado(
                "Relatório de Frequência Baixa", 
                "lista",
                { filtro: "frequencia" }
              )}
            >
              <div className="flex items-center">
                <User className="w-5 h-5 text-amber-500 mr-3" />
                <span>Frequência Baixa</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => abrirRelatorioDetalhado(
                "Boletim Bimestral", 
                "boletim",
                { periodo: "1º Bimestre" }
              )}
            >
              <div className="flex items-center">
                <Book className="w-5 h-5 text-green-500 mr-3" />
                <span>Boletim Bimestral</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => abrirRelatorioDetalhado(
                "Comparativo entre Turmas", 
                "comparativo",
                { turmas: TURMAS }
              )}
            >
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-500 mr-3" />
                <span>Comparativo entre Turmas</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </button>
            
            <button 
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => abrirRelatorioDetalhado(
                "Estatísticas Gerais", 
                "estatisticas",
                { periodo: "Ano Letivo" }
              )}
            >
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 text-purple-500 mr-3" />
                <span>Estatísticas Gerais</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Modal de Relatório Detalhado */}
      {modalRelatorioDetalhado.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                <FileText className="w-5 h-5 mr-2" /> 
                {modalRelatorioDetalhado.titulo}
              </h3>
              <button onClick={fecharRelatorioDetalhado} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Conteúdo do relatório baseado no tipo */}
              {modalRelatorioDetalhado.tipo === "aluno" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                      {modalRelatorioDetalhado.dados.aluno.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{modalRelatorioDetalhado.dados.aluno}</h2>
                      <div className="text-sm text-gray-500">
                        Turma {modalRelatorioDetalhado.dados.turma} • {modalRelatorioDetalhado.dados.disciplina}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        modalRelatorioDetalhado.dados.status === 'Regular' ? 'bg-green-100 text-green-700' : 
                        modalRelatorioDetalhado.dados.status === 'Atenção' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {modalRelatorioDetalhado.dados.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-sm text-indigo-600 uppercase font-medium mb-1">Nota</div>
                      <div className={`text-2xl font-bold ${
                        modalRelatorioDetalhado.dados.nota < 6.0 ? 'text-red-600' : 
                        modalRelatorioDetalhado.dados.nota < 7.0 ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>
                        {modalRelatorioDetalhado.dados.nota.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {modalRelatorioDetalhado.dados.periodo}
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-sm text-indigo-600 uppercase font-medium mb-1">Faltas</div>
                      <div className={`text-2xl font-bold ${
                        modalRelatorioDetalhado.dados.faltas > 3 ? 'text-red-600' : 
                        modalRelatorioDetalhado.dados.faltas > 1 ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>
                        {modalRelatorioDetalhado.dados.faltas}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        No período
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-sm text-indigo-600 uppercase font-medium mb-1">Classificação</div>
                      <div className="text-2xl font-bold text-indigo-700">
                        8º
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Em {modalRelatorioDetalhado.dados.turma}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg mb-2">Histórico de Desempenho</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { bimestre: "1º Bim", nota: 7.5, media: 7.2 },
                          { bimestre: "2º Bim", nota: 7.8, media: 7.3 },
                          { bimestre: "3º Bim", nota: 8.2, media: 7.4 },
                          { bimestre: "4º Bim", nota: 8.0, media: 7.5 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="bimestre" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="nota" name="Nota do Aluno" fill="#6366f1" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="media" name="Média da Turma" fill="#f59e42" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg mb-2">Observações</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-700">
                      <p>Aluno apresenta bom desempenho em {modalRelatorioDetalhado.dados.disciplina}. 
                      Participativo nas aulas e entrega as atividades no prazo.</p>
                      <p className="mt-2">Recomenda-se continuar incentivando sua participação em projetos 
                      extracurriculares para desenvolver ainda mais suas habilidades.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={fecharRelatorioDetalhado}>
                      Fechar
                    </Button>
                    <Button onClick={() => {
                      toast.success(`Gerando boletim completo para ${modalRelatorioDetalhado.dados.aluno}`);
                      fecharRelatorioDetalhado();
                    }}>
                      Gerar Boletim Completo
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Outros tipos de relatório renderizam templates diferentes */}
              {modalRelatorioDetalhado.tipo === "lista" && (
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Este relatório lista todos os alunos que atendem aos critérios 
                    especificados, permitindo ações em massa e acompanhamento individual.
                  </p>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-indigo-700 font-medium mb-2">
                      <Filter className="w-4 h-4" /> Filtros aplicados
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Tipo de filtro</div>
                        <div className="font-medium">
                          {modalRelatorioDetalhado.dados.filtro === "recuperacao" ? "Alunos em Recuperação" : "Frequência Baixa"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Critério</div>
                        <div className="font-medium">
                          {modalRelatorioDetalhado.dados.filtro === "recuperacao" ? "Média < 6.0" : "Faltas > 3"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-indigo-700 border-b">
                          <th className="py-3 px-2">Aluno</th>
                          <th className="py-3 px-2">Turma</th>
                          <th className="py-3 px-2">Disciplina</th>
                          <th className="py-3 px-2">
                            {modalRelatorioDetalhado.dados.filtro === "recuperacao" ? "Nota" : "Faltas"}
                          </th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAlunosRelatorio
                          .filter(a => modalRelatorioDetalhado.dados.filtro === "recuperacao" ? 
                            a.nota < 6.0 : a.faltas > 2)
                          .map((aluno, idx) => (
                            <tr key={idx} className="border-b last:border-b-0 hover:bg-indigo-50">
                              <td className="py-3 px-2 font-medium">{aluno.aluno}</td>
                              <td className="py-3 px-2">{aluno.turma}</td>
                              <td className="py-3 px-2">{aluno.disciplina}</td>
                              <td className="py-3 px-2">
                                {modalRelatorioDetalhado.dados.filtro === "recuperacao" ? (
                                  <span className="text-red-600 font-medium">{aluno.nota.toFixed(1)}</span>
                                ) : (
                                  <span className="text-amber-600 font-medium">{aluno.faltas}</span>
                                )}
                              </td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  aluno.status === 'Regular' ? 'bg-green-100 text-green-700' : 
                                  aluno.status === 'Atenção' ? 'bg-amber-100 text-amber-700' : 
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {aluno.status}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => toast.success(`Ação para ${aluno.aluno}`)}
                                >
                                  Detalhes
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("Notificação enviada aos responsáveis")}
                    >
                      Notificar Responsáveis
                    </Button>
                    <Button onClick={abrirModalExportacao}>
                      Exportar Relatório
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Relatório Detalhado de Desempenho por Disciplina */}
              {modalRelatorioDetalhado.tipo === "grafico" && modalRelatorioDetalhado.dados?.tipo === "desempenho" && (
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Este relatório apresenta o desempenho detalhado dos alunos por disciplina, 
                    permitindo identificar áreas que precisam de atenção pedagógica e destacar pontos fortes.
                  </p>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-indigo-700 font-medium mb-2">
                      <Filter className="w-4 h-4" /> Período analisado
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Período</div>
                        <div className="font-medium">1º Bimestre</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Consolidado
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-lg mb-3 text-indigo-700">Médias por Disciplina</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { disciplina: "Matemática", media: 7.4, mediaEscola: 7.2 },
                            { disciplina: "Português", media: 7.9, mediaEscola: 7.5 },
                            { disciplina: "História", media: 7.6, mediaEscola: 7.3 },
                            { disciplina: "Geografia", media: 8.1, mediaEscola: 7.6 },
                            { disciplina: "Ciências", media: 8.2, mediaEscola: 7.9 },
                            { disciplina: "Ed. Física", media: 8.7, mediaEscola: 8.5 },
                            { disciplina: "Artes", media: 8.5, mediaEscola: 8.2 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="disciplina" angle={-45} textAnchor="end" height={80} />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="media" name="Média Geral" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="mediaEscola" name="Média da Escola" fill="#f59e42" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg mb-3 text-indigo-700">Distribuição de Notas</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Matemática</span>
                            <span className="text-sm font-medium">7.4</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>25 alunos abaixo da média</span>
                            <span>105 alunos no total</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Português</span>
                            <span className="text-sm font-medium">7.9</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '79%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>18 alunos abaixo da média</span>
                            <span>105 alunos no total</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">História</span>
                            <span className="text-sm font-medium">7.6</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>21 alunos abaixo da média</span>
                            <span>105 alunos no total</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Geografia</span>
                            <span className="text-sm font-medium">8.1</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '81%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>14 alunos abaixo da média</span>
                            <span>105 alunos no total</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Ciências</span>
                            <span className="text-sm font-medium">8.2</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>12 alunos abaixo da média</span>
                            <span>105 alunos no total</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-3 text-indigo-700">Recomendações Pedagógicas</h4>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Intensificar o suporte em Matemática, que apresenta maior número de alunos abaixo da média.</li>
                      <li>Implementar atividades de reforço para os 25 alunos com dificuldades em Matemática.</li>
                      <li>Reconhecer e compartilhar as práticas bem-sucedidas de Geografia e Ciências.</li>
                      <li>Realizar avaliação diagnóstica para identificar lacunas específicas de aprendizagem.</li>
                      <li>Considerar formação continuada para professores de disciplinas com desempenho abaixo da média da escola.</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("Relatório compartilhado com os professores")}
                      className="flex gap-2 items-center"
                    >
                      <Users className="w-4 h-4" /> Compartilhar com Professores
                    </Button>
                    <Button 
                      onClick={abrirModalExportacao}
                      className="flex gap-2 items-center"
                    >
                      <Download className="w-4 h-4" /> Exportar Relatório
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Boletim Bimestral */}
              {modalRelatorioDetalhado.tipo === "boletim" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Boletim Bimestral</h3>
                      <p className="text-gray-500">{modalRelatorioDetalhado.dados.periodo}</p>
                    </div>
                    <div className="flex gap-2">
                      <select className="border rounded-lg p-2">
                        <option>Selecionar Aluno</option>
                        {mockAlunosRelatorio.map((a, i) => (
                          <option key={i}>{a.aluno}</option>
                        ))}
                      </select>
                      <select className="border rounded-lg p-2">
                        <option>Selecionar Turma</option>
                        {TURMAS.map((t, i) => (
                          <option key={i}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-5 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                          LS
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Lucas Silva</h3>
                          <p className="text-gray-500">RA: 20230087 • Turma 1A • Manhã</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center md:items-end">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                          <span className="text-gray-500">Média Geral:</span>
                          <span className="text-xl font-bold text-green-600">7.8</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Data de emissão: {format(new Date(), 'dd/MM/yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-indigo-100">
                            <th className="py-3 px-4 rounded-tl-lg">Disciplina</th>
                            <th className="py-3 px-4 text-center">Nota</th>
                            <th className="py-3 px-4 text-center">Faltas</th>
                            <th className="py-3 px-4 text-center">Frequência</th>
                            <th className="py-3 px-4 text-center rounded-tr-lg">Situação</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-indigo-100">
                            <td className="py-4 px-4 font-medium">Matemática</td>
                            <td className="py-4 px-4 text-center font-bold text-amber-600">6.5</td>
                            <td className="py-4 px-4 text-center">2</td>
                            <td className="py-4 px-4 text-center">90%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Atenção</span>
                            </td>
                          </tr>
                          <tr className="border-b border-indigo-100">
                            <td className="py-4 px-4 font-medium">Português</td>
                            <td className="py-4 px-4 text-center font-bold text-green-600">8.0</td>
                            <td className="py-4 px-4 text-center">0</td>
                            <td className="py-4 px-4 text-center">100%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Regular</span>
                            </td>
                          </tr>
                          <tr className="border-b border-indigo-100">
                            <td className="py-4 px-4 font-medium">História</td>
                            <td className="py-4 px-4 text-center font-bold text-green-600">7.5</td>
                            <td className="py-4 px-4 text-center">1</td>
                            <td className="py-4 px-4 text-center">95%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Regular</span>
                            </td>
                          </tr>
                          <tr className="border-b border-indigo-100">
                            <td className="py-4 px-4 font-medium">Geografia</td>
                            <td className="py-4 px-4 text-center font-bold text-green-600">8.5</td>
                            <td className="py-4 px-4 text-center">0</td>
                            <td className="py-4 px-4 text-center">100%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Regular</span>
                            </td>
                          </tr>
                          <tr className="border-b border-indigo-100">
                            <td className="py-4 px-4 font-medium">Ciências</td>
                            <td className="py-4 px-4 text-center font-bold text-red-600">5.5</td>
                            <td className="py-4 px-4 text-center">3</td>
                            <td className="py-4 px-4 text-center">85%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Recuperação</span>
                            </td>
                          </tr>
                          <tr className="border-b border-indigo-100">
                            <td className="py-4 px-4 font-medium">Ed. Física</td>
                            <td className="py-4 px-4 text-center font-bold text-green-600">9.0</td>
                            <td className="py-4 px-4 text-center">0</td>
                            <td className="py-4 px-4 text-center">100%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Regular</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 font-medium">Artes</td>
                            <td className="py-4 px-4 text-center font-bold text-green-600">8.5</td>
                            <td className="py-4 px-4 text-center">1</td>
                            <td className="py-4 px-4 text-center">95%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Regular</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-lg mb-2 text-indigo-700">Observações do Professor</h4>
                      <p className="text-gray-700">
                        Lucas é um aluno participativo e demonstra interesse nas aulas. 
                        Precisa melhorar o desempenho em Ciências e dedicar mais tempo aos estudos de Matemática.
                        Recomendo atividades de reforço para as disciplinas com notas abaixo de 7.0.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-lg mb-2 text-indigo-700">Sugestões aos Responsáveis</h4>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Acompanhar as atividades de Ciências e Matemática</li>
                        <li>Incentivar a leitura e pesquisa em casa</li>
                        <li>Participar das reuniões de pais e mestres</li>
                        <li>Verificar a realização das atividades de recuperação</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("Boletim enviado por e-mail aos responsáveis")}
                      className="flex gap-2 items-center"
                    >
                      <User className="w-4 h-4" /> Enviar aos Responsáveis
                    </Button>
                    <Button 
                      onClick={abrirModalExportacao}
                      className="flex gap-2 items-center"
                    >
                      <Download className="w-4 h-4" /> Imprimir Boletim
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Comparativo entre Turmas */}
              {modalRelatorioDetalhado.tipo === "comparativo" && (
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Este relatório apresenta um comparativo de desempenho entre turmas, 
                    considerando indicadores como média geral, frequência e aproveitamento.
                  </p>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-indigo-700 font-medium mb-2">
                      <Filter className="w-4 h-4" /> Filtros aplicados
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Período</div>
                        <div className="font-medium">1º Bimestre</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Turmas</div>
                        <div className="font-medium">Todas ({TURMAS.length})</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Critérios</div>
                        <div className="font-medium">Notas, frequência e aproveitamento</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={TURMAS.map(turma => ({
                          name: turma,
                          media: (Math.random() * 2 + 6).toFixed(1),
                          frequencia: (Math.random() * 15 + 85).toFixed(1),
                          aproveitamento: (Math.random() * 25 + 70).toFixed(1),
                        }))}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="media" name="Média Geral (0-10)" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="frequencia" name="Frequência (%)" fill="#22c55e" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="aproveitamento" name="Aproveitamento (%)" fill="#f59e42" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-indigo-50 text-indigo-700">
                          <th className="py-3 px-4">Turma</th>
                          <th className="py-3 px-4 text-center">Média Geral</th>
                          <th className="py-3 px-4 text-center">Frequência</th>
                          <th className="py-3 px-4 text-center">Aproveitamento</th>
                          <th className="py-3 px-4 text-center">Ranking</th>
                          <th className="py-3 px-4 text-center">Tendência</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TURMAS.map((turma, index) => {
                          const media = (Math.random() * 2 + 6).toFixed(1);
                          const frequencia = (Math.random() * 15 + 85).toFixed(1);
                          const aproveitamento = (Math.random() * 25 + 70).toFixed(1);
                          
                          return (
                            <tr key={index} className="border-t hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{turma}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-medium ${
                                  Number(media) < 6.0 ? 'text-red-600' : 
                                  Number(media) < 7.0 ? 'text-amber-600' : 
                                  'text-green-600'
                                }`}>
                                  {media}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-medium ${
                                  Number(frequencia) < 85 ? 'text-red-600' : 
                                  Number(frequencia) < 90 ? 'text-amber-600' : 
                                  'text-green-600'
                                }`}>
                                  {frequencia}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-medium ${
                                  Number(aproveitamento) < 75 ? 'text-red-600' : 
                                  Number(aproveitamento) < 85 ? 'text-amber-600' : 
                                  'text-green-600'
                                }`}>
                                  {aproveitamento}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="font-medium">{index + 1}º</span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {index % 3 === 0 ? (
                                  <span className="text-green-600">↑ Subindo</span>
                                ) : index % 3 === 1 ? (
                                  <span className="text-amber-600">→ Estável</span>
                                ) : (
                                  <span className="text-red-600">↓ Caindo</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-3 text-indigo-700">Insights e Recomendações</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <h5 className="font-medium">Melhor desempenho</h5>
                        </div>
                        <p className="text-sm text-gray-700">
                          Turma {TURMAS[0]} apresenta o melhor desempenho geral, com média de 8.2
                          e frequência de 97%. Recomenda-se identificar e compartilhar as práticas bem-sucedidas.
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          <h5 className="font-medium">Atenção necessária</h5>
                        </div>
                        <p className="text-sm text-gray-700">
                          Turma {TURMAS[TURMAS.length-1]} apresenta tendência de queda e aproveitamento
                          abaixo da média escolar. Recomenda-se intervenção pedagógica imediata.
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                          <h5 className="font-medium">Maior evolução</h5>
                        </div>
                        <p className="text-sm text-gray-700">
                          Turma {TURMAS[2]} apresenta a maior evolução positiva em relação ao bimestre anterior,
                          com aumento de 15% no aproveitamento e 8% na frequência.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("Relatório comparativo apresentado em reunião pedagógica")}
                      className="flex gap-2 items-center"
                    >
                      <Users className="w-4 h-4" /> Agendar Apresentação
                    </Button>
                    <Button 
                      onClick={abrirModalExportacao}
                      className="flex gap-2 items-center"
                    >
                      <Download className="w-4 h-4" /> Exportar Comparativo
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Estatísticas Gerais */}
              {modalRelatorioDetalhado.tipo === "estatisticas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-indigo-700">Estatísticas Gerais do {modalRelatorioDetalhado.dados.periodo}</h3>
                    <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-sm font-medium">
                      Atualizado em {format(new Date(), 'dd/MM/yyyy')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col">
                      <div className="text-sm text-gray-500 mb-1">Total de Alunos</div>
                      <div className="text-2xl font-bold text-indigo-700">427</div>
                      <div className="mt-auto pt-2 text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Aumento de 3% desde o início do ano
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col">
                      <div className="text-sm text-gray-500 mb-1">Média Geral</div>
                      <div className="text-2xl font-bold text-indigo-700">7.6</div>
                      <div className="mt-auto pt-2 text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Aumento de 0.2 desde o último bimestre
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col">
                      <div className="text-sm text-gray-500 mb-1">Frequência Média</div>
                      <div className="text-2xl font-bold text-indigo-700">92%</div>
                      <div className="mt-auto pt-2 text-xs text-amber-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 rotate-90" /> Estável nos últimos 3 meses
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col">
                      <div className="text-sm text-gray-500 mb-1">Taxa de Aprovação</div>
                      <div className="text-2xl font-bold text-indigo-700">87%</div>
                      <div className="mt-auto pt-2 text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Aumento de 5% em relação ao ano anterior
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <h4 className="font-medium text-lg mb-3 text-indigo-700">Distribuição de Alunos por Faixa de Nota</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { faixa: "0.0 - 3.0", alunos: 12 },
                            { faixa: "3.1 - 5.0", alunos: 38 },
                            { faixa: "5.1 - 7.0", alunos: 156 },
                            { faixa: "7.1 - 8.0", alunos: 110 },
                            { faixa: "8.1 - 9.0", alunos: 78 },
                            { faixa: "9.1 - 10.0", alunos: 33 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="faixa" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="alunos" name="Número de Alunos" fill="#6366f1" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <h4 className="font-medium text-lg mb-3 text-indigo-700">Desempenho por Ano/Série</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { serie: "1º Ano", media: 7.2, frequencia: 93 },
                            { serie: "2º Ano", media: 7.8, frequencia: 91 },
                            { serie: "3º Ano", media: 7.6, frequencia: 94 },
                            { serie: "4º Ano", media: 7.9, frequencia: 92 },
                            { serie: "5º Ano", media: 7.5, frequencia: 90 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="serie" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="media" name="Média Geral" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="frequencia" name="Frequência (%)" fill="#22c55e" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h4 className="font-medium text-lg mb-3 text-indigo-700">Análise de Aproveitamento por Disciplina</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-indigo-50 text-indigo-700">
                            <th className="py-3 px-4">Disciplina</th>
                            <th className="py-3 px-4 text-center">Média</th>
                            <th className="py-3 px-4 text-center">Aprovados</th>
                            <th className="py-3 px-4 text-center">Em Recuperação</th>
                            <th className="py-3 px-4 text-center">Reprovados</th>
                            <th className="py-3 px-4 text-center">Taxa de Aprovação</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">Matemática</td>
                            <td className="py-3 px-4 text-center font-medium">7.2</td>
                            <td className="py-3 px-4 text-center text-green-600">356</td>
                            <td className="py-3 px-4 text-center text-amber-600">52</td>
                            <td className="py-3 px-4 text-center text-red-600">19</td>
                            <td className="py-3 px-4 text-center">83%</td>
                          </tr>
                          <tr className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">Português</td>
                            <td className="py-3 px-4 text-center font-medium">7.6</td>
                            <td className="py-3 px-4 text-center text-green-600">375</td>
                            <td className="py-3 px-4 text-center text-amber-600">40</td>
                            <td className="py-3 px-4 text-center text-red-600">12</td>
                            <td className="py-3 px-4 text-center">88%</td>
                          </tr>
                          <tr className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">História</td>
                            <td className="py-3 px-4 text-center font-medium">7.8</td>
                            <td className="py-3 px-4 text-center text-green-600">381</td>
                            <td className="py-3 px-4 text-center text-amber-600">35</td>
                            <td className="py-3 px-4 text-center text-red-600">11</td>
                            <td className="py-3 px-4 text-center">89%</td>
                          </tr>
                          <tr className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">Geografia</td>
                            <td className="py-3 px-4 text-center font-medium">7.9</td>
                            <td className="py-3 px-4 text-center text-green-600">389</td>
                            <td className="py-3 px-4 text-center text-amber-600">30</td>
                            <td className="py-3 px-4 text-center text-red-600">8</td>
                            <td className="py-3 px-4 text-center">91%</td>
                          </tr>
                          <tr className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">Ciências</td>
                            <td className="py-3 px-4 text-center font-medium">7.5</td>
                            <td className="py-3 px-4 text-center text-green-600">368</td>
                            <td className="py-3 px-4 text-center text-amber-600">42</td>
                            <td className="py-3 px-4 text-center text-red-600">17</td>
                            <td className="py-3 px-4 text-center">86%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-3 text-indigo-700">Conclusões e Recomendações</h4>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <strong>Pontos Positivos:</strong> A escola apresenta uma taxa de aprovação satisfatória de 87%, 
                        com tendência de crescimento. O 4º Ano se destaca com o melhor desempenho médio (7.9).
                      </p>
                      <p>
                        <strong>Pontos de Atenção:</strong> Matemática continua sendo a disciplina com menor taxa de aprovação (83%). 
                        O 5º Ano apresenta a menor frequência média (90%).
                      </p>
                      <p>
                        <strong>Recomendações:</strong> Implementar programa de reforço focado em Matemática, especialmente 
                        para os 52 alunos em recuperação. Investigar as causas da menor frequência no 5º Ano e 
                        desenvolver estratégias de engajamento.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("Estatísticas compartilhadas com a direção escolar")}
                      className="flex gap-2 items-center"
                    >
                      <Users className="w-4 h-4" /> Compartilhar com Direção
                    </Button>
                    <Button 
                      onClick={abrirModalExportacao}
                      className="flex gap-2 items-center"
                    >
                      <Download className="w-4 h-4" /> Exportar Estatísticas
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Renderização simplificada para outros tipos de relatório */}
              {(modalRelatorioDetalhado.tipo !== "aluno" && 
                modalRelatorioDetalhado.tipo !== "lista" && 
                modalRelatorioDetalhado.tipo !== "grafico" &&
                modalRelatorioDetalhado.tipo !== "boletim" &&
                modalRelatorioDetalhado.tipo !== "comparativo" &&
                modalRelatorioDetalhado.tipo !== "estatisticas"
              ) && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-lg text-center">
                    <FileText className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {modalRelatorioDetalhado.titulo}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Este relatório detalhado contém informações importantes para acompanhamento 
                      acadêmico e tomada de decisões pedagógicas.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => toast.success("Gerando prévia do relatório")}
                      >
                        Visualizar Prévia
                      </Button>
                      <Button onClick={abrirModalExportacao}>
                        Exportar Relatório
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Modal de Exportação */}
      {modalExportacao.isOpen && (
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
                <Download className="w-5 h-5 mr-2" /> Exportar Relatório
              </h3>
              <button onClick={fecharModalExportacao} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato do Arquivo
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex-1">
                    <input 
                      type="radio" 
                      name="formato" 
                      value="pdf" 
                      checked={modalExportacao.formato === "pdf"}
                      onChange={() => setModalExportacao({...modalExportacao, formato: "pdf"})}
                    />
                    <span className="font-medium">PDF</span>
                  </label>
                  <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex-1">
                    <input 
                      type="radio" 
                      name="formato" 
                      value="excel" 
                      checked={modalExportacao.formato === "excel"}
                      onChange={() => setModalExportacao({...modalExportacao, formato: "excel"})}
                    />
                    <span className="font-medium">Excel</span>
                  </label>
                  <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex-1">
                    <input 
                      type="radio" 
                      name="formato" 
                      value="csv" 
                      checked={modalExportacao.formato === "csv"}
                      onChange={() => setModalExportacao({...modalExportacao, formato: "csv"})}
                    />
                    <span className="font-medium">CSV</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opções de Conteúdo
                </label>
                <div className="space-y-2 border rounded-lg p-3">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={modalExportacao.incluirGraficos}
                      onChange={() => setModalExportacao({
                        ...modalExportacao, 
                        incluirGraficos: !modalExportacao.incluirGraficos
                      })}
                    />
                    <span className="text-sm">Incluir gráficos e visualizações</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={modalExportacao.incluirComentarios}
                      onChange={() => setModalExportacao({
                        ...modalExportacao, 
                        incluirComentarios: !modalExportacao.incluirComentarios
                      })}
                    />
                    <span className="text-sm">Incluir comentários e observações</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={modalExportacao.enviarEmail}
                      onChange={() => setModalExportacao({
                        ...modalExportacao, 
                        enviarEmail: !modalExportacao.enviarEmail
                      })}
                    />
                    <span className="text-sm">Enviar cópia por e-mail</span>
                  </label>
                </div>
              </div>
              
              {modalExportacao.enviarEmail && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail para envio
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Digite o e-mail..."
                    defaultValue="coordenador@escola.com"
                  />
                </div>
              )}
              
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={fecharModalExportacao}>
                  Cancelar
                </Button>
                <Button 
                  onClick={exportarRelatorio}
                  className="flex gap-2 items-center"
                >
                  <Download className="w-4 h-4" /> Exportar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 