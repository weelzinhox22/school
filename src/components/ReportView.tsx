import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Download, BarChart, DollarSign, Users, Calendar } from "lucide-react";

type ReportViewProps = {
  report: {
    id: number;
    mes: string;
    alunosAtendidos: number;
    mediaRefeicoesDia: number;
    custoTotal: number;
    custoAluno: number;
  };
  onClose: () => void;
};

const ReportView = ({ report, onClose }: ReportViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-indigo-100">
              <BarChart className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Relatório de Consumo - {report.mes} 2024
              </h2>
              <p className="text-gray-500">
                Detalhes completos do relatório mensal
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Indicadores principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-600 uppercase">Alunos Atendidos</span>
                </div>
                <div className="text-2xl font-bold text-indigo-700">{report.alunosAtendidos}</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-semibold text-green-600 uppercase">Média Diária</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{report.mediaRefeicoesDia}</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 uppercase">Custo Total</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  R$ {report.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-600 uppercase">Custo por Aluno</span>
                </div>
                <div className="text-2xl font-bold text-amber-700">
                  R$ {report.custoAluno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            {/* Gráfico */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Evolução do Consumo</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Gráfico de evolução de consumo no mês de {report.mes}</p>
                </div>
              </div>
            </div>

            {/* Detalhamento por semana */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhamento por Semana</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semana
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Refeições
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Média Diária
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Semana 1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.480</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">296</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 7.250,00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Semana 2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.425</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">285</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 7.050,00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Semana 3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.500</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">300</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 7.400,00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Semana 4</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.445</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">289</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 7.300,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comentários e análises */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comentários e Análises</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                  <h4 className="text-sm font-medium text-blue-800">Desempenho Geral</h4>
                  <p className="text-sm text-blue-600 mt-1">O custo médio por aluno se manteve dentro do orçamento previsto para o mês.</p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md">
                  <h4 className="text-sm font-medium text-green-800">Pontos Positivos</h4>
                  <p className="text-sm text-green-600 mt-1">Redução de 2% no desperdício de alimentos em relação ao mês anterior.</p>
                </div>
                
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                  <h4 className="text-sm font-medium text-amber-800">Pontos de Atenção</h4>
                  <p className="text-sm text-amber-600 mt-1">Aumento no preço de alguns insumos que pode impactar o próximo mês.</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Relatório gerado em: {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Download do relatório de ${report.mes} iniciado!`)}
              >
                <Download className="h-4 w-4" /> Baixar relatório completo
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportView; 