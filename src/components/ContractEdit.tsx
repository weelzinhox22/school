import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { X, Save, Trash, Calendar } from "lucide-react";

type ContractEditProps = {
  contrato: {
    id: number;
    fornecedor: string;
    tipo: string;
    valor: number;
    vencimento: string;
    responsavel?: string;
    dataInicio?: string;
    descricao?: string;
  };
  onClose: () => void;
  onSave: (contrato: any) => void;
};

const ContractEdit = ({ contrato, onClose, onSave }: ContractEditProps) => {
  // Populate with default values if not provided
  const contratoCompleto = {
    ...contrato,
    responsavel: contrato.responsavel || "Maria Silva",
    dataInicio: contrato.dataInicio || "2023-01-01",
    descricao: contrato.descricao || "Contrato de fornecimento de serviços e produtos para a instituição de ensino."
  };

  const [formData, setFormData] = useState(contratoCompleto);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "valor") {
      // Convert string to number for valor field
      setFormData({
        ...formData,
        [name]: parseInt(value.replace(/\D/g, ''), 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fornecedor.trim()) {
      newErrors.fornecedor = "Nome do fornecedor é obrigatório";
    }
    
    if (!formData.tipo.trim()) {
      newErrors.tipo = "Tipo do contrato é obrigatório";
    }
    
    if (formData.valor <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }
    
    if (!formData.vencimento) {
      newErrors.vencimento = "Data de vencimento é obrigatória";
    }
    
    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória";
    }
    
    if (new Date(formData.dataInicio) > new Date(formData.vencimento)) {
      newErrors.dataInicio = "Data de início não pode ser posterior à data de vencimento";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast.success("Contrato atualizado com sucesso!");
      onSave(formData);
      onClose();
    } else {
      toast.error("Por favor, corrija os erros no formulário.");
    }
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
          <h2 className="text-xl font-bold text-gray-800">Editar Contrato #{contrato.id}</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fornecedor" className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor
                </label>
                <input
                  type="text"
                  id="fornecedor"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.fornecedor ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.fornecedor && (
                  <p className="text-red-500 text-xs mt-1">{errors.fornecedor}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Selecione um tipo</option>
                  <option value="Material Didático">Material Didático</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Software">Software</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  id="valor"
                  name="valor"
                  value={`R$ ${formData.valor.toLocaleString('pt-BR')}`}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.valor ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.valor && (
                  <p className="text-red-500 text-xs mt-1">{errors.valor}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  id="responsavel"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.dataInicio ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.dataInicio && (
                  <p className="text-red-500 text-xs mt-1">{errors.dataInicio}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="vencimento" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="vencimento"
                    name="vencimento"
                    value={formData.vencimento}
                    onChange={handleChange}
                    className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.vencimento ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.vencimento && (
                  <p className="text-red-500 text-xs mt-1">{errors.vencimento}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={formData.descricao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-between">
            <button 
              type="button"
              onClick={() => toast.error("Esta funcionalidade excluiria o contrato em um ambiente real.")}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center gap-2"
            >
              <Trash className="h-4 w-4" /> Excluir contrato
            </button>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Salvar alterações
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ContractEdit; 