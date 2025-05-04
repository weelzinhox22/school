import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  PieChart, Pie, Cell, 
  Tooltip, ResponsiveContainer, 
  Legend
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileText, DollarSign, Calendar,
  Eye, Edit, Download, Plus,
  CheckCircle, XCircle, RefreshCw
} from "lucide-react";
import ContractView from "../ContractView";
import ContractEdit from "../ContractEdit";

// Interface para os dados de contrato
interface Contrato {
  id: number;
  fornecedor: string;
  tipo: string;
  valor: number;
  vencimento: string;
}

// Dados mock para contratos
const mockContratos: Contrato[] = [
  { id: 1, fornecedor: "Editora ABC", tipo: "Material Didático", valor: 85000, vencimento: "2024-12-31" },
  { id: 2, fornecedor: "Limpeza Total", tipo: "Serviços", valor: 36000, vencimento: "2024-08-15" },
  { id: 3, fornecedor: "TechSchool", tipo: "Software", valor: 42000, vencimento: "2025-01-10" },
  { id: 4, fornecedor: "Transporte Seguro", tipo: "Transporte", valor: 56000, vencimento: "2024-07-01" },
  { id: 5, fornecedor: "Manutenção Predial", tipo: "Serviços", valor: 28000, vencimento: "2024-09-20" },
  { id: 6, fornecedor: "Segurança Escolar", tipo: "Serviços", valor: 48000, vencimento: "2024-10-15" },
];

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Estilos CSS personalizados
const customStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  @keyframes pulse-border {
    0% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    }
  }
  
  .pulse-animation {
    animation: pulse-border 2s infinite;
  }
`;

/**
 * Componente GestaoContratos
 * 
 * Este componente gerencia a visualização e análise dos contratos escolares,
 * permitindo o acompanhamento de fornecedores, valores, vencimentos e renovações
 * para apoiar a gestão financeira e administrativa da escola.
 */
const GestaoContratos = () => {
  // Estados para visualizar e editar contratos
  const [viewingContract, setViewingContract] = useState<null | Contrato>(null);
  const [editingContract, setEditingContract] = useState<null | Contrato>(null);
  
  // Estado para filtrar contratos por tipo
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  
  // Estado para filtrar contratos por status de vencimento
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  
  // Função para calcular dias até o vencimento
  const calcularDiasParaVencimento = (dataVencimento: string): number => {
    const dataFinal = new Date(dataVencimento);
    const hoje = new Date();
    return Math.floor((dataFinal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Função para determinar o status de um contrato
  const determinarStatusContrato = (dataVencimento: string): { status: string; statusClass: string } => {
    const diasParaVencimento = calcularDiasParaVencimento(dataVencimento);
    let status = "Ativo";
    let statusClass = "bg-green-100 text-green-800";
    
    if (diasParaVencimento < 0) {
      status = "Vencido";
      statusClass = "bg-red-100 text-red-800";
    } else if (diasParaVencimento < 30) {
      status = "A vencer";
      statusClass = "bg-yellow-100 text-yellow-800";
    }
    
    return { status, statusClass };
  };
  
  // Filtrar contratos com base nos filtros aplicados
  const contratosFiltrados = mockContratos.filter(contrato => {
    const { status } = determinarStatusContrato(contrato.vencimento);
    
    // Filtrar por tipo
    const filtroTipoMatch = filtroTipo === "todos" || contrato.tipo === filtroTipo;
    
    // Filtrar por status
    const filtroStatusMatch = filtroStatus === "todos" || 
      (filtroStatus === "vencidos" && status === "Vencido") ||
      (filtroStatus === "proximos" && status === "A vencer") ||
      (filtroStatus === "ativos" && status === "Ativo");
      
    return filtroTipoMatch && filtroStatusMatch;
  });
  
  // Agrupar contratos por tipo para o gráfico de pizza
  const dadosGrafico = (() => {
    // Agrupar contratos por tipo
    const tiposAgrupados = mockContratos.reduce((acc, contrato) => {
      if (!acc[contrato.tipo]) {
        acc[contrato.tipo] = { name: contrato.tipo, value: 0 };
      }
      acc[contrato.tipo].value += contrato.valor;
      return acc;
    }, {} as Record<string, { name: string, value: number }>);
    
    return Object.values(tiposAgrupados);
  })();
  
  // Calcular totais para os cards de resumo
  const totalContratos = mockContratos.length;
  const totalValor = mockContratos.reduce((acc, contrato) => acc + contrato.valor, 0);
  const contratosAVencer = mockContratos.filter(
    contrato => {
      const diasParaVencimento = calcularDiasParaVencimento(contrato.vencimento);
      return diasParaVencimento > 0 && diasParaVencimento < 90;
    }
  ).length;
  
  // Função para atualizar um contrato
  const handleContractUpdate = (updatedContract: Contrato) => {
    // Em uma aplicação real, atualizaria o contrato no banco de dados
    // Aqui apenas simulamos a atualização na UI com um toast
    toast.success(`Contrato #${updatedContract.id} atualizado com sucesso!`);
    setEditingContract(null);
  };
  
  // Função para formatar valores monetários
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  return (
    <div className="space-y-6">
      {/* Estilos personalizados injetados */}
      <style>{customStyles}</style>
      
      {/* Título e introdução */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">Gestão de Contratos</h2>
        <p className="text-gray-600">Gerencie todos os contratos e fornecedores da instituição em um só lugar.</p>
      </div>
      
      {/* Cards de resumo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Total de Contratos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-indigo-100">Total de Contratos</p>
              <p className="text-3xl font-bold text-white mt-1">
                {totalContratos}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-indigo-100">
            <span>Contratos ativos e em vigor</span>
            <span className="px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
              +2 este mês
            </span>
          </div>
        </motion.div>
        
        {/* Card: Valor Total */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-100">Valor Total</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatarMoeda(totalValor)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-green-100">
            <span>Soma dos contratos ativos</span>
            <span className="px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
              16% do orçamento anual
            </span>
          </div>
        </motion.div>
        
        {/* Card: Renovações */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-100">Renovações</p>
              <p className="text-3xl font-bold text-white mt-1">
                {contratosAVencer}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-yellow-100">
            <span>Contratos a vencer em 90 dias</span>
            <span className="px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
              Prioridade alta
            </span>
          </div>
        </motion.div>
      </div>

      {/* Filtros e botões de ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-500"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-3 md:mb-0">
            <FileText className="h-5 w-5 text-indigo-600" /> Gestão de Contratos
          </h3>
          <div className="flex gap-3 flex-wrap">
            {/* Filtro por tipo de contrato */}
            <select
              className="px-4 py-2 text-sm rounded-md bg-indigo-50 text-indigo-700 border-0 shadow-sm focus:ring-2 focus:ring-indigo-300 transition-all"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos os tipos</option>
              {Array.from(new Set(mockContratos.map(c => c.tipo))).map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            
            {/* Filtro por status de vencimento */}
            <select
              className="px-4 py-2 text-sm rounded-md bg-indigo-50 text-indigo-700 border-0 shadow-sm focus:ring-2 focus:ring-indigo-300 transition-all"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativos">Ativos</option>
              <option value="proximos">A vencer</option>
              <option value="vencidos">Vencidos</option>
            </select>
            
            {/* Botão para adicionar contrato */}
            <button 
              onClick={() => toast.success("Novo contrato pode ser adicionado aqui")}
              className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Novo contrato
            </button>
            
            {/* Botão para exportar relatório */}
            <button 
              onClick={() => toast.success("Relatório de contratos exportado!")}
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" /> Exportar
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Tabela de contratos */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contratosFiltrados.map((contrato) => {
                const diasParaVencimento = calcularDiasParaVencimento(contrato.vencimento);
                const { status, statusClass } = determinarStatusContrato(contrato.vencimento);
                
                return (
                  <tr key={contrato.id} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">{contrato.fornecedor.substring(0, 2)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contrato.fornecedor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {contrato.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatarMoeda(contrato.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(contrato.vencimento), "dd/MM/yyyy", { locale: ptBR })}
                      <div className="text-xs text-gray-400 mt-1">
                        {diasParaVencimento < 0 
                          ? `${Math.abs(diasParaVencimento)} dias atrás` 
                          : `em ${diasParaVencimento} dias`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setViewingContract(contrato)}
                          className="p-1.5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                          title="Visualizar contrato"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingContract(contrato)}
                          className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Editar contrato"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.success(`Contrato ${contrato.id} renovado com sucesso!`)}
                          className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Renovar contrato"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {contratosFiltrados.length === 0 && (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center">
              <FileText className="h-12 w-12 text-gray-300 mb-3" />
              <p>Nenhum contrato encontrado com os filtros atuais.</p>
              <button 
                onClick={() => {setFiltroTipo("todos"); setFiltroStatus("todos");}}
                className="mt-3 px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Análises e gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico: Distribuição por tipo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Distribuição por Tipo</h3>
          <p className="text-sm text-gray-500 mb-4">Análise de contratos por categoria</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{paddingTop: "20px"}} />
                <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
            <p>Representação dos valores contratuais por tipo de serviço</p>
            <p className="font-medium text-indigo-600 mt-1">
              {formatarMoeda(totalValor)} em contratos ativos
            </p>
          </div>
        </motion.div>
        
        {/* Calendário de renovações */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Calendário de Renovações</h3>
          <p className="text-sm text-gray-500 mb-4">Acompanhamento de prazos contratuais</p>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {mockContratos
              .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
              .map(contrato => {
                const diasParaVencimento = calcularDiasParaVencimento(contrato.vencimento);
                
                let statusClass = "border-l-4 border-green-500 bg-green-50";
                let textColor = "text-green-800";
                if (diasParaVencimento < 0) {
                  statusClass = "border-l-4 border-red-500 bg-red-50";
                  textColor = "text-red-800";
                } else if (diasParaVencimento < 30) {
                  statusClass = "border-l-4 border-yellow-500 bg-yellow-50";
                  textColor = "text-yellow-800";
                }
                
                return (
                  <div key={contrato.id} className={`p-4 rounded-lg shadow-sm ${statusClass}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{contrato.fornecedor}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
                          {format(new Date(contrato.vencimento), "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">{contrato.tipo}</span>
                      <span className="text-sm font-medium">{formatarMoeda(contrato.valor)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                      <span className={`text-xs font-medium ${textColor}`}>
                        {diasParaVencimento < 0 
                          ? `Vencido há ${Math.abs(diasParaVencimento)} dias` 
                          : `Vence em ${diasParaVencimento} dias`}
                      </span>
                      <button 
                        onClick={() => toast.success(`Lembrete configurado para o contrato ${contrato.id}`)}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Configurar alerta
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Próxima renovação</span>
              <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                {format(
                  new Date(
                    mockContratos
                      .filter(c => calcularDiasParaVencimento(c.vencimento) > 0)
                      .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())[0]?.vencimento || new Date()
                  ), 
                  "dd/MM/yyyy"
                )}
              </span>
            </div>
            <button
              onClick={() => toast.success("Alerta de renovação configurado!")}
              className="mt-2 w-full py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="h-4 w-4" /> Configurar alertas de renovação
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Visão geral de contratos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 rounded-xl shadow-lg overflow-hidden border border-indigo-100"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Status dos Contratos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contratos ativos */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-800">Contratos Ativos</h4>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-blue-600">Total</span>
                <span className="text-2xl font-bold text-blue-800">
                  {mockContratos.filter(c => calcularDiasParaVencimento(c.vencimento) >= 30).length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{
                  width: `${(mockContratos.filter(c => calcularDiasParaVencimento(c.vencimento) >= 30).length / mockContratos.length) * 100}%`
                }}></div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Contratos com mais de 30 dias até o vencimento
              </p>
            </div>
            
            {/* Contratos a vencer */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl shadow-sm border border-yellow-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <h4 className="font-medium text-yellow-800">A Vencer</h4>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-yellow-600">Total</span>
                <span className="text-2xl font-bold text-yellow-800">
                  {mockContratos.filter(c => {
                    const dias = calcularDiasParaVencimento(c.vencimento);
                    return dias >= 0 && dias < 30;
                  }).length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-yellow-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{
                  width: `${(mockContratos.filter(c => {
                    const dias = calcularDiasParaVencimento(c.vencimento);
                    return dias >= 0 && dias < 30;
                  }).length / mockContratos.length) * 100}%`
                }}></div>
              </div>
              <p className="text-xs text-yellow-600 mt-3">
                Contratos com menos de 30 dias até o vencimento
              </p>
            </div>
            
            {/* Contratos vencidos */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <h4 className="font-medium text-red-800">Vencidos</h4>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-red-600">Total</span>
                <span className="text-2xl font-bold text-red-800">
                  {mockContratos.filter(c => calcularDiasParaVencimento(c.vencimento) < 0).length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{
                  width: `${(mockContratos.filter(c => calcularDiasParaVencimento(c.vencimento) < 0).length / mockContratos.length) * 100}%`
                }}></div>
              </div>
              <p className="text-xs text-red-600 mt-3">
                Contratos já vencidos que necessitam atenção imediata
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-indigo-100">
            <p className="text-sm text-indigo-600 italic">
              Mantenha seus contratos em dia para evitar interrupções de serviços essenciais e 
              aproveite oportunidades de renegociação para melhores condições comerciais.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => toast.success("Política de gestão de contratos visualizada!")}
                className="px-4 py-2.5 text-sm rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex-1 flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" /> Ver política de contratos
              </button>
              <button
                onClick={() => toast.success("Relatório analítico de contratos gerado!")}
                className="px-4 py-2.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex-1 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Gerar análise comparativa
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Modals para visualização e edição de contratos */}
      {viewingContract && (
        <ContractView 
          contrato={viewingContract} 
          onClose={() => setViewingContract(null)} 
        />
      )}
      
      {editingContract && (
        <ContractEdit 
          contrato={editingContract} 
          onClose={() => setEditingContract(null)} 
          onSave={handleContractUpdate}
        />
      )}
    </div>
  );
};

export default GestaoContratos; 