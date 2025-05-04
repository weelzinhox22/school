import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Download, Receipt, Filter } from "lucide-react";

// Dados mock para simulação
const mockMensalidades = [
  { id: 1, aluno: "João Silva", turma: "9º Ano A", valor: 850, status: "Pago", vencimento: "2024-03-10" },
  { id: 2, aluno: "Maria Santos", turma: "8º Ano B", valor: 850, status: "Pendente", vencimento: "2024-03-10" },
  { id: 3, aluno: "Pedro Oliveira", turma: "7º Ano A", valor: 850, status: "Atrasado", vencimento: "2024-02-10" },
  { id: 4, aluno: "Ana Costa", turma: "9º Ano B", valor: 850, status: "Pago", vencimento: "2024-03-10" },
  { id: 5, aluno: "Lucas Mendes", turma: "8º Ano A", valor: 850, status: "Pendente", vencimento: "2024-03-15" },
  { id: 6, aluno: "Júlia Ferreira", turma: "7º Ano B", valor: 850, status: "Atrasado", vencimento: "2024-02-15" },
  { id: 7, aluno: "Gabriel Alves", turma: "9º Ano C", valor: 850, status: "Pago", vencimento: "2024-03-10" },
  { id: 8, aluno: "Beatriz Lima", turma: "8º Ano C", valor: 850, status: "Pendente", vencimento: "2024-03-10" }
];

/**
 * Componente GestaoMensalidades
 * 
 * Este componente gerencia a visualização e controle de mensalidades dos alunos,
 * permitindo filtrar por nome, turma e status, exibindo estatísticas e listagem
 * detalhada com opções para notificação e registro de pagamentos.
 */
const GestaoMensalidades = () => {
  // Estados para filtros
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("");

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  // Filtrar mensalidades
  const mensalidadesFiltradas = mockMensalidades.filter(
    m => (!filtroTurma || m.turma.includes(filtroTurma)) && 
        (!filtroStatus || m.status === filtroStatus) &&
        (!filtroAluno || m.aluno.toLowerCase().includes(filtroAluno.toLowerCase()))
  );

  // Calcular estatísticas
  const estatisticas = {
    pagas: {
      quantidade: mockMensalidades.filter(m => m.status === "Pago").length,
      valor: mockMensalidades.filter(m => m.status === "Pago").reduce((acc, m) => acc + m.valor, 0)
    },
    pendentes: {
      quantidade: mockMensalidades.filter(m => m.status === "Pendente").length,
      valor: mockMensalidades.filter(m => m.status === "Pendente").reduce((acc, m) => acc + m.valor, 0)
    },
    atrasadas: {
      quantidade: mockMensalidades.filter(m => m.status === "Atrasado").length,
      valor: mockMensalidades.filter(m => m.status === "Atrasado").reduce((acc, m) => acc + m.valor, 0)
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar aluno</label>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nome do aluno..."
                value={filtroAluno}
                onChange={(e) => setFiltroAluno(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 md:flex-initial w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filtroTurma}
              onChange={(e) => setFiltroTurma(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              <option value="9º Ano">9º Ano</option>
              <option value="8º Ano">8º Ano</option>
              <option value="7º Ano">7º Ano</option>
            </select>
          </div>
          
          <div className="flex-1 md:flex-initial w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Pago">Pagos</option>
              <option value="Pendente">Pendentes</option>
              <option value="Atrasado">Atrasados</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <h3 className="font-medium text-gray-800">Pagos</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {estatisticas.pagas.quantidade} alunos
          </p>
          <p className="text-sm text-gray-500">
            R$ {estatisticas.pagas.valor.toLocaleString('pt-BR')}
          </p>
          <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{
              width: `${(estatisticas.pagas.quantidade / mockMensalidades.length) * 100}%`
            }}></div>
          </div>
        </motion.div>
        
        <motion.div 
          custom={1} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <h3 className="font-medium text-gray-800">Pendentes</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {estatisticas.pendentes.quantidade} alunos
          </p>
          <p className="text-sm text-gray-500">
            R$ {estatisticas.pendentes.valor.toLocaleString('pt-BR')}
          </p>
          <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{
              width: `${(estatisticas.pendentes.quantidade / mockMensalidades.length) * 100}%`
            }}></div>
          </div>
        </motion.div>
        
        <motion.div 
          custom={2} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <h3 className="font-medium text-gray-800">Atrasados</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {estatisticas.atrasadas.quantidade} alunos
          </p>
          <p className="text-sm text-gray-500">
            R$ {estatisticas.atrasadas.valor.toLocaleString('pt-BR')}
          </p>
          <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{
              width: `${(estatisticas.atrasadas.quantidade / mockMensalidades.length) * 100}%`
            }}></div>
          </div>
        </motion.div>
      </div>

      {/* Tabela de Mensalidades */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-indigo-600" /> Lista de Mensalidades
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => toast.success("Filtros avançados ativados")}
              className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700 flex items-center gap-1"
            >
              <Filter className="h-4 w-4" /> Filtros avançados
            </button>
            <button 
              onClick={() => toast.success("Relatório exportado em CSV!")}
              className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
            >
              <Download className="h-4 w-4" /> Exportar
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
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mensalidadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma mensalidade encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : mensalidadesFiltradas.map((mensalidade) => (
                <tr key={mensalidade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mensalidade.aluno}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mensalidade.turma}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {mensalidade.valor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${mensalidade.status === 'Pago' ? 'bg-green-100 text-green-800' : 
                        mensalidade.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {mensalidade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(mensalidade.vencimento), "dd/MM/yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toast.success(`Notificação enviada para ${mensalidade.aluno}!`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Notificar
                    </button>
                    <button
                      onClick={() => toast.success(`Mensalidade de ${mensalidade.aluno} registrada como paga!`)}
                      className={`${mensalidade.status === 'Pago' ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'}`}
                      disabled={mensalidade.status === 'Pago'}
                    >
                      {mensalidade.status === 'Pago' ? 'Pago' : 'Marcar pago'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Seção adicional: Resumo de cobranças */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo de Cobranças</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-700 mb-2">Próximos Vencimentos</h4>
            <p className="text-2xl font-bold text-indigo-800">
              {mockMensalidades.filter(m => 
                new Date(m.vencimento) > new Date() && 
                new Date(m.vencimento) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ).length}
            </p>
            <p className="text-sm text-indigo-600">nos próximos 7 dias</p>
            <button 
              onClick={() => toast.success("Lembretes enviados com sucesso!")}
              className="mt-3 px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
            >
              Enviar lembretes
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Taxa de Conversão</h4>
            <p className="text-2xl font-bold text-blue-800">
              {Math.round((estatisticas.pagas.quantidade / mockMensalidades.length) * 100)}%
            </p>
            <p className="text-sm text-blue-600">de pagamentos realizados</p>
            <div className="mt-2 h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${(estatisticas.pagas.quantidade / mockMensalidades.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-700 mb-2">Valor Total</h4>
            <p className="text-2xl font-bold text-purple-800">
              R$ {mockMensalidades.reduce((acc, m) => acc + m.valor, 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-purple-600">em mensalidades do período</p>
            <button 
              onClick={() => toast.success("Relatório financeiro detalhado gerado!")}
              className="mt-3 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
            >
              Relatório detalhado
            </button>
          </div>
        </div>
        
        {/* Seção de estratégias */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Estratégias para Redução de Inadimplência</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h5 className="font-medium text-gray-700 mb-2">Lembretes Proativos</h5>
                <p className="text-sm text-gray-600">
                  Envio automático de lembretes 3, 2 e 1 dia antes do vencimento,
                  reduzindo a taxa de atraso em até 30%.
                </p>
                <button 
                  onClick={() => toast.success("Sistema de lembretes configurado!")}
                  className="mt-2 px-3 py-1 text-xs bg-white text-gray-700 border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                >
                  Configurar
                </button>
              </div>
              
              <div className="flex-1">
                <h5 className="font-medium text-gray-700 mb-2">Descontos para Pagamento Antecipado</h5>
                <p className="text-sm text-gray-600">
                  Oferecer 3% de desconto para pagamentos realizados até 5 dias antes do vencimento,
                  incentivando pagamentos antecipados.
                </p>
                <button 
                  onClick={() => toast.success("Campanha de desconto programada!")}
                  className="mt-2 px-3 py-1 text-xs bg-white text-gray-700 border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                >
                  Criar campanha
                </button>
              </div>
              
              <div className="flex-1">
                <h5 className="font-medium text-gray-700 mb-2">Negociação de Débitos</h5>
                <p className="text-sm text-gray-600">
                  Facilitar o parcelamento de débitos pendentes sem juros
                  para mensalidades atrasadas há mais de 30 dias.
                </p>
                <button 
                  onClick={() => toast.success("Proposta de negociação criada!")}
                  className="mt-2 px-3 py-1 text-xs bg-white text-gray-700 border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                >
                  Criar proposta
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GestaoMensalidades; 