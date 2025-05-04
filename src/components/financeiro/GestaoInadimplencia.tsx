import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, LineChart, Line 
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, Download, FileText, User, Clock, CheckCircle, XCircle } from "lucide-react";

// Dados mock para simulação
const mockInadimplencia = [
  { mes: "Jan", taxa: 4.2, valor: 12600 },
  { mes: "Fev", taxa: 4.5, valor: 13500 },
  { mes: "Mar", taxa: 5.2, valor: 16200 },
  { mes: "Abr", taxa: 4.8, valor: 14400 },
  { mes: "Mai", taxa: 4.3, valor: 13200 },
  { mes: "Jun", taxa: 5.2, valor: 16800 },
];

// Dados detalhados de inadimplência por turma
const mockInadimplenciaTurmas = [
  { turma: "9º Ano A", alunos: 28, inadimplentes: 2, taxa: 7.1 },
  { turma: "9º Ano B", alunos: 30, inadimplentes: 1, taxa: 3.3 },
  { turma: "8º Ano A", alunos: 32, inadimplentes: 3, taxa: 9.4 },
  { turma: "8º Ano B", alunos: 29, inadimplentes: 2, taxa: 6.9 },
  { turma: "7º Ano A", alunos: 31, inadimplentes: 2, taxa: 6.5 },
  { turma: "7º Ano B", alunos: 27, inadimplentes: 3, taxa: 11.1 },
];

// Dados de alunos inadimplentes
const mockAlunosInadimplentes = [
  { id: 1, nome: "Pedro Oliveira", turma: "7º Ano A", meses: 2, valor: 1700 },
  { id: 2, nome: "Julia Ferreira", turma: "7º Ano B", meses: 1, valor: 850 },
  { id: 3, nome: "Carlos Santos", turma: "8º Ano A", meses: 3, valor: 2550 },
  { id: 4, nome: "Mariana Lima", turma: "8º Ano A", meses: 1, valor: 850 },
  { id: 5, nome: "Rafael Souza", turma: "8º Ano B", meses: 2, valor: 1700 },
  { id: 6, nome: "Fernanda Costa", turma: "9º Ano A", meses: 1, valor: 850 },
  { id: 7, nome: "Gustavo Pereira", turma: "7º Ano B", meses: 4, valor: 3400 },
];

// Histórico de ações de cobrança
const mockHistoricoAcoes = [
  { data: "2024-06-05", tipo: "Email", alunos: 12, resultado: "5 pagamentos" },
  { data: "2024-06-01", tipo: "SMS", alunos: 15, resultado: "8 pagamentos" },
  { data: "2024-05-25", tipo: "Telefone", alunos: 7, resultado: "4 pagamentos" },
  { data: "2024-05-15", tipo: "Carta", alunos: 10, resultado: "3 pagamentos" },
];

/**
 * Componente GestaoInadimplencia
 * 
 * Este componente gerencia a visualização e análise de inadimplência escolar,
 * apresentando gráficos, tabelas e tendências de inadimplência, além de
 * funcionalidades para gerenciar ações de cobrança e negociação.
 */
const GestaoInadimplencia = () => {
  // Estado para controlar a visualização de gráfico ou tabela
  const [inadimplenciaView, setInadimplenciaView] = useState("tabela");
  
  // Estado para filtrar por período
  const [periodoFiltro, setPeriodoFiltro] = useState("semestre");
  
  // Estado para controlar a aba ativa
  const [abaAtiva, setAbaAtiva] = useState("geral");
  
  // Calcular totais e médias
  const taxaMediaInadimplencia = parseFloat(
    (mockInadimplencia.reduce((acc, item) => acc + item.taxa, 0) / mockInadimplencia.length).toFixed(1)
  );
  
  const valorTotalInadimplencia = mockInadimplencia.reduce((acc, item) => acc + item.valor, 0);
  
  const totalAlunosInadimplentes = mockAlunosInadimplentes.length;
  
  // Variação em relação ao semestre anterior (simulação)
  const variacaoTaxa = 0.3; // percentual
  const variacaoValor = 2800; // valor

  return (
    <div className="space-y-6">
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Indicador: Taxa média de inadimplência */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taxa Média de Inadimplência</p>
              <p className="text-lg font-semibold text-gray-900">{taxaMediaInadimplencia}%</p>
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +{variacaoTaxa}% vs. semestre anterior
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${taxaMediaInadimplencia <= 5 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full`} 
              style={{ width: `${Math.min(taxaMediaInadimplencia * 5, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Meta: até 5%</p>
        </motion.div>

        {/* Indicador: Valor total inadimplente */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total Inadimplente</p>
              <p className="text-lg font-semibold text-gray-900">R$ {valorTotalInadimplencia.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +R$ {variacaoValor.toLocaleString('pt-BR')} vs. semestre anterior
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${Math.min((valorTotalInadimplencia / 20000) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Meta: até R$ 10.000</p>
        </motion.div>

        {/* Indicador: Total de alunos inadimplentes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alunos Inadimplentes</p>
              <p className="text-lg font-semibold text-gray-900">{totalAlunosInadimplentes} alunos</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {Math.round(totalAlunosInadimplentes / mockInadimplenciaTurmas.reduce((acc, t) => acc + t.alunos, 0) * 100)}% do total
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.min((totalAlunosInadimplentes / 15) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Concentração maior no 7º ano</p>
        </motion.div>
      </div>
      
      {/* Tabs de navegação */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setAbaAtiva("geral")}
              className={`py-4 px-6 text-sm font-medium ${
                abaAtiva === "geral" 
                  ? "border-b-2 border-indigo-500 text-indigo-600" 
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setAbaAtiva("alunos")}
              className={`py-4 px-6 text-sm font-medium ${
                abaAtiva === "alunos" 
                  ? "border-b-2 border-indigo-500 text-indigo-600" 
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Alunos Inadimplentes
            </button>
            <button
              onClick={() => setAbaAtiva("turmas")}
              className={`py-4 px-6 text-sm font-medium ${
                abaAtiva === "turmas" 
                  ? "border-b-2 border-indigo-500 text-indigo-600" 
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Análise por Turma
            </button>
            <button
              onClick={() => setAbaAtiva("acoes")}
              className={`py-4 px-6 text-sm font-medium ${
                abaAtiva === "acoes" 
                  ? "border-b-2 border-indigo-500 text-indigo-600" 
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Ações de Cobrança
            </button>
          </nav>
        </div>
        
        {/* Conteúdo das abas */}
        <div className="p-6">
          {/* Aba: Visão Geral */}
          {abaAtiva === "geral" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" /> Relatórios de Inadimplência
                </h3>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setInadimplenciaView("tabela")}
                    className={`px-3 py-1.5 text-sm rounded-md ${inadimplenciaView === "tabela" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Tabela
                  </button>
                  <button 
                    onClick={() => setInadimplenciaView("grafico")}
                    className={`px-3 py-1.5 text-sm rounded-md ${inadimplenciaView === "grafico" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Gráfico
                  </button>
                  <button 
                    onClick={() => toast.success("Relatório exportado!")}
                    className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </button>
                </div>
              </div>
              
              {inadimplenciaView === "tabela" ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Taxa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor (R$)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockInadimplencia.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.mes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.taxa.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {item.valor.toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.taxa < 4.5 ? 'bg-green-100 text-green-800' : 
                                item.taxa < 5.0 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {item.taxa < 4.5 ? 'Dentro do esperado' : 
                              item.taxa < 5.0 ? 'Atenção' : 
                              'Acima do limite'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockInadimplencia}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 10]} />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 30000]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="taxa" name="Taxa (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="valor" name="Valor (R$)" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {/* Painel de análise e recomendações */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-medium text-indigo-800 mb-3">Análise de Tendências</h4>
                  <ul className="space-y-2 text-sm text-indigo-700">
                    <li className="flex items-start">
                      <TrendingUp className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>A taxa de inadimplência cresceu 0,3% em comparação ao semestre anterior</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Os meses de março e junho apresentaram os maiores índices</span>
                    </li>
                    <li className="flex items-start">
                      <User className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>60% dos casos de inadimplência estão concentrados no 7º e 8º ano</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">Recomendações de Ação</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Implementar campanha de regularização com descontos progressivos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Intensificar comunicação proativa antes dos períodos críticos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Realizar análise socioeconômica das turmas com maior inadimplência</span>
                    </li>
                  </ul>
                  
                  <button
                    onClick={() => toast.success("Plano de ação criado com sucesso!")}
                    className="mt-4 w-full py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Criar plano de ação
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Aba: Alunos Inadimplentes */}
          {abaAtiva === "alunos" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Listagem de Alunos Inadimplentes</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toast.success("Relatório detalhado de alunos gerado!")}
                    className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700 flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" /> Exportar Relatório
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aluno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Turma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meses em Atraso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAlunosInadimplentes.map((aluno) => (
                      <tr key={aluno.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {aluno.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {aluno.turma}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${aluno.meses === 1 ? 'bg-yellow-100 text-yellow-800' : 
                              aluno.meses <= 2 ? 'bg-orange-100 text-orange-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {aluno.meses} {aluno.meses === 1 ? 'mês' : 'meses'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {aluno.valor.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                          <button
                            onClick={() => toast.success(`Notificação enviada para ${aluno.nome}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Notificar
                          </button>
                          <button
                            onClick={() => toast.success(`Negociação iniciada com ${aluno.nome}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Negociar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Estatísticas e opções */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Distribuição por Tempo</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>1 mês</span>
                        <span>{mockAlunosInadimplentes.filter(a => a.meses === 1).length} alunos</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ 
                          width: `${(mockAlunosInadimplentes.filter(a => a.meses === 1).length / mockAlunosInadimplentes.length) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>2 meses</span>
                        <span>{mockAlunosInadimplentes.filter(a => a.meses === 2).length} alunos</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ 
                          width: `${(mockAlunosInadimplentes.filter(a => a.meses === 2).length / mockAlunosInadimplentes.length) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>3+ meses</span>
                        <span>{mockAlunosInadimplentes.filter(a => a.meses >= 3).length} alunos</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ 
                          width: `${(mockAlunosInadimplentes.filter(a => a.meses >= 3).length / mockAlunosInadimplentes.length) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Ações em Massa</h4>
                  <p className="text-sm text-indigo-600 mb-3">
                    Aplicar ações para grupos específicos de alunos inadimplentes
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => toast.success("Envio de e-mails em massa agendado")}
                      className="w-full px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                    >
                      Enviar e-mails em massa
                    </button>
                    <button
                      onClick={() => toast.success("SMS de lembrete enviado para todos alunos")}
                      className="w-full px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                    >
                      Enviar SMS
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Proposta de Negociação</h4>
                  <p className="text-sm text-blue-600 mb-3">
                    Definir padrões de negociação para casos de inadimplência
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => toast.success("Proposta de desconto criada com sucesso")}
                      className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Criar proposta de desconto
                    </button>
                    <button
                      onClick={() => toast.success("Plano de parcelamento configurado")}
                      className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Definir parcelamento padrão
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Aba: Análise por Turma */}
          {abaAtiva === "turmas" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Inadimplência por Turma</h3>
                <button 
                  onClick={() => toast.success("Análise por turma exportada!")}
                  className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                >
                  <Download className="h-4 w-4" /> Exportar
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Turma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total de Alunos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inadimplentes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa (%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockInadimplenciaTurmas.map((turma, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {turma.turma}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {turma.alunos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {turma.inadimplentes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {turma.taxa.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${turma.taxa < 5 ? 'bg-green-100 text-green-800' : 
                              turma.taxa < 10 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {turma.taxa < 5 ? 'Saudável' : 
                             turma.taxa < 10 ? 'Atenção' : 
                             'Crítico'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Gráfico de análise por turma */}
              <div className="mt-6 bg-white rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 mb-4">Comparativo Visual</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockInadimplenciaTurmas}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="turma" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="taxa" name="Taxa de Inadimplência (%)" fill="#8884d8" />
                      <Bar dataKey="inadimplentes" name="Alunos Inadimplentes" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Ações específicas por turma */}
              <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-700 mb-3">Ações Recomendadas por Turma</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg border border-indigo-100">
                    <h5 className="font-medium text-indigo-800">7º Ano B - Turma com maior taxa</h5>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      Taxa de 11.1% - 3 alunos inadimplentes. Recomenda-se investigar causas específicas
                      e realizar reunião com coordenação da turma.
                    </p>
                    <button
                      onClick={() => toast.success("Agendada reunião com coordenação do 7º Ano B")}
                      className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      Agendar reunião
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-indigo-100">
                    <h5 className="font-medium text-indigo-800">8º Ano A - Segunda maior taxa</h5>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      Taxa de 9.4% - 3 alunos inadimplentes. Sugestão de abordagem personalizada
                      e avaliação socioeconômica para casos específicos.
                    </p>
                    <button
                      onClick={() => toast.success("Abordagem personalizada criada para 8º Ano A")}
                      className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      Criar abordagem
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestaoInadimplencia; 