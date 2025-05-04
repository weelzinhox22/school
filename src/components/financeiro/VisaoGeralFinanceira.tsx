import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, PieChart, Pie, Cell 
} from "recharts";
import { toast } from "react-hot-toast";
import { DollarSign, TrendingDown, TrendingUp, AlertCircle, BarChart2, Download, Wallet, Users } from "lucide-react";

// Dados mockados para simulação (importados do arquivo original)
const mockReceitas = [
  { mes: "Jan", valor: 150000 },
  { mes: "Fev", valor: 165000 },
  { mes: "Mar", valor: 180000 },
  { mes: "Abr", valor: 175000 },
  { mes: "Mai", valor: 190000 },
  { mes: "Jun", valor: 185000 },
];

const mockDespesas = [
  { mes: "Jan", valor: 120000 },
  { mes: "Fev", valor: 125000 },
  { mes: "Mar", valor: 130000 },
  { mes: "Abr", valor: 128000 },
  { mes: "Mai", valor: 135000 },
  { mes: "Jun", valor: 132000 },
];

const mockCategorias = [
  { name: "Mensalidades", value: 65 },
  { name: "Material Didático", value: 15 },
  { name: "Atividades Extras", value: 10 },
  { name: "Outros", value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * Componente VisaoGeralFinanceira
 * 
 * Este componente exibe a visão geral financeira da instituição,
 * apresentando cards com indicadores-chave, gráficos comparativos 
 * de receitas e despesas, distribuição de receitas e outros indicadores
 * financeiros relevantes para a gestão escolar.
 */
const VisaoGeralFinanceira = () => {
  // Configuração das animações de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  return (
    <div className="space-y-6">
      {/* Cards de resumo dos principais indicadores financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card de Receita Total */}
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <p className="text-lg font-semibold text-gray-900">R$ 1.045.000</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +8,2% vs. período anterior
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card de Despesa Total */}
        <motion.div 
          custom={1} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Despesa Total</p>
              <p className="text-lg font-semibold text-gray-900">R$ 770.000</p>
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +3,5% vs. período anterior
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card de Saldo */}
        <motion.div 
          custom={2} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo</p>
              <p className="text-lg font-semibold text-gray-900">R$ 275.000</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +21,4% vs. período anterior
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card de Inadimplência */}
        <motion.div 
          custom={3} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inadimplência</p>
              <p className="text-lg font-semibold text-gray-900">5.2%</p>
              <p className="text-xs text-yellow-600 mt-1 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" /> -0,3% vs. período anterior
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Receitas vs Despesas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-600" /> Receitas vs Despesas
            </h3>
            <button
              onClick={() => toast.success("Dados exportados com sucesso!")}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md flex items-center"
            >
              <Download className="h-3 w-3 mr-1" /> Exportar
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Comparativo mensal de receitas e despesas no semestre
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={mockReceitas.map((item, index) => ({
                  mes: item.mes,
                  receitas: item.valor,
                  despesas: mockDespesas[index].valor,
                  lucro: item.valor - mockDespesas[index].valor
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="receitas" name="Receitas" fill="#0088FE" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas" fill="#FF8042" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lucro" name="Lucro" fill="#00C49F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            Fonte: Sistema de Gestão Financeira - 1º Semestre 2025
          </div>
        </motion.div>

        {/* Gráfico de Distribuição de Receitas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-indigo-600" /> Distribuição de Receitas
            </h3>
            <button
              onClick={() => toast.success("Relatório detalhado gerado!")}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md flex items-center"
            >
              <Download className="h-3 w-3 mr-1" /> Relatório
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Composição percentual das fontes de receita
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategorias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockCategorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${Number(value).toFixed(0)}%`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            Dados atualizados em 05/2025
          </div>
        </motion.div>
      </div>

      {/* Indicadores financeiros adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-indigo-600" /> Indicadores Financeiros Estratégicos
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Métricas importantes para o acompanhamento da saúde financeira da instituição
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Indicador de Média Mensal */}
          <div className="bg-indigo-50 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-indigo-700">Receita Média Mensal</h4>
            </div>
            <p className="text-2xl font-bold text-indigo-800">R$ 174.200</p>
            <div className="bg-indigo-100 h-2 rounded-full mt-2 mb-1">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-sm text-indigo-600 mt-1">+5,2% em relação ao ano anterior</p>
          </div>
          
          {/* Indicador de Rentabilidade */}
          <div className="bg-green-50 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <Wallet className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-700">Rentabilidade</h4>
            </div>
            <p className="text-2xl font-bold text-green-800">26,3%</p>
            <div className="bg-green-100 h-2 rounded-full mt-2 mb-1">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-green-600 mt-1">+3,1% em relação ao ano anterior</p>
          </div>
          
          {/* Indicador de Receita por Aluno */}
          <div className="bg-blue-50 p-4 rounded-lg hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-700">Receita por Aluno</h4>
            </div>
            <p className="text-2xl font-bold text-blue-800">R$ 856</p>
            <div className="bg-blue-100 h-2 rounded-full mt-2 mb-1">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
            <p className="text-sm text-blue-600 mt-1">Média mensal no semestre</p>
          </div>
        </div>
        
        {/* Informações adicionais */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-start">
            <div className="max-w-lg">
              <h4 className="font-medium text-gray-800 mb-2">Análise do Período</h4>
              <p className="text-sm text-gray-600">
                A instituição apresenta indicadores financeiros saudáveis, com crescimento consistente nas receitas e controle adequado das despesas. 
                A inadimplência está dentro do limite aceitável para o setor educacional.
                Recomenda-se manter o foco em estratégias de retenção de alunos para o próximo semestre.
              </p>
            </div>
            <button 
              onClick={() => toast.success("Relatório financeiro completo será enviado por email!")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              Relatório Completo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VisaoGeralFinanceira; 