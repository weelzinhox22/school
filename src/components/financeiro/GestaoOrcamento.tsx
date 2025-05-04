import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { 
  Wallet, Download, TrendingUp, FileText, 
  CheckCircle, XCircle, PieChart as PieChartIcon
} from "lucide-react";

// Dados mock para orçamento (importados do arquivo original)
const mockOrcamento = [
  { categoria: "Salários", previsto: 620000, realizado: 635000 },
  { categoria: "Infraestrutura", previsto: 150000, realizado: 142000 },
  { categoria: "Material Didático", previsto: 85000, realizado: 90000 },
  { categoria: "Tecnologia", previsto: 95000, realizado: 110000 },
  { categoria: "Marketing", previsto: 50000, realizado: 46000 },
  { categoria: "Eventos", previsto: 45000, realizado: 38000 },
];

// Dados adicionais para gráficos de tendência
const mockHistoricoOrcamento = [
  { mes: "Jan", previsto: 170000, realizado: 168000 },
  { mes: "Fev", previsto: 170000, realizado: 175000 },
  { mes: "Mar", previsto: 175000, realizado: 180000 },
  { mes: "Abr", previsto: 175000, realizado: 172000 },
  { mes: "Mai", previsto: 180000, realizado: 184000 },
  { mes: "Jun", previsto: 180000, realizado: 178000 },
];

// Dados para orçamento por departamento
const mockOrcamentoDepartamentos = [
  { departamento: "Pedagógico", valor: 750000, percentual: 42 },
  { departamento: "Administrativo", valor: 420000, percentual: 24 },
  { departamento: "Marketing", valor: 180000, percentual: 10 },
  { departamento: "Operacional", valor: 320000, percentual: 18 },
  { departamento: "Outros", valor: 105000, percentual: 6 },
];

const ORCAMENTO_COLORS = { previsto: "#60a5fa", realizado: "#f97316" };
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

/**
 * Componente GestaoOrcamento
 * 
 * Este componente gerencia a visualização e análise do orçamento anual escolar,
 * exibindo comparativos entre valores previstos e realizados, análises de
 * desempenho por categoria, tendências históricas e projeções futuras.
 */
const GestaoOrcamento = () => {
  // Estado para filtrar o orçamento
  const [orcamentoFilter, setOrcamentoFilter] = useState("all");
  
  // Estado para alternar entre visualização anual e trimestral
  const [periodoVisualizacao, setPeriodoVisualizacao] = useState("anual");
  
  // Estado para controlar qual gráfico é mostrado no histórico
  const [historicoView, setHistoricoView] = useState("linha");
  
  // Filtrar dados do orçamento com base no filtro selecionado
  const dadosOrcamentoFiltrados = orcamentoFilter === "all" 
    ? mockOrcamento 
    : orcamentoFilter === "acima" 
      ? mockOrcamento.filter(item => item.realizado > item.previsto)
      : mockOrcamento.filter(item => item.realizado < item.previsto);
  
  // Calcular totais para análise
  const totalPrevisto = mockOrcamento.reduce((acc, item) => acc + item.previsto, 0);
  const totalRealizado = mockOrcamento.reduce((acc, item) => acc + item.realizado, 0);
  const diferenca = totalRealizado - totalPrevisto;
  const percentualDiferenca = ((diferenca / totalPrevisto) * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Indicador: Orçamento Total */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Orçamento Total</p>
              <p className="text-lg font-semibold text-gray-900">R$ {totalPrevisto.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Planejado para o ano
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: "100%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Meta anual estabelecida</p>
        </motion.div>

        {/* Indicador: Realizado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Realizado</p>
              <p className="text-lg font-semibold text-gray-900">R$ {totalRealizado.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Executado até o momento
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${Math.min((totalRealizado / totalPrevisto) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{((totalRealizado / totalPrevisto) * 100).toFixed(1)}% do orçado</p>
        </motion.div>

        {/* Indicador: Diferença */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${diferenca > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {diferenca > 0 
                ? <XCircle className="h-6 w-6 text-red-600" />
                : <CheckCircle className="h-6 w-6 text-green-600" />
              }
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Diferença</p>
              <p className="text-lg font-semibold text-gray-900">
                R$ {Math.abs(diferenca).toLocaleString('pt-BR')}
              </p>
              <p className={`text-xs ${diferenca > 0 ? 'text-red-600' : 'text-green-600'} mt-1 flex items-center`}>
                <TrendingUp className="w-3 h-3 mr-1" /> {diferenca > 0 ? 'Acima' : 'Abaixo'} do previsto
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${diferenca > 0 ? 'bg-red-500' : 'bg-green-500'} rounded-full`} 
              style={{ width: `${Math.min(Math.abs(percentualDiferenca) * 5, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.abs(Number(percentualDiferenca))}% de variação</p>
        </motion.div>
      </div>

      {/* Filtros de orçamento */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-3 md:mb-0">
            <Wallet className="h-5 w-5 text-indigo-600" /> Orçamento por Categoria
          </h3>
          <div className="flex gap-3 flex-wrap">
            <button 
              onClick={() => setOrcamentoFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md ${orcamentoFilter === "all" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setOrcamentoFilter("acima")}
              className={`px-3 py-1.5 text-sm rounded-md ${orcamentoFilter === "acima" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
            >
              Acima do orçado
            </button>
            <button 
              onClick={() => setOrcamentoFilter("abaixo")}
              className={`px-3 py-1.5 text-sm rounded-md ${orcamentoFilter === "abaixo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
            >
              Abaixo do orçado
            </button>
            <button 
              onClick={() => toast.success("Relatório orçamentário exportado!")}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-700 flex items-center gap-1"
            >
              <Download className="h-4 w-4" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico principal de orçamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Previsto vs Realizado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Previsto vs Realizado</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosOrcamentoFiltrados}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  <Legend />
                  <Bar dataKey="previsto" name="Orçado" fill={ORCAMENTO_COLORS.previsto} />
                  <Bar dataKey="realizado" name="Realizado" fill={ORCAMENTO_COLORS.realizado} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        {/* Gráfico de pizza - Distribuição por departamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Departamento</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockOrcamentoDepartamentos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="departamento"
                    label={({ departamento, percentual }) => `${departamento}: ${percentual}%`}
                  >
                    {mockOrcamentoDepartamentos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Tendências e histórico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Tendências e Histórico</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setHistoricoView("linha")}
                className={`px-3 py-1.5 text-sm rounded-md ${historicoView === "linha" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Linha
              </button>
              <button
                onClick={() => setHistoricoView("barra")}
                className={`px-3 py-1.5 text-sm rounded-md ${historicoView === "barra" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Barras
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {historicoView === "linha" ? (
                <LineChart
                  data={mockHistoricoOrcamento}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  <Legend />
                  <Line type="monotone" dataKey="previsto" name="Orçado" stroke="#60a5fa" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="realizado" name="Realizado" stroke="#f97316" />
                </LineChart>
              ) : (
                <BarChart
                  data={mockHistoricoOrcamento}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  <Legend />
                  <Bar dataKey="previsto" name="Orçado" fill="#60a5fa" />
                  <Bar dataKey="realizado" name="Realizado" fill="#f97316" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Análise de tendências */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Análise de Tendências</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h5 className="font-medium text-indigo-800 mb-2">Principais Observações</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Tendência de estabilidade na execução orçamentária nos últimos 3 meses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Projeção de redução de custos em Eventos e Marketing para o próximo trimestre</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="h-5 w-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Tecnologia superando orçamento previsto em 15,8% devido a investimentos em infraestrutura digital</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Recomendações</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Revisar plano de gastos para Tecnologia e considerar reajuste orçamentário</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Manter economia em Material Didático para compensar gastos adicionais</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Preparar revisão orçamentária para o próximo semestre com base nas tendências atuais</span>
                  </li>
                </ul>
                <button
                  onClick={() => toast.success("Plano de ações orçamentárias gerado!")}
                  className="mt-3 w-full py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Gerar plano de ações
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabela detalhada */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Detalhamento por Categoria</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orçado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realizado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diferença
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dadosOrcamentoFiltrados.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.categoria}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {item.previsto.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {item.realizado.toLocaleString('pt-BR')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.realizado > item.previsto ? 'text-red-600' : 'text-green-600'}`}>
                    {item.realizado > item.previsto ? '+' : '-'} 
                    R$ {Math.abs(item.realizado - item.previsto).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.realizado <= item.previsto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.realizado <= item.previsto ? 'Dentro do orçamento' : 'Acima do orçamento'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default GestaoOrcamento; 