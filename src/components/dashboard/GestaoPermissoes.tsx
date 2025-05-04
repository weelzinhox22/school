import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Switch } from "@headlessui/react";
import { 
  UserCog, 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  Bookmark,
  Search,
  Shield,
  Check,
  Lock,
  BarChart2
} from "lucide-react";

// Permissões disponíveis no sistema
// Estas serão usadas para formar os rótulos na interface
type PermKey = 'verTurmas' | 'editarNotas' | 'relatorios' | 'gerenciarAlunos' | 'eventos' | 'financeiro' | 'documentacao';
const PERMISSOES_LABELS: Record<PermKey, string> = {
  verTurmas: "Visualizar turmas",
  editarNotas: "Editar notas",
  relatorios: "Acessar relatórios",
  gerenciarAlunos: "Gerenciar alunos",
  eventos: "Gerenciar eventos",
  financeiro: "Módulo financeiro",
  documentacao: "Módulo documentação"
};

// Dados mockados - serão substituídos por chamadas à API
const PERMISSOES_MOCK = [
  { 
    id: 1, 
    nome: "Maria Silva", 
    tipo: "Coordenador", 
    email: "maria@escola.com",
    permissoes: { 
      verTurmas: true, 
      editarNotas: true, 
      relatorios: true, 
      gerenciarAlunos: false, 
      eventos: true,
      financeiro: false,
      documentacao: true
    } 
  },
  { 
    id: 2, 
    nome: "João Souza", 
    tipo: "Professor", 
    email: "joao@escola.com",
    permissoes: { 
      verTurmas: true, 
      editarNotas: true, 
      relatorios: false, 
      gerenciarAlunos: false, 
      eventos: false,
      financeiro: false,
      documentacao: false
    } 
  },
  { 
    id: 3, 
    nome: "Ana Lima", 
    tipo: "Professor", 
    email: "ana@escola.com",
    permissoes: { 
      verTurmas: true, 
      editarNotas: false, 
      relatorios: false, 
      gerenciarAlunos: false, 
      eventos: false,
      financeiro: false,
      documentacao: false
    } 
  },
  { 
    id: 4, 
    nome: "Carlos Santos", 
    tipo: "Administrativo", 
    email: "carlos@escola.com",
    permissoes: { 
      verTurmas: false, 
      editarNotas: false, 
      relatorios: true, 
      gerenciarAlunos: true, 
      eventos: true,
      financeiro: true,
      documentacao: true
    } 
  },
  { 
    id: 5, 
    nome: "Fernanda Oliveira", 
    tipo: "Coordenador", 
    email: "fernanda@escola.com",
    permissoes: { 
      verTurmas: true, 
      editarNotas: true, 
      relatorios: true, 
      gerenciarAlunos: true, 
      eventos: true,
      financeiro: false,
      documentacao: true
    } 
  },
];

// Tipos de perfis disponíveis
const PERFIS = ["Todos", "Coordenador", "Professor", "Administrativo"];

// Interface para os objetos de permissão
interface Colaborador {
  id: number;
  nome: string;
  tipo: string;
  email: string;
  permissoes: Record<PermKey, boolean>;
}

/**
 * Componente de Gestão de Permissões
 * 
 * Este componente permite visualizar e gerenciar as permissões de acesso
 * dos diferentes colaboradores da instituição de ensino (coordenadores,
 * professores e pessoal administrativo).
 */
export default function GestaoPermissoes() {
  // Estados do componente
  const [permissoes, setPermissoes] = useState<Colaborador[]>(PERMISSOES_MOCK);
  const [colabPerm, setColabPerm] = useState<null | Colaborador>(null);
  const [filtroPerfil, setFiltroPerfil] = useState("Todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [perfilPresets, setPerfilPresets] = useState({
    coordenador: false,
    professor: false,
    administrativo: false
  });

  // Realiza a filtragem dos colaboradores com base nos filtros aplicados
  const colaboradoresFiltrados = permissoes.filter(colab => 
    (filtroPerfil === "Todos" || colab.tipo === filtroPerfil) &&
    (filtroTexto === "" || 
      colab.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      colab.email.toLowerCase().includes(filtroTexto.toLowerCase()))
  );

  // Contagens para estatísticas
  const contagemPorTipo = {
    "Coordenador": permissoes.filter(c => c.tipo === "Coordenador").length,
    "Professor": permissoes.filter(c => c.tipo === "Professor").length,
    "Administrativo": permissoes.filter(c => c.tipo === "Administrativo").length,
    "Total": permissoes.length
  };

  /**
   * Função para aplicar um modelo/preset de permissões 
   * com base no tipo de usuário
   */
  function aplicarPresetPermissoes(tipo: string) {
    if (!colabPerm) return;

    // Definição de permissões padrão por tipo de usuário
    let novasPermissoes: Record<PermKey, boolean> = {
      verTurmas: false,
      editarNotas: false,
      relatorios: false,
      gerenciarAlunos: false,
      eventos: false,
      financeiro: false,
      documentacao: false
    };

    // Atribuição de permissões conforme o tipo de perfil
    switch (tipo) {
      case "coordenador":
        novasPermissoes = {
          verTurmas: true,
          editarNotas: true,
          relatorios: true,
          gerenciarAlunos: true,
          eventos: true,
          financeiro: false,
          documentacao: true
        };
        setPerfilPresets({
          coordenador: true,
          professor: false,
          administrativo: false
        });
        break;
      case "professor":
        novasPermissoes = {
          verTurmas: true,
          editarNotas: true,
          relatorios: false,
          gerenciarAlunos: false,
          eventos: false,
          financeiro: false,
          documentacao: false
        };
        setPerfilPresets({
          coordenador: false,
          professor: true,
          administrativo: false
        });
        break;
      case "administrativo":
        novasPermissoes = {
          verTurmas: false,
          editarNotas: false,
          relatorios: true,
          gerenciarAlunos: true,
          eventos: true,
          financeiro: true,
          documentacao: true
        };
        setPerfilPresets({
          coordenador: false,
          professor: false,
          administrativo: true
        });
        break;
    }

    // Atualiza o estado com as novas permissões
    setColabPerm({ ...colabPerm, permissoes: novasPermissoes });
  }

  /**
   * Função para salvar as alterações de permissão
   */
  function handleSalvarPermissoes() {
    if (colabPerm) {
      // Atualiza o colaborador na lista
      setPermissoes(permissoes.map(c => c.id === colabPerm.id ? colabPerm : c));
      setColabPerm(null);
      setPerfilPresets({
        coordenador: false,
        professor: false,
        administrativo: false
      });
      toast.success("Permissões atualizadas com sucesso!");
    }
  }

  /**
   * Função para abrir o modal de edição de permissões
   */
  function handleEditarPermissoes(colab: Colaborador) {
    setColabPerm({ ...colab });
    
    // Reseta os presets ao abrir o modal
    setPerfilPresets({
      coordenador: false,
      professor: false,
      administrativo: false
    });
  }

  /**
   * Renderiza um contador de permissões ativas
   * para mostrar estatísticas sobre o colaborador
   */
  function renderContadorPermissoes(colab: Colaborador) {
    const total = Object.values(colab.permissoes).filter(Boolean).length;
    const max = Object.keys(colab.permissoes).length;
    
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Shield className="w-3.5 h-3.5" />
        <span>{total} de {max} permissões</span>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-indigo-600" />
              Gestão de Permissões
            </h2>
            <p className="text-gray-600">Gerencie o acesso dos usuários aos recursos do sistema.</p>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total de usuários */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Users className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Usuários</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Total}</p>
          </div>
        </motion.div>

        {/* Coordenadores */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-lg">
            <UserCog className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Coordenadores</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Coordenador}</p>
          </div>
        </motion.div>

        {/* Professores */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Professores</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Professor}</p>
          </div>
        </motion.div>

        {/* Administrativo */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <FileText className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Administrativo</p>
            <p className="text-2xl font-bold text-gray-800">{contagemPorTipo.Administrativo}</p>
          </div>
        </motion.div>
      </div>

      {/* Tabela principal com filtros */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Barra de filtros */}
        <div className="border-b border-gray-100 p-4 bg-gray-50 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 text-gray-400 bg-white border border-gray-200 rounded-lg p-2 px-3 shadow-sm">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou email..." 
              className="border-none outline-none bg-transparent w-full text-gray-700"
              value={filtroTexto}
              onChange={e => setFiltroTexto(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm" 
            value={filtroPerfil} 
            onChange={e => setFiltroPerfil(e.target.value)}
          >
            {PERFIS.map(perfil => (
              <option key={perfil} value={perfil}>{perfil}</option>
            ))}
          </select>
        </div>

        {/* Tabela com lista de colaboradores */}
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-700">Nome</th>
                <th className="py-3 font-semibold text-gray-700">Email</th>
                <th className="py-3 font-semibold text-gray-700">Função</th>
                <th className="py-3 font-semibold text-gray-700">Permissões</th>
                <th className="py-3 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {colaboradoresFiltrados.map(colab => (
                <tr key={colab.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-indigo-700">
                    {colab.nome}
                  </td>
                  <td className="py-3 text-gray-600">{colab.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      colab.tipo === "Coordenador" 
                        ? "bg-amber-100 text-amber-700" 
                        : colab.tipo === "Professor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {colab.tipo}
                    </span>
                  </td>
                  <td className="py-3 text-xs">
                    <div className="flex flex-wrap gap-1 mb-1 max-w-md">
                      {Object.entries(colab.permissoes).map(([key, value]) => (
                        value && (
                          <span 
                            key={key} 
                            className="inline-block bg-indigo-100 text-indigo-700 rounded px-2 py-1"
                            title={PERMISSOES_LABELS[key as PermKey]}
                          >
                            {PERMISSOES_LABELS[key as PermKey]}
                          </span>
                        )
                      ))}
                    </div>
                    {renderContadorPermissoes(colab)}
                  </td>
                  <td className="py-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => handleEditarPermissoes(colab)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mensagem quando não há colaboradores */}
          {colaboradoresFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Nenhum colaborador encontrado.</p>
              <p className="text-sm">Ajuste os filtros para visualizar resultados.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de edição de permissões */}
      {colabPerm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.95, y: 30 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 30 }} 
            transition={{ type: "spring", stiffness: 120 }} 
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserCog className="w-5 h-5 text-indigo-600" />
              Permissões de {colabPerm.nome}
            </h3>
            
            {/* Seleção rápida de perfis */}
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Aplicar modelo de permissão:</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={perfilPresets.coordenador ? "default" : "outline"}
                  className={perfilPresets.coordenador ? "bg-amber-500 hover:bg-amber-600" : ""}
                  onClick={() => aplicarPresetPermissoes("coordenador")}
                >
                  Coordenador
                </Button>
                <Button 
                  size="sm" 
                  variant={perfilPresets.professor ? "default" : "outline"}
                  className={perfilPresets.professor ? "bg-blue-500 hover:bg-blue-600" : ""}
                  onClick={() => aplicarPresetPermissoes("professor")}
                >
                  Professor
                </Button>
                <Button 
                  size="sm" 
                  variant={perfilPresets.administrativo ? "default" : "outline"}
                  className={perfilPresets.administrativo ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={() => aplicarPresetPermissoes("administrativo")}
                >
                  Administrativo
                </Button>
              </div>
            </div>
            
            {/* Lista de permissões com switches */}
            <div className="flex flex-col gap-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {Object.entries(PERMISSOES_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{label}</span>
                    {colabPerm.permissoes[key as PermKey] && (
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </span>
                    )}
                  </div>
                  <Switch
                    checked={colabPerm.permissoes[key as PermKey]}
                    onChange={(v: boolean) => setColabPerm(c => c ? { 
                      ...c, 
                      permissoes: { 
                        ...c.permissoes, 
                        [key]: v 
                      } 
                    } : c)}
                    className={`${colabPerm.permissoes[key as PermKey] ? 'bg-indigo-600' : 'bg-gray-200'} 
                               relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Ativar {label}</span>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${colabPerm.permissoes[key as PermKey] ? 'translate-x-6' : 'translate-x-1'}`}/>
                  </Switch>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setColabPerm(null)}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={handleSalvarPermissoes}
              >
                Salvar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 