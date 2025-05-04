import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { X, Users, Share2, Mail, Link as LinkIcon, Copy, Check, FileText } from "lucide-react";

type DocumentShareProps = {
  documento: {
    id: number;
    nome?: string;
    tipo?: string;
    titulo?: string;
    aluno?: string;
  };
  tipo: "institucional" | "ata" | "contrato" | "legislacao" | "aluno";
  onClose: () => void;
};

const DocumentShare = ({ documento, tipo, onClose }: DocumentShareProps) => {
  const [selectedOption, setSelectedOption] = useState<"link" | "email">("link");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("visualizacao");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const getDocumentTitle = () => {
    switch (tipo) {
      case "institucional":
        return documento.nome;
      case "ata":
      case "contrato":
      case "legislacao":
        return documento.titulo;
      case "aluno":
        return `${documento.tipo} - ${documento.aluno}`;
      default:
        return "Documento";
    }
  };

  const documentTitle = getDocumentTitle();
  const shareLink = `https://escoladigital3d.edu.br/share/${documento.id}?type=${tipo}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copiado para a área de transferência");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (selectedOption === "email") {
      if (!email) {
        toast.error("Por favor, insira um endereço de e-mail.");
        return;
      }
    }
    
    toast.success(
      selectedOption === "link" 
        ? "Link de compartilhamento criado com sucesso!" 
        : `Documento compartilhado por e-mail com ${email}`
    );
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-y-auto p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-100">
              <Share2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Compartilhar Documento</h2>
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
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{documentTitle}</p>
                <p className="text-xs text-gray-500">
                  {tipo === "institucional" ? "Documento institucional" : 
                   tipo === "ata" ? "Ata de reunião" :
                   tipo === "contrato" ? "Contrato" :
                   tipo === "legislacao" ? "Legislação" :
                   "Documento de aluno"}
                </p>
              </div>
            </div>
          </div>

          {/* Share options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Método de compartilhamento</label>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  selectedOption === "link" 
                    ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedOption("link")}
              >
                <div className="flex items-center justify-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Link
                </div>
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  selectedOption === "email" 
                    ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedOption("email")}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </div>
              </button>
            </div>
          </div>

          {/* Link sharing */}
          {selectedOption === "link" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Link de compartilhamento</label>
              <div className="flex">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 flex items-center"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Email sharing */}
          {selectedOption === "email" && (
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail do destinatário</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensagem (opcional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Adicione uma mensagem..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Permissions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissões</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="visualizacao">Apenas visualização</option>
              <option value="comentario">Visualização e comentários</option>
              <option value="edicao">Visualização e edição</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleShare}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" /> 
              {selectedOption === "link" ? "Criar link" : "Enviar"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentShare; 