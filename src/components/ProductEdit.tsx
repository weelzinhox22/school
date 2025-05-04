import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { X, Save, Calendar, Package, AlertTriangle, Database } from "lucide-react";

type ProductEditProps = {
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

const ProductEdit = ({ item, onClose }: ProductEditProps) => {
  const [formData, setFormData] = useState({
    produto: item.produto,
    quantidade: item.quantidade,
    unidade: item.unidade,
    validade: item.validade,
    categoria: item.categoria,
    status: item.status
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Produto atualizado: ${formData.produto}`);
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
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Editar Produto
              </h2>
              <p className="text-gray-500">
                Atualize as informações do produto
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
            {/* Nome e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="produto" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="produto"
                    name="produto"
                    value={formData.produto}
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
                    <Database className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Grãos">Grãos</option>
                    <option value="Proteínas">Proteínas</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Óleos">Óleos</option>
                    <option value="Enlatados">Enlatados</option>
                    <option value="Frutas e Legumes">Frutas e Legumes</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quantidade e Unidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade
                </label>
                <select
                  id="unidade"
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="kg">Quilogramas (kg)</option>
                  <option value="g">Gramas (g)</option>
                  <option value="litros">Litros (l)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="unidades">Unidades (un)</option>
                  <option value="pacotes">Pacotes (pct)</option>
                  <option value="caixas">Caixas (cx)</option>
                </select>
              </div>
            </div>

            {/* Validade e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="validade" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="validade"
                    name="validade"
                    value={formData.validade}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Atenção">Atenção</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Observações adicionais sobre o produto..."
              />
            </div>

            {/* Alerta de validade */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Importante</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Certifique-se de verificar a data de validade. Produtos próximos do vencimento devem receber o status "Atenção".
                    </p>
                  </div>
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

export default ProductEdit; 