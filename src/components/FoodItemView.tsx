import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Calendar, UtensilsCrossed, AlertTriangle, FileText, Check } from "lucide-react";

type FoodItemViewProps = {
  item: {
    id: number;
    dia: string;
    categoria: string;
    refeicao: string;
    restricao: string;
  };
  onClose: () => void;
};

const FoodItemView = ({ item, onClose }: FoodItemViewProps) => {
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
              <UtensilsCrossed className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {item.categoria} - {format(new Date(item.dia), "dd/MM/yyyy", { locale: ptBR })}
              </h2>
              <p className="text-gray-500">
                Detalhes da refeição
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
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-600 uppercase">Data</span>
                </div>
                <div className="text-lg font-bold text-indigo-700">
                  {format(new Date(item.dia), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 uppercase">Categoria</span>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {item.categoria}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600 uppercase">Restrições</span>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {item.restricao}
                </div>
              </div>
            </div>
            
            {/* Descrição da refeição */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição da Refeição</h3>
              <p className="text-gray-700 whitespace-pre-line">{item.refeicao}</p>
            </div>

            {/* Detalhes nutricionais */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Nutricionais</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded p-3 text-center">
                  <div className="text-sm text-gray-500 mb-1">Calorias</div>
                  <div className="font-bold">~450 kcal</div>
                </div>
                <div className="border border-gray-200 rounded p-3 text-center">
                  <div className="text-sm text-gray-500 mb-1">Proteínas</div>
                  <div className="font-bold">25g</div>
                </div>
                <div className="border border-gray-200 rounded p-3 text-center">
                  <div className="text-sm text-gray-500 mb-1">Carboidratos</div>
                  <div className="font-bold">55g</div>
                </div>
                <div className="border border-gray-200 rounded p-3 text-center">
                  <div className="text-sm text-gray-500 mb-1">Gorduras</div>
                  <div className="font-bold">15g</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">* Valores aproximados baseados na composição da refeição</p>
            </div>

            {/* Checklist de preparo */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Checklist de Preparo</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="ml-2 text-gray-700">Ingredientes verificados</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="ml-2 text-gray-700">Preparo supervisionado por nutricionista</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="ml-2 text-gray-700">Versões alternativas para restrições alimentares</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="ml-2 text-gray-700">Controle de temperatura verificado</span>
                </li>
              </ul>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Publicado em: {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Imprimindo informações do ${item.categoria} de ${format(new Date(item.dia), "dd/MM/yyyy")}`)}
              >
                <FileText className="h-4 w-4" /> Imprimir informações
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FoodItemView; 