import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend,
  LineChart, Line
} from "recharts";
import { 
  Users, DollarSign, User, Calendar, 
  Download, Eye, TrendingUp, TrendingDown,
  Award, Medal, Briefcase, FileText, 
  CheckCircle, XCircle, Search, Filter
} from "lucide-react";

// Dados mockados para a folha de pagamento (importados do arquivo original)
const mockFolhaPagamento = [
  { cargo: "Professores", total: 430000, funcionarios: 24 },
  { cargo: "Coordenadores", total: 120000, funcionarios: 4 },
  { cargo: "Administrativo", total: 85000, funcionarios: 6 },
  { cargo: "Manutenção", total: 45000, funcionarios: 5 },
  { cargo: "Direção", total: 70000, funcionarios: 2 },
];

// Histórico evolutivo da folha de pagamento
const mockHistoricoFolha = [
  { mes: "Jan", total: 720000 },
  { mes: "Fev", total: 735000 },
  { mes: "Mar", total: 738000 },
  { mes: "Abr", total: 742000 },
  { mes: "Mai", total: 745000 },
  { mes: "Jun", total: 750000 },
];

// Dados para simulação de indicadores de eficiência
const mockEficiencia = [
  { departamento: "Pedagógico", eficiencia: 95, meta: 90 },
  { departamento: "Administrativo", eficiencia: 88, meta: 85 },
  { departamento: "Coordenação", eficiencia: 92, meta: 90 },
  { departamento: "Direção", eficiencia: 96, meta: 95 },
  { departamento: "Manutenção", eficiencia: 82, meta: 80 },
];

// Dados para a distribuição por tempo de casa
const mockTempoEmpresa = [
  { tempo: "Menos de 1 ano", funcionarios: 8 },
  { tempo: "1-3 anos", funcionarios: 15 },
  { tempo: "3-5 anos", funcionarios: 10 },
  { tempo: "5-10 anos", funcionarios: 6 },
  { tempo: "Mais de 10 anos", funcionarios: 2 },
];

// Dados para benefícios
const mockBeneficios = [
  { tipo: "Plano de Saúde", valor: 85000, percentual: 42 },
  { tipo: "Vale Refeição", valor: 48000, percentual: 24 },
  { tipo: "Vale Transporte", valor: 36000, percentual: 18 },
  { tipo: "Seguro de Vida", valor: 12000, percentual: 6 },
  { tipo: "Outros Benefícios", valor: 20000, percentual: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

/**
 * Componente GestaoFolhaPagamento
 * 
 * Este componente gerencia a visualização e análise da folha de pagamento escolar,
 * exibindo dados de funcionários, distribuição de salários por cargo, análise de 
 * benefícios e indicadores de desempenho para apoiar a gestão de recursos humanos.
 */
const GestaoFolhaPagamento = () => {
  // Estado para filtrar a visualização da folha
  const [departamentoFiltro, setDepartamentoFiltro] = useState("todos");
  
  // Estado para alternar entre diferentes visualizações de dados
  const [visualizacaoAtiva, setVisualizacaoAtiva] = useState("total");
  
  // Estado para período selecionado para análise
  const [periodoAnalise, setPeriodoAnalise] = useState("mensal");
  
  // Calculando totais importantes
  const totalFuncionarios = mockFolhaPagamento.reduce((acc, item) => acc + item.funcionarios, 0);
  const totalFolha = mockFolhaPagamento.reduce((acc, item) => acc + item.total, 0);
  const mediaSalario = Math.round(totalFolha / totalFuncionarios);
  
  // Dados para o card de economia/eficiência
  const economiaEstimada = 25000; // Valor em reais
  const percentualEconomia = ((economiaEstimada / totalFolha) * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      {/* Cards de indicadores principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card: Total de Funcionários */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-indigo-100">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Funcionários</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">
                {totalFuncionarios}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Distribuídos em 5 departamentos</span>
            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
              +3 este mês
            </span>
          </div>
        </motion.div>
        
        {/* Card: Valor Total da Folha */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total da Folha</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                R$ {totalFolha.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Atualizado em 10/06/2025</span>
            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2,1% vs. mês anterior
            </span>
          </div>
        </motion.div>
        
        {/* Card: Média por Funcionário */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Média por Funcionário</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                R$ {mediaSalario.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Remuneração + benefícios</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
              110% da média do setor
            </span>
          </div>
        </motion.div>
      </div>

      {/* Seção de análise avançada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico: Distribuição por cargo (pizza) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Distribuição por Cargo</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setVisualizacaoAtiva("total")}
                  className={`px-3 py-1.5 text-sm rounded-md ${visualizacaoAtiva === "total" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Valor
                </button>
                <button
                  onClick={() => setVisualizacaoAtiva("funcionarios")}
                  className={`px-3 py-1.5 text-sm rounded-md ${visualizacaoAtiva === "funcionarios" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Funcionários
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockFolhaPagamento}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey={visualizacaoAtiva === "total" ? "total" : "funcionarios"}
                    nameKey="cargo"
                    label={({ cargo, percent }) => `${cargo}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockFolhaPagamento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => visualizacaoAtiva === "total" ? 
                      `R$ ${Number(value).toLocaleString('pt-BR')}` : 
                      `${value} funcionário${value !== 1 ? 's' : ''}`} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        {/* Histórico de evolução da folha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Evolução da Folha</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setPeriodoAnalise("mensal")}
                  className={`px-3 py-1.5 text-sm rounded-md ${periodoAnalise === "mensal" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setPeriodoAnalise("trimestral")}
                  className={`px-3 py-1.5 text-sm rounded-md ${periodoAnalise === "trimestral" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Trimestral
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockHistoricoFolha}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis domain={[700000, 800000]} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Tabela detalhada e estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tabela de detalhamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden md:col-span-2"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Detalhamento por Cargo</h3>
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <select 
                  className="text-sm border-0 bg-gray-100 rounded-md px-3 py-1.5"
                  value={departamentoFiltro}
                  onChange={(e) => setDepartamentoFiltro(e.target.value)}
                >
                  <option value="todos">Todos os cargos</option>
                  {mockFolhaPagamento.map((item, index) => (
                    <option key={index} value={item.cargo}>{item.cargo}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionários
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (R$)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Média (R$)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % da Folha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockFolhaPagamento
                    .filter(item => departamentoFiltro === "todos" || item.cargo === departamentoFiltro)
                    .map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.cargo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.funcionarios}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {item.total.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {Math.round(item.total / item.funcionarios).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((item.total / totalFolha) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {totalFuncionarios}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {totalFolha.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {mediaSalario.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </motion.div>
        
        {/* Estatísticas de eficiência */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Indicadores de Eficiência</h3>
            <div className="space-y-4">
              {mockEficiencia.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.departamento}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.eficiencia >= item.meta ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.eficiencia}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${item.eficiencia >= item.meta ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${item.eficiencia}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Meta: {item.meta}%</span>
                    <span>{item.eficiencia >= item.meta ? 'Atingida ✓' : `Faltam ${item.meta - item.eficiencia}%`}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Economia Potencial</span>
                <span className="text-sm font-medium text-green-600">R$ {economiaEstimada.toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-xs text-gray-500">
                Otimizando distribuição de carga horária e reduzindo horas extras,
                é possível economizar até {percentualEconomia}% do valor da folha.
              </p>
              <button
                onClick={() => toast.success("Relatório de economia gerado!")}
                className="mt-3 w-full py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
              >
                Ver plano de otimização
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Gestão de Recursos Humanos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resumo do mês */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Resumo do Mês
              </h4>
              <ul className="text-sm text-blue-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Folha representa 57% do orçamento total</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Aumento médio de 4,2% em relação ao ano anterior</span>
                </li>
                <li className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Próximo reajuste previsto: Janeiro/2025</span>
                </li>
              </ul>
              <button 
                onClick={() => toast.success("Relatório completo gerado!")}
                className="mt-3 w-full py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center gap-1"
              >
                <Download className="h-4 w-4" /> Exportar relatório
              </button>
            </div>
            
            {/* Progressão de carreira */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2 flex items-center">
                <Award className="h-4 w-4 mr-2" /> Progressão de Carreira
              </h4>
              <ul className="text-sm text-green-600 space-y-2">
                <li className="flex items-start">
                  <Medal className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 professores com avaliação para promoção</span>
                </li>
                <li className="flex items-start">
                  <Medal className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>2 coordenadores em formação contínua</span>
                </li>
                <li className="flex items-start">
                  <Medal className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>3 administrativos em treinamento</span>
                </li>
              </ul>
              <button 
                onClick={() => toast.success("Plano de carreira visualizado!")}
                className="mt-3 w-full py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center justify-center gap-1"
              >
                <Eye className="h-4 w-4" /> Ver plano de carreira
              </button>
            </div>
            
            {/* Próximas ações */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" /> Próximas Ações
              </h4>
              <ul className="text-sm text-indigo-600 space-y-2">
                <li className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Início da avaliação semestral em 15 dias</span>
                </li>
                <li className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Cadastro para benefícios corporativos</span>
                </li>
                <li className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Revisão de cargos e salários</span>
                </li>
              </ul>
              <button 
                onClick={() => toast.success("Calendário de ações visualizado!")}
                className="mt-3 w-full py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center justify-center gap-1"
              >
                <Calendar className="h-4 w-4" /> Ver calendário
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GestaoFolhaPagamento; 