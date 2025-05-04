import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { X, Calendar, Clock, Truck, Package, Save, AlertTriangle } from "lucide-react";

type DeliveryScheduleProps = {
  fornecedor: {
    id: number;
    nome: string;
    tipo: string;
    contato: string;
    telefone: string;
    ultimaEntrega: string;
    proximaEntrega: string;
  };
  onClose: () => void;
};

const DeliverySchedule = ({ fornecedor, onClose }: DeliveryScheduleProps) => {
  const [formData, setFormData] = useState({
    dataEntrega: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    horaEntrega: "09:00",
    responsavelRecebimento: "",
    itens: "",
    quantidades: "",
    observacoes: "",
    prioridade: "normal"
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
    toast.success(`Entrega agendada com ${fornecedor.nome} para ${format(new Date(formData.dataEntrega), "dd/MM/yyyy", { locale: ptBR })} às ${formData.horaEntrega}`);
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
            <div className="p-3 rounded-full bg-green-100">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Agendar Entrega
              </h2>
              <p className="text-gray-500">
                {fornecedor.nome} - {fornecedor.tipo}
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
            {/* Informações do fornecedor */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Contato</p>
                  <p className="font-medium">{fornecedor.contato}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{fornecedor.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última Entrega</p>
                  <p className="font-medium">{format(new Date(fornecedor.ultimaEntrega), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
              </div>
            </div>

            {/* Data e hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dataEntrega" className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Entrega
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dataEntrega"
                    name="dataEntrega"
                    value={formData.dataEntrega}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="horaEntrega" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="horaEntrega"
                    name="horaEntrega"
                    value={formData.horaEntrega}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Responsável e prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="responsavelRecebimento" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável pelo Recebimento
                </label>
                <input
                  type="text"
                  id="responsavelRecebimento"
                  name="responsavelRecebimento"
                  value={formData.responsavelRecebimento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Nome do responsável"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  id="prioridade"
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="baixa">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            {/* Itens e quantidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="itens" className="block text-sm font-medium text-gray-700 mb-1">
                  Itens
                </label>
                <textarea
                  id="itens"
                  name="itens"
                  value={formData.itens}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Lista de itens a serem entregues"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="quantidades" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidades
                </label>
                <textarea
                  id="quantidades"
                  name="quantidades"
                  value={formData.quantidades}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Quantidades de cada item"
                  required
                />
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
                value={formData.observacoes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Observações adicionais para a entrega"
              />
            </div>

            {/* Alertas */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Importante</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Certifique-se de que há pessoal disponível para receber a entrega no horário agendado.
                      Entregas fora do horário comercial precisam de autorização especial.
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Agendar Entrega
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DeliverySchedule; 