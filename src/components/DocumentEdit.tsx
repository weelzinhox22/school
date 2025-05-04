import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { X, Save, Calendar, User, FileText } from "lucide-react";

type DocumentEditProps = {
  documento: {
    id: number;
    nome?: string;
    tipo?: string;
    tamanho?: string;
    dataCriacao?: string;
    ultimaAtualizacao?: string;
    autor?: string;
    // For atas
    titulo?: string;
    data?: string;
    participantes?: number;
    responsavel?: string;
    status?: string;
    // For contratos
    parceiro?: string;
    inicio?: string;
    fim?: string;
    valor?: number;
    // For legislação
    numero?: string;
    dataPublicacao?: string;
    ambito?: string;
    categoria?: string;
    // For alunos
    aluno?: string;
    turma?: string;
    dataEnvio?: string;
  };
  tipo: "institucional" | "ata" | "contrato" | "legislacao" | "aluno";
  onClose: () => void;
  onSave: (documento: any) => void;
};

const DocumentEdit = ({ documento, tipo, onClose, onSave }: DocumentEditProps) => {
  const [formData, setFormData] = useState(documento);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "valor") {
      // Convert string to number for valor field
      setFormData({
        ...formData,
        [name]: parseInt(value.replace(/\D/g, ''), 10) || 0
      });
    } else if (name === "participantes") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Documento atualizado com sucesso!");
    onSave(formData);
    onClose();
  };

  const renderEditForm = () => {
    switch (tipo) {
      case "institucional":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do documento
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="JPG">JPG</option>
                  <option value="PNG">PNG</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
                  Autor
                </label>
                <input
                  type="text"
                  id="autor"
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="ultimaAtualizacao" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Atualização
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="ultimaAtualizacao"
                    name="ultimaAtualizacao"
                    value={formData.ultimaAtualizacao?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case "ata":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Reunião
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="participantes" className="block text-sm font-medium text-gray-700 mb-1">
                  Participantes
                </label>
                <input
                  type="number"
                  id="participantes"
                  name="participantes"
                  value={formData.participantes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Aprovada">Aprovada</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case "contrato":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="parceiro" className="block text-sm font-medium text-gray-700 mb-1">
                  Parceiro
                </label>
                <input
                  type="text"
                  id="parceiro"
                  name="parceiro"
                  value={formData.parceiro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="inicio" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="inicio"
                    name="inicio"
                    value={formData.inicio?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="fim" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Fim
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="fim"
                    name="fim"
                    value={formData.fim?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="text"
                  id="valor"
                  name="valor"
                  value={formData.valor?.toLocaleString('pt-BR')}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case "legislacao":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                  Número/Referência
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="dataPublicacao" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Publicação
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dataPublicacao"
                    name="dataPublicacao"
                    value={formData.dataPublicacao?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="ambito" className="block text-sm font-medium text-gray-700 mb-1">
                  Âmbito
                </label>
                <select
                  id="ambito"
                  name="ambito"
                  value={formData.ambito}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Federal">Federal</option>
                  <option value="Estadual">Estadual</option>
                  <option value="Municipal">Municipal</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Lei">Lei</option>
                  <option value="Decreto">Decreto</option>
                  <option value="Resolução">Resolução</option>
                  <option value="Portaria">Portaria</option>
                  <option value="Parecer">Parecer</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case "aluno":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="aluno" className="block text-sm font-medium text-gray-700 mb-1">
                  Aluno
                </label>
                <input
                  type="text"
                  id="aluno"
                  name="aluno"
                  value={formData.aluno}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-1">
                  Turma
                </label>
                <input
                  type="text"
                  id="turma"
                  name="turma"
                  value={formData.turma}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <input
                  type="text"
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="dataEnvio" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Envio
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dataEnvio"
                    name="dataEnvio"
                    value={formData.dataEnvio?.split('T')[0]}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Completo">Completo</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Editar {tipo === "institucional" ? "Documento" : 
                        tipo === "ata" ? "Ata" :
                        tipo === "contrato" ? "Contrato" :
                        tipo === "legislacao" ? "Legislação" :
                        "Documento do Aluno"}
              </h2>
              <p className="text-gray-500">
                {tipo === "institucional" ? documento.nome : 
                 tipo === "ata" ? documento.titulo :
                 tipo === "contrato" ? documento.titulo :
                 tipo === "legislacao" ? documento.titulo :
                 `${documento.tipo} - ${documento.aluno}`}
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
          {renderEditForm()}

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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Salvar alterações
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DocumentEdit; 