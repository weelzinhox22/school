import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  BookOpen, 
  FileText, 
  Search, 
  Download,
  FileBarChart,
  Filter,
  Calendar
} from "lucide-react";
import jsPDF from "jspdf";
import Papa from "papaparse";

// Dados mockados para desenvolvimento
// Serão substituídos por chamadas à API no backend
const TURMAS = ["1A", "1B", "2A", "2B", "3A", "3B"];
const DISCIPLINAS = ["Matemática", "Português", "História", "Geografia", "Ciências"];
const PERIODOS = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre", "Ano Letivo"];

const mockRelatorio = [
  { aluno: "Lucas Silva", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.5, faltas: 2 },
  { aluno: "Ana Souza", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.2, faltas: 0 },
  { aluno: "Pedro Lima", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.1, faltas: 1 },
  { aluno: "Lucas Silva", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 7.9, faltas: 0 },
  { aluno: "Ana Souza", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 8.7, faltas: 0 },
  { aluno: "Pedro Lima", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 5.8, faltas: 2 },
  { aluno: "Lucas Silva", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.8, faltas: 3 },
  { aluno: "Ana Souza", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.2, faltas: 1 },
  { aluno: "Pedro Lima", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.0, faltas: 0 },
  { aluno: "Carla Oliveira", turma: "2A", disciplina: "Português", periodo: "2º Bimestre", nota: 9.1, faltas: 1 },
  { aluno: "João Santos", turma: "2A", disciplina: "Português", periodo: "2º Bimestre", nota: 7.6, faltas: 2 },
  { aluno: "Mariana Costa", turma: "2A", disciplina: "Português", periodo: "2º Bimestre", nota: 8.3, faltas: 0 },
  { aluno: "Carla Oliveira", turma: "2A", disciplina: "História", periodo: "2º Bimestre", nota: 8.5, faltas: 0 },
  { aluno: "João Santos", turma: "2A", disciplina: "História", periodo: "2º Bimestre", nota: 6.9, faltas: 3 },
  { aluno: "Mariana Costa", turma: "2A", disciplina: "História", periodo: "2º Bimestre", nota: 7.4, faltas: 1 },
];

// Tipos de relatórios disponíveis
const TIPOS_RELATORIO = [
  "Desempenho por Aluno", 
  "Desempenho por Turma", 
  "Frequência", 
  "Boletim Completo"
];

/**
 * Componente de Gestão de Relatórios
 * 
 * Este componente permite visualizar, filtrar e exportar relatórios acadêmicos,
 * incluindo notas, frequência e outros indicadores de desempenho dos alunos.
 */
export default function GestaoRelatorios() {
  // Estados dos filtros
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("");
  const [tipoRelatorio, setTipoRelatorio] = useState(TIPOS_RELATORIO[0]);
  const [formatoExportacao, setFormatoExportacao] = useState("pdf");
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  // Filtrar dados do relatório com base nos filtros aplicados
  const dadosRelatorio = mockRelatorio.filter(r =>
    (!filtroTurma || r.turma === filtroTurma) &&
    (!filtroDisciplina || r.disciplina === filtroDisciplina) &&
    (!filtroPeriodo || r.periodo === filtroPeriodo) &&
    (!filtroAluno || r.aluno.toLowerCase().includes(filtroAluno.toLowerCase()))
  );

  // Calcular estatísticas
  const mediaNotas = !dadosRelatorio.length ? 0 : 
    parseFloat((dadosRelatorio.reduce((acc, item) => acc + item.nota, 0) / dadosRelatorio.length).toFixed(1));
  
  const mediaFaltas = !dadosRelatorio.length ? 0 : 
    parseFloat((dadosRelatorio.reduce((acc, item) => acc + item.faltas, 0) / dadosRelatorio.length).toFixed(1));

  /**
   * Função para exportar os dados do relatório em formato CSV
   */
  function exportarCSV() {
    if (dadosRelatorio.length === 0) {
      toast.error("Não há dados para exportar!");
      return;
    }

    // Cria o CSV a partir dos dados filtrados
    const csv = Papa.unparse(dadosRelatorio);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Criação e simulação de clique em link para download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Relatório exportado em CSV!");
  }

  /**
   * Função para exportar os dados do relatório em formato PDF
   */
  function exportarPDF() {
    if (dadosRelatorio.length === 0) {
      toast.error("Não há dados para exportar!");
      return;
    }

    // Criação do documento PDF
    const doc = new jsPDF();
    
    // Adiciona título e data ao PDF
    doc.setFontSize(16);
    doc.text("Relatório Escolar", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });
    
    // Adiciona informações dos filtros aplicados
    doc.setFontSize(12);
    let y = 30;
    if (filtroTurma) doc.text(`Turma: ${filtroTurma}`, 14, y); y += 7;
    if (filtroDisciplina) doc.text(`Disciplina: ${filtroDisciplina}`, 14, y); y += 7;
    if (filtroPeriodo) doc.text(`Período: ${filtroPeriodo}`, 14, y); y += 7;
    if (filtroAluno) doc.text(`Aluno: ${filtroAluno}`, 14, y); y += 7;
    
    // Cabeçalho da tabela
    y += 5;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y, 182, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Aluno", 16, y + 6);
    doc.text("Turma", 70, y + 6);
    doc.text("Disciplina", 90, y + 6);
    doc.text("Período", 130, y + 6);
    doc.text("Nota", 160, y + 6);
    doc.text("Faltas", 180, y + 6);
    
    // Corpo da tabela
    doc.setFont("helvetica", "normal");
    y += 8;
    dadosRelatorio.forEach((r, i) => {
      if (y > 270) { // Verifica se precisa de nova página
        doc.addPage();
        y = 20;
      }
      // Alterna cores para melhor legibilidade
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(14, y, 182, 8, "F");
      }
      doc.text(r.aluno, 16, y + 6);
      doc.text(r.turma, 70, y + 6);
      doc.text(r.disciplina, 90, y + 6);
      doc.text(r.periodo, 130, y + 6);
      doc.text(r.nota.toString(), 160, y + 6);
      doc.text(r.faltas.toString(), 180, y + 6);
      y += 8;
    });
    
    // Rodapé com estatísticas
    y += 10;
    doc.setFontSize(10);
    doc.text(`Média de notas: ${mediaNotas.toFixed(1)}`, 14, y);
    doc.text(`Média de faltas: ${mediaFaltas.toFixed(1)}`, 80, y);
    doc.text(`Total de registros: ${dadosRelatorio.length}`, 140, y);
    
    // Salva o PDF
    doc.save(`relatorio_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Relatório exportado em PDF!");
  }

  /**
   * Função para limpar todos os filtros
   */
  function limparFiltros() {
    setFiltroTurma("");
    setFiltroDisciplina("");
    setFiltroPeriodo("");
    setFiltroAluno("");
    toast.success("Filtros limpos!");
  }

  /**
   * Função para exportar o relatório no formato selecionado
   */
  function exportarRelatorio() {
    if (formatoExportacao === "pdf") {
      exportarPDF();
    } else {
      exportarCSV();
    }
  }

  // Adicionar listener para eventos disparados do Dashboard
  useEffect(() => {
    const handleDashboardAction = (event: CustomEvent) => {
      console.log("GestaoRelatorios: Evento recebido:", event.detail);
      const { section, action } = event.detail || {};
      if (section === 'relatorios' && action === 'export-relatorio') {
        console.log("GestaoRelatorios: Iniciando exportação de relatório");
        // Acionar exportação de relatório
        exportarRelatorio();
      }
    };

    // Adicionar evento
    console.log("GestaoRelatorios: Adicionando event listener para dashboard-action");
    document.addEventListener('dashboard-action', handleDashboardAction as EventListener);
    
    // Remover evento ao desmontar componente
    return () => {
      console.log("GestaoRelatorios: Removendo event listener para dashboard-action");
      document.removeEventListener('dashboard-action', handleDashboardAction as EventListener);
    };
  }, [exportarRelatorio]);

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <FileBarChart className="w-6 h-6 text-indigo-600" />
              Relatórios Personalizados
            </h2>
            <p className="text-gray-600">Visualize, filtre e exporte relatórios acadêmicos.</p>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card de quantidade de registros */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Registros</p>
            <p className="text-2xl font-bold text-gray-800">{dadosRelatorio.length}</p>
          </div>
        </motion.div>

        {/* Card de média de notas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-emerald-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Média de Notas</p>
            <p className="text-2xl font-bold text-gray-800">{mediaNotas.toFixed(1)}</p>
          </div>
        </motion.div>

        {/* Card de média de faltas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <Calendar className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Média de Faltas</p>
            <p className="text-2xl font-bold text-gray-800">{mediaFaltas.toFixed(1)}</p>
          </div>
        </motion.div>
      </div>

      {/* Painel principal de relatórios */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Barra de filtros principais */}
        <div className="border-b border-gray-100 p-4 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
              {/* Filtro de tipo de relatório */}
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                {TIPOS_RELATORIO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>

              {/* Filtro de turma */}
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={filtroTurma}
                onChange={(e) => setFiltroTurma(e.target.value)}
              >
                <option value="">Todas as turmas</option>
                {TURMAS.map(turma => (
                  <option key={turma} value={turma}>{turma}</option>
                ))}
              </select>

              {/* Filtro de disciplina */}
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={filtroDisciplina}
                onChange={(e) => setFiltroDisciplina(e.target.value)}
              >
                <option value="">Todas as disciplinas</option>
                {DISCIPLINAS.map(disciplina => (
                  <option key={disciplina} value={disciplina}>{disciplina}</option>
                ))}
              </select>

              {/* Filtro de período */}
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
              >
                <option value="">Todos os períodos</option>
                {PERIODOS.map(periodo => (
                  <option key={periodo} value={periodo}>{periodo}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              {/* Botão para mostrar filtros avançados */}
              <Button 
                variant="outline" 
                className="flex gap-2 items-center"
                onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
              >
                <Filter className="w-4 h-4" />
                {mostrarFiltrosAvancados ? "Ocultar Filtros" : "Filtros Avançados"}
              </Button>

              {/* Botão para limpar filtros */}
              <Button 
                variant="outline" 
                className="flex gap-2 items-center text-gray-600"
                onClick={limparFiltros}
              >
                Limpar
              </Button>
            </div>
          </div>

          {/* Filtros avançados (exibidos condicionalmente) */}
          {mostrarFiltrosAvancados && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro de aluno */}
                <div className="flex items-center gap-2 text-gray-400 bg-white border border-gray-200 rounded-lg p-2 px-3 shadow-sm">
                  <Search className="w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Buscar por nome do aluno..." 
                    className="border-none outline-none bg-transparent w-full text-gray-700"
                    value={filtroAluno}
                    onChange={(e) => setFiltroAluno(e.target.value)}
                  />
                </div>

                {/* Formato de exportação */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Formato de Exportação:</span>
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={formatoExportacao}
                    onChange={(e) => setFormatoExportacao(e.target.value)}
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV (Excel)</option>
                  </select>
                </div>

                {/* Botão para exportar relatório */}
                <div className="flex justify-end">
                  <Button 
                    onClick={exportarRelatorio}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex gap-2 items-center"
                    disabled={dadosRelatorio.length === 0}
                    data-action="export-relatorio"
                    id="btn-export-relatorio"
                    data-testid="export-relatorio-button"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Relatório
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tabela de relatório */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 font-semibold text-gray-700">Aluno</th>
                  <th className="py-3 font-semibold text-gray-700">Turma</th>
                  <th className="py-3 font-semibold text-gray-700">Disciplina</th>
                  <th className="py-3 font-semibold text-gray-700">Período</th>
                  <th className="py-3 font-semibold text-gray-700">Nota</th>
                  <th className="py-3 font-semibold text-gray-700">Faltas</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>Nenhum dado encontrado.</p>
                      <p className="text-sm">Ajuste os filtros para visualizar resultados.</p>
                    </td>
                  </tr>
                ) : dadosRelatorio.map((r, i) => (
                  <tr 
                    key={`${r.aluno}-${r.turma}-${r.disciplina}-${i}`} 
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 font-medium text-indigo-700">{r.aluno}</td>
                    <td className="py-3 text-gray-700">{r.turma}</td>
                    <td className="py-3 text-gray-700">{r.disciplina}</td>
                    <td className="py-3 text-gray-700">{r.periodo}</td>
                    <td className="py-3 text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.nota >= 7 ? 'bg-green-100 text-green-700' : 
                        r.nota >= 5 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.nota.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.faltas <= 1 ? 'bg-green-100 text-green-700' : 
                        r.faltas <= 3 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.faltas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé da tabela com paginação (futura implementação) */}
          {dadosRelatorio.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Exibindo {dadosRelatorio.length} registros
              </div>
              <div className="flex items-center gap-2">
                <span>Página 1 de 1</span>
                <Button variant="outline" size="sm" disabled>Anterior</Button>
                <Button variant="outline" size="sm" disabled>Próxima</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 