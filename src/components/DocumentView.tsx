import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Download, FileText, Calendar, Users, FileCheck, Clock } from "lucide-react";

type DocumentViewProps = {
  documento: {
    id: number;
    nome: string;
    tipo: string;
    tamanho: string;
    dataCriacao: string;
    ultimaAtualizacao: string;
    autor: string;
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
};

const DocumentView = ({ documento, tipo, onClose }: DocumentViewProps) => {
  const renderDocumentContent = () => {
    switch (tipo) {
      case "institucional":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome do documento</p>
                  <p className="font-medium">{documento.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium flex items-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                      {documento.tipo}
                    </span>
                    {documento.tamanho}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Criação</p>
                  <p className="font-medium">{format(new Date(documento.dataCriacao), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última Atualização</p>
                  <p className="font-medium">{format(new Date(documento.ultimaAtualizacao), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Autor</p>
                  <p className="font-medium">{documento.autor}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Prévia do documento</h3>
              <div className="border border-gray-200 rounded-lg p-4 h-96 flex flex-col items-center justify-center bg-white">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-600">Visualização do documento {documento.nome}</p>
                <p className="text-sm text-gray-500 mt-2">Formato: {documento.tipo}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Última visualização: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Download do documento "${documento.nome}" iniciado!`)}
              >
                <Download className="h-4 w-4" /> Baixar documento
              </button>
            </div>
          </div>
        );

      case "ata":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Título</p>
                  <p className="font-medium">{documento.titulo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data da Reunião</p>
                  <p className="font-medium">{format(new Date(documento.data!), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Participantes</p>
                  <p className="font-medium">{documento.participantes} pessoas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Responsável</p>
                  <p className="font-medium">{documento.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${documento.status === 'Aprovada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {documento.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conteúdo da Ata</h3>
              <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-auto bg-white">
                <h4 className="font-bold text-gray-800 mb-4">{documento.titulo}</h4>
                <p className="text-gray-700 mb-4">
                  Aos {format(new Date(documento.data!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}, 
                  reuniram-se {documento.participantes} membros para discutir assuntos pertinentes à instituição de ensino.
                </p>
                <p className="text-gray-700 mb-4">
                  A reunião foi conduzida por {documento.responsavel} e abordou os seguintes tópicos:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Apresentação das metas e resultados do último trimestre</li>
                  <li>Discussão das estratégias pedagógicas para o próximo período</li>
                  <li>Planejamento de atividades extracurriculares</li>
                  <li>Avaliação do desempenho dos estudantes</li>
                  <li>Demandas específicas dos departamentos</li>
                </ol>
                <p className="text-gray-700 mt-4">
                  Foram discutidos pontos importantes sobre o desenvolvimento de novas metodologias de ensino e 
                  a implementação de ferramentas tecnológicas para aprimorar o processo de aprendizagem.
                </p>
                <p className="text-gray-700 mt-4">
                  A reunião foi encerrada às 16:30, com os encaminhamentos registrados e distribuídos aos participantes.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Status: {documento.status}</span>
                    <span>Responsável: {documento.responsavel}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{documento.participantes} participantes</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Download da ata "${documento.titulo}" iniciado!`)}
              >
                <Download className="h-4 w-4" /> Baixar ata
              </button>
            </div>
          </div>
        );

      case "contrato":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Título</p>
                  <p className="font-medium">{documento.titulo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parceiro</p>
                  <p className="font-medium">{documento.parceiro}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Período</p>
                  <p className="font-medium">
                    {format(new Date(documento.inicio!), "dd/MM/yyyy", { locale: ptBR })} a {format(new Date(documento.fim!), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-medium">R$ {documento.valor?.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${documento.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                        documento.status === 'Em análise' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {documento.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes do Contrato</h3>
              <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-auto bg-white">
                <h4 className="font-bold text-gray-800 mb-4">Contrato: {documento.titulo}</h4>
                <p className="text-gray-700 mb-4">
                  Contrato firmado entre a Escola Digital 3D e {documento.parceiro} para {documento.titulo?.toLowerCase()},
                  com vigência de {format(new Date(documento.inicio!), "dd/MM/yyyy", { locale: ptBR })} a {format(new Date(documento.fim!), "dd/MM/yyyy", { locale: ptBR })}.
                </p>
                
                <h5 className="font-medium text-gray-800 mt-6 mb-3">Cláusulas Principais</h5>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>O presente contrato tem como objeto a prestação de serviços conforme descrição no anexo I.</li>
                  <li>O valor total do contrato é de R$ {documento.valor?.toLocaleString('pt-BR')}, a ser pago conforme cronograma financeiro.</li>
                  <li>O prazo de vigência do contrato é de 12 meses, podendo ser prorrogado mediante termo aditivo.</li>
                  <li>As partes se comprometem a cumprir as obrigações estabelecidas no anexo II deste contrato.</li>
                  <li>Os casos omissos serão resolvidos de comum acordo entre as partes.</li>
                </ol>
                
                <h5 className="font-medium text-gray-800 mt-6 mb-3">Responsabilidades</h5>
                <p className="text-gray-700 mb-4">
                  A contratada deverá fornecer todos os materiais e serviços conforme especificações técnicas e nos prazos estabelecidos.
                  A contratante se compromete a efetuar os pagamentos nas datas acordadas e fornecer as informações necessárias para a execução dos serviços.
                </p>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Status: {documento.status}</span>
                    <span>Valor: R$ {documento.valor?.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Vencimento: {format(new Date(documento.fim!), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Download do contrato "${documento.titulo}" iniciado!`)}
              >
                <Download className="h-4 w-4" /> Baixar contrato
              </button>
            </div>
          </div>
        );

      case "legislacao":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Título</p>
                  <p className="font-medium">{documento.titulo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número/Referência</p>
                  <p className="font-medium">{documento.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Publicação</p>
                  <p className="font-medium">{format(new Date(documento.dataPublicacao!), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Âmbito</p>
                  <p className="font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${documento.ambito === 'Federal' ? 'bg-blue-100 text-blue-800' : 
                        documento.ambito === 'Estadual' ? 'bg-purple-100 text-purple-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {documento.ambito}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${documento.categoria === 'Lei' ? 'bg-indigo-100 text-indigo-800' : 
                        documento.categoria === 'Resolução' ? 'bg-amber-100 text-amber-800' : 
                        documento.categoria === 'Portaria' ? 'bg-teal-100 text-teal-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {documento.categoria}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conteúdo da Legislação</h3>
              <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-auto bg-white">
                <h4 className="font-bold text-gray-800 mb-4">{documento.titulo}</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {documento.numero} - Publicado em {format(new Date(documento.dataPublicacao!), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                
                <p className="text-gray-700 mb-4">
                  O Presidente da República, faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:
                </p>
                
                {documento.titulo === "LDB - Lei de Diretrizes e Bases" && (
                  <>
                    <h5 className="font-medium text-gray-800 mt-6 mb-3">TÍTULO I - Da Educação</h5>
                    <p className="text-gray-700 mb-4">
                      Art. 1º A educação abrange os processos formativos que se desenvolvem na vida familiar, na convivência humana, no trabalho, nas instituições de ensino e pesquisa, nos movimentos sociais e organizações da sociedade civil e nas manifestações culturais.
                    </p>
                    <p className="text-gray-700 mb-4">
                      § 1º Esta Lei disciplina a educação escolar, que se desenvolve, predominantemente, por meio do ensino, em instituições próprias.
                    </p>
                    <p className="text-gray-700 mb-4">
                      § 2º A educação escolar deverá vincular-se ao mundo do trabalho e à prática social.
                    </p>
                    
                    <h5 className="font-medium text-gray-800 mt-6 mb-3">TÍTULO II - Dos Princípios e Fins da Educação Nacional</h5>
                    <p className="text-gray-700 mb-4">
                      Art. 2º A educação, dever da família e do Estado, inspirada nos princípios de liberdade e nos ideais de solidariedade humana, tem por finalidade o pleno desenvolvimento do educando, seu preparo para o exercício da cidadania e sua qualificação para o trabalho.
                    </p>
                  </>
                )}
                
                {documento.titulo !== "LDB - Lei de Diretrizes e Bases" && (
                  <p className="text-gray-700 mb-4">
                    Este documento contém normas e diretrizes específicas para a área educacional, estabelecendo critérios 
                    e procedimentos a serem seguidos pelas instituições de ensino conforme a legislação vigente.
                  </p>
                )}
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Categoria: {documento.categoria}</span>
                    <span>Âmbito: {documento.ambito}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileCheck className="h-4 w-4" />
                <span>Documento oficial publicado em {format(new Date(documento.dataPublicacao!), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Download da legislação "${documento.titulo}" iniciado!`)}
              >
                <Download className="h-4 w-4" /> Baixar documento
              </button>
            </div>
          </div>
        );

      case "aluno":
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Aluno</p>
                  <p className="font-medium">{documento.aluno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Turma</p>
                  <p className="font-medium">{documento.turma}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Documento</p>
                  <p className="font-medium">{documento.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Envio</p>
                  <p className="font-medium">{format(new Date(documento.dataEnvio!), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${documento.status === 'Completo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {documento.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visualização do Documento</h3>
              <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-auto bg-white flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-600">Documento: {documento.tipo}</p>
                <p className="text-sm text-gray-500 mt-2">Aluno: {documento.aluno}</p>
                <p className="text-xs text-gray-500 mt-1">Enviado em: {format(new Date(documento.dataEnvio!), "dd/MM/yyyy", { locale: ptBR })}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileCheck className="h-4 w-4" />
                <span>Status: {documento.status}</span>
              </div>
              
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => alert(`Download do documento do aluno "${documento.aluno}" iniciado!`)}
              >
                <Download className="h-4 w-4" /> Baixar documento
              </button>
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
              <h2 className="text-xl font-bold text-gray-800">
                {tipo === "institucional" ? documento.nome : 
                 tipo === "ata" ? documento.titulo :
                 tipo === "contrato" ? documento.titulo :
                 tipo === "legislacao" ? documento.titulo :
                 `${documento.tipo} - ${documento.aluno}`}
              </h2>
              <p className="text-gray-500">
                {tipo === "institucional" ? documento.tipo : 
                 tipo === "ata" ? `Ata - ${format(new Date(documento.data!), "dd/MM/yyyy", { locale: ptBR })}` :
                 tipo === "contrato" ? documento.parceiro :
                 tipo === "legislacao" ? documento.numero :
                 documento.turma}
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
          {renderDocumentContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentView; 