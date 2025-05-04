import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Calendar, Package, AlertTriangle, FileText, BarChart } from "lucide-react";

type ProductViewProps = {
  item: {
    id: number;
    produto: string;
    quantidade: number;
    unidade: string;
    validade: string;
    categoria: string;
    status: string;
  };
  onClose: () => void;
};

const ProductView = ({ item, onClose }: ProductViewProps) => {
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-indigo-100">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {item.produto}
              </h2>
              <p className="text-gray-500">
                {item.categoria}
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
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-600 uppercase">Quantidade</span>
                </div>
                <div className="text-lg font-bold text-indigo-700">
                  {item.quantidade} {item.unidade}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 uppercase">Validade</span>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {format(new Date(item.validade), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
              
              <div className={`rounded-lg p-4 ${
                item.status === 'Normal' ? 'bg-green-50' : 
                item.status === 'Baixo' ? 'bg-amber-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    item.status === 'Normal' ? 'text-green-600' : 
                    item.status === 'Baixo' ? 'text-amber-600' : 'text-red-600'
                  }`} />
                  <span className={`text-xs font-semibold uppercase ${
                    item.status === 'Normal' ? 'text-green-600' : 
                    item.status === 'Baixo' ? 'text-amber-600' : 'text-red-600'
                  }`}>Status</span>
                </div>
                <div className={`text-lg font-bold ${
                  item.status === 'Normal' ? 'text-green-700' : 
                  item.status === 'Baixo' ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {item.status}
                </div>
              </div>
            </div>
            
            {/* Histórico de Movimentação */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Movimentação</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Entrada
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        +50 {item.unidade}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        Maria Silva
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(new Date().setDate(new Date().getDate() - 5)), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Saída
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        -30 {item.unidade}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        João Pereira
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(new Date().setDate(new Date().getDate() - 15)), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Entrada
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        +100 {item.unidade}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        Ana Souza
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Consumo</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Gráfico de consumo nos últimos 6 meses</p>
                </div>
              </div>
            </div>

            {/* Alertas */}
            {item.status !== 'Normal' && (
              <div className={`border-l-4 p-4 rounded-r-md ${
                item.status === 'Baixo' ? 'bg-amber-50 border-amber-500' : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-5 w-5 ${
                      item.status === 'Baixo' ? 'text-amber-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      item.status === 'Baixo' ? 'text-amber-800' : 'text-red-800'
                    }`}>Atenção</h3>
                    <div className={`mt-2 text-sm ${
                      item.status === 'Baixo' ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      <p>
                        {item.status === 'Baixo' 
                          ? `Estoque baixo. Considere repor o produto em breve.` 
                          : `Validade próxima do vencimento. Verifique a qualidade do produto.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Última atualização: {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Gerando relatório para ${item.produto}`)}
              >
                <FileText className="h-4 w-4" /> Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductView; 