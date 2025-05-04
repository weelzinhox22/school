import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { X, Save, Calendar, UtensilsCrossed, AlertTriangle } from "lucide-react";

type FoodItemEditProps = {
  item: {
    id: number;
    dia: string;
    categoria: string;
    refeicao: string;
    restricao: string;
  };
  onClose: () => void;
};

const FoodItemEdit = ({ item, onClose }: FoodItemEditProps) => {
  const [formData, setFormData] = useState({
    dia: item.dia,
    categoria: item.categoria,
    refeicao: item.refeicao,
    restricao: item.restricao
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Refeição atualizada: ${formData.categoria} de ${format(new Date(formData.dia), "dd/MM/yyyy", { locale: ptBR })}`);
    onClose();
  };

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
            <div className="p-3 rounded-full bg-blue-100">
              <UtensilsCrossed className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Editar Refeição
              </h2>
              <p className="text-gray-500">
                Atualize as informações da refeição
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Data e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dia" className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dia"
                    name="dia"
                    value={formData.dia}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UtensilsCrossed className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Almoço">Almoço</option>
                    <option value="Lanche">Lanche</option>
                    <option value="Café da manhã">Café da manhã</option>
                    <option value="Jantar">Jantar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Refeição */}
            <div>
              <label htmlFor="refeicao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição da Refeição
              </label>
              <textarea
                id="refeicao"
                name="refeicao"
                value={formData.refeicao}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Descreva detalhadamente a refeição..."
                required
              />
            </div>

            {/* Restrições */}
            <div>
              <label htmlFor="restricao" className="block text-sm font-medium text-gray-700 mb-1">
                Restrições
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="restricao"
                  name="restricao"
                  value={formData.restricao}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border rounded-md"
                >
                  <option value="Sem restrições">Sem restrições</option>
                  <option value="Sem glúten">Sem glúten</option>
                  <option value="Sem lactose">Sem lactose</option>
                  <option value="Vegetariano disponível">Vegetariano disponível</option>
                  <option value="Vegano disponível">Vegano disponível</option>
                </select>
              </div>
            </div>

            {/* Informações Nutricionais */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-medium text-gray-700 mb-3">Informações Nutricionais (opcional)</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="calorias" className="block text-xs font-medium text-gray-500 mb-1">
                    Calorias (kcal)
                  </label>
                  <input
                    type="number"
                    id="calorias"
                    name="calorias"
                    className="w-full px-2 py-1 border rounded-md text-sm"
                    placeholder="450"
                  />
                </div>
                
                <div>
                  <label htmlFor="proteinas" className="block text-xs font-medium text-gray-500 mb-1">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    id="proteinas"
                    name="proteinas"
                    className="w-full px-2 py-1 border rounded-md text-sm"
                    placeholder="25"
                  />
                </div>
                
                <div>
                  <label htmlFor="carboidratos" className="block text-xs font-medium text-gray-500 mb-1">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    id="carboidratos"
                    name="carboidratos"
                    className="w-full px-2 py-1 border rounded-md text-sm"
                    placeholder="55"
                  />
                </div>
                
                <div>
                  <label htmlFor="gorduras" className="block text-xs font-medium text-gray-500 mb-1">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    id="gorduras"
                    name="gorduras"
                    className="w-full px-2 py-1 border rounded-md text-sm"
                    placeholder="15"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FoodItemEdit; 