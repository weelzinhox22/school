import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Download, FileText, Briefcase, Calendar, DollarSign } from "lucide-react";

type ContractViewProps = {
  contrato: {
    id: number;
    fornecedor: string;
    tipo: string;
    valor: number;
    vencimento: string;
    // Additional fields for detailed view
    responsavel?: string;
    dataInicio?: string;
    descricao?: string;
    clausulas?: string[];
    anexos?: string[];
  };
  onClose: () => void;
};

const ContractView = ({ contrato, onClose }: ContractViewProps) => {
  // Fill in mock data for fields that might not exist in the original contract
  const contratoCompleto = {
    ...contrato,
    responsavel: contrato.responsavel || "Maria Silva",
    dataInicio: contrato.dataInicio || "2023-01-01",
    descricao: contrato.descricao || "Contrato de fornecimento de serviços e produtos para a instituição de ensino, incluindo suporte técnico e manutenção conforme especificações anexas.",
    clausulas: contrato.clausulas || [
      "1. O contrato tem validade de 12 meses a partir da data de assinatura.",
      "2. Os pagamentos serão realizados mensalmente, até o dia 10 de cada mês.",
      "3. Qualquer alteração deve ser formalizada através de termo aditivo.",
      "4. Em caso de rescisão antecipada, aplica-se multa de 10% sobre o valor restante do contrato."
    ],
    anexos: contrato.anexos || [
      "Proposta Comercial.pdf",
      "Especificações Técnicas.docx",
      "Cronograma de Entrega.xlsx"
    ]
  };

  const dataVencimento = new Date(contratoCompleto.vencimento);
  const dataInicio = new Date(contratoCompleto.dataInicio);
  const hoje = new Date();
  const diasParaVencimento = Math.floor((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  let statusClass = "text-green-700 bg-green-50";
  if (diasParaVencimento < 0) {
    statusClass = "text-red-700 bg-red-50";
  } else if (diasParaVencimento < 30) {
    statusClass = "text-yellow-700 bg-yellow-50";
  }

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
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Contrato #{contratoCompleto.id}</h2>
              <p className="text-gray-500">{contratoCompleto.fornecedor}</p>
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
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">Tipo</span>
              </div>
              <p className="text-lg font-medium">{contratoCompleto.tipo}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Valor</span>
              </div>
              <p className="text-lg font-medium">R$ {contratoCompleto.valor.toLocaleString('pt-BR')}</p>
            </div>
            
            <div className={`rounded-lg p-4 ${statusClass}`}>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Vencimento</span>
              </div>
              <p className="text-lg font-medium">
                {format(dataVencimento, "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <p className="text-xs mt-1">
                {diasParaVencimento < 0 
                  ? `Vencido há ${Math.abs(diasParaVencimento)} dias` 
                  : `Vence em ${diasParaVencimento} dias`}
              </p>
            </div>
          </div>

          {/* Contract details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Detalhes do Contrato</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fornecedor</p>
                    <p className="font-medium">{contratoCompleto.fornecedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Responsável</p>
                    <p className="font-medium">{contratoCompleto.responsavel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Início</p>
                    <p className="font-medium">{format(dataInicio, "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Vencimento</p>
                    <p className="font-medium">{format(dataVencimento, "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descrição</p>
                  <p className="text-sm">{contratoCompleto.descricao}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Cláusulas Principais</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {contratoCompleto.clausulas.map((clausula, index) => (
                    <li key={index} className="text-sm">
                      {clausula}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Anexos</h3>
              <div className="bg-white border border-gray-200 rounded-lg divide-y">
                {contratoCompleto.anexos.map((anexo, index) => (
                  <div key={index} className="flex items-center justify-between py-3 px-4">
                    <span className="text-sm">{anexo}</span>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center gap-1">
                      <Download className="h-4 w-4" /> Baixar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t mt-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Exportar PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContractView; 