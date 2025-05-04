import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  Wallet, TrendingUp, TrendingDown, 
  Download, Calendar, DollarSign, 
  CreditCard, BellRing, ArrowUp, 
  ArrowDown, Clock, FileText,
  CheckCircle, XCircle, AlertCircle
} from "lucide-react";

// Tipos para os dados do fluxo de caixa
interface FluxoCaixaDiario {
  dia: string;
  entrada: number;
  saida: number;
  saldo: number;
}

interface FluxoCaixaMensal {
  mes: string;
  entrada: number;
  saida: number;
  saldo: number;
}

interface CategoriaFinanceira {
  categoria: string;
  valor: number;
  percentual: number;
}

interface ProjecaoFinanceira {
  periodo: string;
  receita: number;
  despesa: number;
  saldo: number;
}

interface AlertaFluxo {
  id: number;
  tipo: "receita" | "despesa";
  titulo: string;
  valor: number;
  data: string;
}

// Dados para fluxo de caixa diário
const mockFluxoCaixa: FluxoCaixaDiario[] = [
  { dia: "01/06", entrada: 28500, saida: 12300, saldo: 16200 },
  { dia: "02/06", entrada: 32100, saida: 8500, saldo: 23600 },
  { dia: "03/06", entrada: 18700, saida: 14200, saldo: 4500 },
  { dia: "04/06", entrada: 25800, saida: 9800, saldo: 16000 },
  { dia: "05/06", entrada: 30200, saida: 15600, saldo: 14600 },
];

// Dados para fluxo de caixa mensal (tendência)
const mockFluxoMensal: FluxoCaixaMensal[] = [
  { mes: "Jan", entrada: 520000, saida: 480000, saldo: 40000 },
  { mes: "Fev", entrada: 540000, saida: 510000, saldo: 30000 },
  { mes: "Mar", entrada: 580000, saida: 530000, saldo: 50000 },
  { mes: "Abr", entrada: 560000, saida: 545000, saldo: 15000 },
  { mes: "Mai", entrada: 590000, saida: 540000, saldo: 50000 },
  { mes: "Jun", entrada: 620000, saida: 580000, saldo: 40000 },
];

// Dados para categorias de receitas
const mockCategoriasReceita: CategoriaFinanceira[] = [
  { categoria: "Mensalidades", valor: 520000, percentual: 78 },
  { categoria: "Material Didático", valor: 85000, percentual: 13 },
  { categoria: "Atividades Extras", valor: 45000, percentual: 7 },
  { categoria: "Outros", valor: 15000, percentual: 2 },
];

// Dados para categorias de despesas
const mockCategoriasDespesa: CategoriaFinanceira[] = [
  { categoria: "Salários", valor: 430000, percentual: 74 },
  { categoria: "Infraestrutura", valor: 65000, percentual: 11 },
  { categoria: "Material", valor: 45000, percentual: 8 },
  { categoria: "Serviços", valor: 25000, percentual: 4 },
  { categoria: "Outros", valor: 15000, percentual: 3 },
];

// Dados para projeções futuras
const mockProjecoes: ProjecaoFinanceira[] = [
  { periodo: "Próximos 7 dias", receita: 145000, despesa: 78000, saldo: 67000 },
  { periodo: "Próximo mês", receita: 625000, despesa: 590000, saldo: 35000 },
  { periodo: "Próximo trimestre", receita: 1850000, despesa: 1750000, saldo: 100000 },
];

// Dados para alertas de fluxo
const mockAlertas: AlertaFluxo[] = [
  { id: 1, tipo: "despesa", titulo: "Pagamento de fornecedores", valor: 45000, data: "15/06/2024" },
  { id: 2, tipo: "despesa", titulo: "Folha de pagamento", valor: 430000, data: "05/07/2024" },
  { id: 3, tipo: "receita", titulo: "Mensalidades (previsão)", valor: 520000, data: "10/07/2024" },
  { id: 4, tipo: "despesa", titulo: "Manutenção preventiva", valor: 28000, data: "20/07/2024" },
];

/**
 * Componente GestaoFluxoCaixa
 * 
 * Este componente gerencia a visualização e análise do fluxo de caixa escolar,
 * exibindo dados de entradas e saídas, saldo, tendências e projeções para
 * apoiar a gestão financeira e tomada de decisões.
 */
const GestaoFluxoCaixa = () => {
  // Estado para alternar entre diferentes visualizações
  const [periodoVisualizacao, setPeriodoVisualizacao] = useState("diario");
  
  // Estado para filtrar o tipo de fluxo
  const [tipoFluxo, setTipoFluxo] = useState("todos");
  
  // Estado para alternar entre gráficos
  const [tipoGrafico, setTipoGrafico] = useState("barras");
  
  // Calculando totais do fluxo diário
  const totalEntradas = mockFluxoCaixa.reduce((acc, item) => acc + item.entrada, 0);
  const totalSaidas = mockFluxoCaixa.reduce((acc, item) => acc + item.saida, 0);
  const saldoTotal = mockFluxoCaixa.reduce((acc, item) => acc + item.saldo, 0);
  
  // Função para formatar valores monetários
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  // Dados filtrados com base no tipo de fluxo selecionado
  const dadosFiltrados = tipoFluxo === "todos" 
    ? mockFluxoCaixa 
    : tipoFluxo === "entradas" 
      ? mockFluxoCaixa.filter(item => item.entrada > 0)
      : mockFluxoCaixa.filter(item => item.saida > 0);
  
  return (
    <div className="space-y-6">
      {/* Cards de resumo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Entradas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Entradas</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {formatarMoeda(totalEntradas)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Total acumulado nos últimos 5 dias</span>
            <span className="flex items-center text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" /> +4,2%
            </span>
          </div>
        </motion.div>
        
        {/* Card: Saídas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saídas</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {formatarMoeda(totalSaidas)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Total acumulado nos últimos 5 dias</span>
            <span className="flex items-center text-red-600">
              <ArrowDown className="h-3 w-3 mr-1" /> -2,8%
            </span>
          </div>
        </motion.div>
        
        {/* Card: Saldo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center mb-2">
            <div className="p-3 rounded-full bg-blue-100">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {formatarMoeda(saldoTotal)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Diferença entre entradas e saídas</span>
            <span className={`px-2 py-0.5 rounded-full ${saldoTotal >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {saldoTotal >= 0 ? 'Positivo' : 'Negativo'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Filtros e controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow p-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-3 md:mb-0">
            <Wallet className="h-5 w-5 text-indigo-600" /> Fluxo de Caixa
          </h3>
          <div className="flex gap-3 flex-wrap">
            {/* Filtros de período */}
            <div className="flex bg-gray-100 rounded-md">
              <button 
                onClick={() => setPeriodoVisualizacao("diario")}
                className={`px-3 py-1.5 text-sm rounded-md ${periodoVisualizacao === "diario" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Diário
              </button>
              <button 
                onClick={() => setPeriodoVisualizacao("mensal")}
                className={`px-3 py-1.5 text-sm rounded-md ${periodoVisualizacao === "mensal" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Mensal
              </button>
            </div>
            
            {/* Filtros de tipo de fluxo */}
            <div className="flex bg-gray-100 rounded-md">
              <button 
                onClick={() => setTipoFluxo("todos")}
                className={`px-3 py-1.5 text-sm rounded-md ${tipoFluxo === "todos" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setTipoFluxo("entradas")}
                className={`px-3 py-1.5 text-sm rounded-md ${tipoFluxo === "entradas" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
              >
                Entradas
              </button>
              <button 
                onClick={() => setTipoFluxo("saidas")}
                className={`px-3 py-1.5 text-sm rounded-md ${tipoFluxo === "saidas" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
              >
                Saídas
              </button>
            </div>
            
            {/* Filtros de tipo de gráfico */}
            <div className="flex bg-gray-100 rounded-md">
              <button 
                onClick={() => setTipoGrafico("barras")}
                className={`px-3 py-1.5 text-sm rounded-md ${tipoGrafico === "barras" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Barras
              </button>
              <button 
                onClick={() => setTipoGrafico("linha")}
                className={`px-3 py-1.5 text-sm rounded-md ${tipoGrafico === "linha" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Linha
              </button>
              <button 
                onClick={() => setTipoGrafico("area")}
                className={`px-3 py-1.5 text-sm rounded-md ${tipoGrafico === "area" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
              >
                Área
              </button>
            </div>
            
            {/* Botão de exportar */}
            <button 
              onClick={() => toast.success("Relatório de fluxo de caixa exportado!")}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-700 flex items-center gap-1"
            >
              <Download className="h-4 w-4" /> Exportar
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Gráfico de fluxo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {periodoVisualizacao === "diario" ? "Fluxo Diário" : "Fluxo Mensal"}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {tipoGrafico === "barras" && (
                <BarChart
                  data={periodoVisualizacao === "diario" ? dadosFiltrados : mockFluxoMensal}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={periodoVisualizacao === "diario" ? "dia" : "mes"} />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                  <Legend />
                  {(tipoFluxo === "todos" || tipoFluxo === "entradas") && (
                    <Bar dataKey="entrada" name="Entradas" fill="#4ade80" />
                  )}
                  {(tipoFluxo === "todos" || tipoFluxo === "saidas") && (
                    <Bar dataKey="saida" name="Saídas" fill="#f87171" />
                  )}
                  {tipoFluxo === "todos" && (
                    <Bar dataKey="saldo" name="Saldo" fill="#60a5fa" />
                  )}
                </BarChart>
              )}
              
              {tipoGrafico === "linha" && (
                <LineChart
                  data={periodoVisualizacao === "diario" ? dadosFiltrados : mockFluxoMensal}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={periodoVisualizacao === "diario" ? "dia" : "mes"} />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                  <Legend />
                  {(tipoFluxo === "todos" || tipoFluxo === "entradas") && (
                    <Line type="monotone" dataKey="entrada" name="Entradas" stroke="#4ade80" strokeWidth={2} activeDot={{ r: 8 }} />
                  )}
                  {(tipoFluxo === "todos" || tipoFluxo === "saidas") && (
                    <Line type="monotone" dataKey="saida" name="Saídas" stroke="#f87171" strokeWidth={2} activeDot={{ r: 8 }} />
                  )}
                  {tipoFluxo === "todos" && (
                    <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#60a5fa" strokeWidth={2} activeDot={{ r: 8 }} />
                  )}
                </LineChart>
              )}
              
              {tipoGrafico === "area" && (
                <AreaChart
                  data={periodoVisualizacao === "diario" ? dadosFiltrados : mockFluxoMensal}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={periodoVisualizacao === "diario" ? "dia" : "mes"} />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                  <Legend />
                  {(tipoFluxo === "todos" || tipoFluxo === "entradas") && (
                    <Area type="monotone" dataKey="entrada" name="Entradas" fill="#4ade80" fillOpacity={0.3} stroke="#4ade80" />
                  )}
                  {(tipoFluxo === "todos" || tipoFluxo === "saidas") && (
                    <Area type="monotone" dataKey="saida" name="Saídas" fill="#f87171" fillOpacity={0.3} stroke="#f87171" />
                  )}
                  {tipoFluxo === "todos" && (
                    <Area type="monotone" dataKey="saldo" name="Saldo" fill="#60a5fa" fillOpacity={0.3} stroke="#60a5fa" />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
      
      {/* Tabela de detalhamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Detalhamento {periodoVisualizacao === "diario" ? "Diário" : "Mensal"}</h3>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {periodoVisualizacao === "diario" ? "01/06/2024 - 05/06/2024" : "Jan/2024 - Jun/2024"}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {periodoVisualizacao === "diario" ? "Dia" : "Mês"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entradas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saídas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(periodoVisualizacao === "diario" ? mockFluxoCaixa : mockFluxoMensal).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {periodoVisualizacao === "diario" 
                      ? (item as FluxoCaixaDiario).dia 
                      : (item as FluxoCaixaMensal).mes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    + {formatarMoeda((item as FluxoCaixaDiario).entrada)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    - {formatarMoeda((item as FluxoCaixaDiario).saida)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={((item as FluxoCaixaDiario).saldo >= 0) ? 'text-blue-600' : 'text-red-600'}>
                      {formatarMoeda((item as FluxoCaixaDiario).saldo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${((item as FluxoCaixaDiario).saldo >= 0) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {((item as FluxoCaixaDiario).saldo >= 0) ? 'Positivo' : 'Negativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                  + {formatarMoeda(
                    (periodoVisualizacao === "diario" ? mockFluxoCaixa : mockFluxoMensal)
                      .reduce((acc, item) => acc + (item as FluxoCaixaDiario).entrada, 0)
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                  - {formatarMoeda(
                    (periodoVisualizacao === "diario" ? mockFluxoCaixa : mockFluxoMensal)
                      .reduce((acc, item) => acc + (item as FluxoCaixaDiario).saida, 0)
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                  {formatarMoeda(
                    (periodoVisualizacao === "diario" ? mockFluxoCaixa : mockFluxoMensal)
                      .reduce((acc, item) => acc + (item as FluxoCaixaDiario).saldo, 0)
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {/* Célula vazia no rodapé */}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
      
      {/* Projeções e alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projeções futuras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" /> Projeções Futuras
            </h3>
            <div className="space-y-4">
              {mockProjecoes.map((item, index) => (
                <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">{item.periodo}</h4>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-indigo-600">Receitas</p>
                      <p className="text-base font-bold text-indigo-800">{formatarMoeda(item.receita)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600">Despesas</p>
                      <p className="text-base font-bold text-indigo-800">{formatarMoeda(item.despesa)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600">Saldo</p>
                      <p className="text-base font-bold text-indigo-800">{formatarMoeda(item.saldo)}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-indigo-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-indigo-700">Índice de liquidez: {((item.receita / item.despesa) * 100).toFixed(1)}%</span>
                      <span className={`px-2 py-0.5 rounded-full ${item.saldo >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.saldo >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Alertas de fluxo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-indigo-600" /> Alertas de Fluxo
            </h3>
            <div className="space-y-3">
              {mockAlertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`p-3 rounded-lg border flex items-start ${
                    alerta.tipo === "despesa" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                  }`}
                >
                  <div className={`p-2 rounded-full mr-3 mt-1 ${
                    alerta.tipo === "despesa" ? "bg-red-100" : "bg-green-100"
                  }`}>
                    {alerta.tipo === "despesa" ? (
                      <TrendingDown className={`h-4 w-4 text-red-600`} />
                    ) : (
                      <TrendingUp className={`h-4 w-4 text-green-600`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium ${
                        alerta.tipo === "despesa" ? "text-red-700" : "text-green-700"
                      }`}>
                        {alerta.titulo}
                      </h4>
                      <span className={`text-sm font-medium ${
                        alerta.tipo === "despesa" ? "text-red-700" : "text-green-700"
                      }`}>
                        {formatarMoeda(alerta.valor)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> {alerta.data}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {alerta.tipo === "despesa" ? "Pagamento" : "Recebimento"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => toast.success("Alertas configurados com sucesso!")}
              className="mt-4 w-full py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center gap-1"
            >
              <BellRing className="h-4 w-4" /> Configurar alertas
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Análise estratégica */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Análise Estratégica</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Concentração de Receitas
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-700">
                    70% das receitas são concentradas na primeira semana do mês.
                    Recomenda-se distribuir campanhas de cobrança.
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Picos de Despesas
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700">
                    Despesas concentradas entre os dias 5 e 10 de cada mês.
                    Considerar renegociação de datas de pagamento.
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Capital de Giro
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-green-700">
                    O fluxo atual permite manter 2,5 meses de operação sem novas receitas.
                    Nível considerado adequado para o setor.
                  </span>
                </li>
              </ul>
              <button
                onClick={() => toast.success("Relatório de capital de giro gerado!")}
                className="mt-3 w-full py-2 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                Ver relatório completo
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GestaoFluxoCaixa; 