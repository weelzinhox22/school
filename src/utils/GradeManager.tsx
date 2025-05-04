import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Student, Subject, Unit, Activity, GradesMap } from './imported/types';
import { searchStudents, getStudentGrades, saveGrade, mockSubjects, mockUnits, mockActivities, mockStudents } from './imported/mockData';
import { eventBus } from './imported/eventBus';
import { formatGrade, calculateAverage, isPassingGrade, getColorByIndex } from './imported/utils';
import { toast } from "react-hot-toast";
import { Users, Search, Save, Download, CheckSquare, FileText, BarChart, MessageCircle, Clock, Edit, Filter, RefreshCw, PieChart } from 'lucide-react';

/**
 * Componente para gerenciar lançamento de notas
 * Integra as funcionalidades do sistema importado na seção de lançamento de notas
 */
export function GradeManager({ turmaSelecionada }: { turmaSelecionada: string }) {
  // Estados
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // O professor só pode lançar notas da sua disciplina (fixada como Matemática)
  const [selectedSubject] = useState<Subject>(mockSubjects.find(s => s.name === 'Matemática') || mockSubjects[0]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(mockUnits[0]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>(mockActivities[0]);
  const [grades, setGrades] = useState<GradesMap>({});
  const [passingGrade] = useState<number>(7);
  const [showStats, setShowStats] = useState(false);
  
  // Novos estados para melhorias de UX
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed'); // Modo de visualização (detalhada ou resumida)
  const [focusedCell, setFocusedCell] = useState<{studentId: number, activityId: number} | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [studentsPerPage, setStudentsPerPage] = useState<number>(10);
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);
  
  // Depuração - imprimir a turma selecionada e os alunos disponíveis
  useEffect(() => {
    console.log("Turma selecionada:", turmaSelecionada);
    console.log("Alunos disponíveis:", mockStudents);
    console.log("Classes disponíveis:", mockStudents.map(s => s.class));
    
    // Verificar se a turma selecionada existe no mock
    const turmasDisponíveis = Array.from(new Set(mockStudents.map(s => s.class)));
    console.log("Turmas disponíveis:", turmasDisponíveis);
    
    if (!turmasDisponíveis.includes(turmaSelecionada)) {
      console.warn(`Turma ${turmaSelecionada} não encontrada nas turmas disponíveis: ${turmasDisponíveis.join(', ')}`);
    }
  }, [turmaSelecionada]);
  
  // Busca os alunos conforme a turma selecionada
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        // Filtrar alunos diretamente da lista mock de acordo com a turma selecionada
        console.log("Procurando alunos da turma:", turmaSelecionada);
        
        // Normalizar a turma selecionada (remover espaços e converter para maiúsculas)
        const normalizedTurma = turmaSelecionada.trim().toUpperCase();
        console.log("Turma normalizada:", normalizedTurma);
        
        // Primeiro, tentativa exata de correspondência
        let studentsData = mockStudents.filter(student => 
          student.class.trim().toUpperCase() === normalizedTurma
        );
        
        // Se não encontrar, tenta uma correspondência parcial
        if (studentsData.length === 0) {
          console.log("Tentando correspondência parcial...");
          studentsData = mockStudents.filter(student => 
            student.class.trim().toUpperCase().includes(normalizedTurma) || 
            normalizedTurma.includes(student.class.trim().toUpperCase())
          );
        }
        
        // Se ainda não encontrar, tenta apenas o primeiro caractere/número
        if (studentsData.length === 0 && normalizedTurma.length > 0) {
          console.log("Tentando correspondência pelo primeiro caractere...");
          const firstChar = normalizedTurma.charAt(0);
          studentsData = mockStudents.filter(student => 
            student.class.trim().toUpperCase().startsWith(firstChar)
          );
        }
        
        console.log("Alunos encontrados:", studentsData);
        
        if (studentsData.length === 0) {
          // Em último caso, tente exibir uma lista completa de alunos
          console.log("Nenhum aluno encontrado. Usando todos os alunos disponíveis.");
          setStudents(mockStudents);
          toast.error(`Nenhum aluno encontrado para a turma ${turmaSelecionada}. Exibindo todos os alunos disponíveis.`);
        } else {
          setStudents(studentsData);
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        toast.error("Não foi possível carregar os alunos.");
      } finally {
        setLoading(false);
      }
    };
    
    loadStudents();
  }, [turmaSelecionada]);
  
  // Filtra os alunos com base no termo de busca
  const filteredStudents = searchTerm.trim() === '' 
    ? students 
    : students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
  // Busca as notas para cada aluno
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      const allGrades: GradesMap = {};
      
      for (const student of students) {
        try {
          const studentGrades = await getStudentGrades(student.id);
          Object.assign(allGrades, studentGrades);
        } catch (error) {
          console.error(`Erro ao carregar notas do aluno ${student.id}:`, error);
        }
      }
      
      setGrades(allGrades);
      setLoading(false);
    };
    
    if (students.length > 0) {
      loadGrades();
    }
  }, [students]);
  
  // Atualiza uma nota específica
  const handleGradeChange = (studentId: number, value: string, activityId: number) => {
    const key = `${selectedSubject.id}-${selectedUnit.id}-${activityId}-${studentId}`;
    setGrades(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Salva todas as notas
  const handleSaveGrades = async () => {
    setLoading(true);
    
    try {
      // Para cada aluno, salva a nota de todas as atividades da unidade selecionada
      for (const student of students) {
        for (const activity of mockActivities) {
          const key = `${selectedSubject.id}-${selectedUnit.id}-${activity.id}-${student.id}`;
          const gradeValue = parseFloat(grades[key] || '0');
          
          if (gradeValue > 0) {
            await saveGrade(
              student.id,
              selectedSubject.id,
              selectedUnit.id,
              activity.id,
              gradeValue
            );
          }
        }
      }
      
      // Emite evento para notificar outros componentes sobre a atualização
      eventBus.emit('grades-updated', {
        subjectId: selectedSubject.id,
        unitId: selectedUnit.id
      });
      
      toast.success("Todas as notas foram salvas com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      toast.error("Não foi possível salvar as notas.");
    } finally {
      setLoading(false);
    }
  };
  
  // Exporta notas para Excel (simulação)
  const handleExportGrades = () => {
    toast.loading("Exportando notas para Excel...");
    
    // Simulação de exportação - em um caso real, isso chamaria uma API
    setTimeout(() => {
      toast.success("Notas exportadas com sucesso!");
    }, 1500);
  };
  
  // Calcula a média do aluno para a unidade e disciplina selecionadas
  const calculateStudentAverage = (studentId: number) => {
    const studentGrades: number[] = [];
    
    // Coleta todas as notas do aluno na disciplina e unidade selecionadas
    mockActivities.forEach(activity => {
      const key = `${selectedSubject.id}-${selectedUnit.id}-${activity.id}-${studentId}`;
      const grade = parseFloat(grades[key] || '0');
      if (grade > 0) {
        studentGrades.push(grade);
      }
    });
    
    return calculateAverage(studentGrades);
  };
  
  // Calcula a média do aluno para todas as unidades
  const calculateStudentTotalAverage = (studentId: number) => {
    const allUnitAverages: number[] = [];
    
    mockUnits.forEach(unit => {
      const unitGrades: number[] = [];
      mockActivities.forEach(activity => {
        const key = `${selectedSubject.id}-${unit.id}-${activity.id}-${studentId}`;
        const grade = parseFloat(grades[key] || '0');
        if (grade > 0) {
          unitGrades.push(grade);
        }
      });
      
      const unitAverage = calculateAverage(unitGrades);
      if (unitAverage > 0) {
        allUnitAverages.push(unitAverage);
      }
    });
    
    return calculateAverage(allUnitAverages);
  };
  
  // Calcula as estatísticas da turma para a unidade selecionada
  const calculateClassStats = () => {
    if (filteredStudents.length === 0) return { average: 0, approved: 0, pending: 0, failed: 0 };
    
    let totalSum = 0;
    let approved = 0;
    let pending = 0;
    let failed = 0;
    
    filteredStudents.forEach(student => {
      const avg = calculateStudentAverage(student.id);
      totalSum += avg;
      
      if (avg >= passingGrade) {
        approved++;
      } else if (avg >= 5) {
        pending++;
      } else {
        failed++;
      }
    });
    
    return {
      average: totalSum / filteredStudents.length,
      approved,
      pending,
      failed
    };
  };
  
  // Estatísticas calculadas
  const stats = calculateClassStats();
  
  // Verifica se nenhum aluno foi encontrado
  const noStudentsFound = students.length === 0 && !loading;

  // Função para navegar entre células com teclado
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, studentId: number, activityId: number) => {
    const studentIndex = filteredStudents.findIndex(s => s.id === studentId);
    const activityIndex = mockActivities.findIndex(a => a.id === activityId);
    
    // Referência para a próxima célula baseada nas teclas pressionadas
    let nextStudentIndex = studentIndex;
    let nextActivityIndex = activityIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        nextStudentIndex = Math.min(studentIndex + 1, filteredStudents.length - 1);
        break;
      case 'ArrowUp':
        nextStudentIndex = Math.max(studentIndex - 1, 0);
        break;
      case 'ArrowRight':
      case 'Tab':
        if (!e.shiftKey) {
          nextActivityIndex = Math.min(activityIndex + 1, mockActivities.length - 1);
          if (nextActivityIndex === activityIndex) {
            // Se já estiver na última atividade, vá para o próximo aluno
            nextStudentIndex = Math.min(studentIndex + 1, filteredStudents.length - 1);
            nextActivityIndex = 0;
          }
          e.preventDefault(); // Prevenir comportamento padrão do tab
        }
        break;
      case 'ArrowLeft':
      case 'Tab': // Shift+Tab
        if (e.shiftKey) {
          nextActivityIndex = Math.max(activityIndex - 1, 0);
          if (nextActivityIndex === activityIndex) {
            // Se já estiver na primeira atividade, vá para o aluno anterior
            nextStudentIndex = Math.max(studentIndex - 1, 0);
            nextActivityIndex = mockActivities.length - 1;
          }
          e.preventDefault(); // Prevenir comportamento padrão do tab
        }
        break;
      case 'Enter':
        nextStudentIndex = Math.min(studentIndex + 1, filteredStudents.length - 1);
        break;
      default:
        return; // Para outras teclas, não fazemos nada
    }
    
    // Se a posição mudou, mude o foco
    if (nextStudentIndex !== studentIndex || nextActivityIndex !== activityIndex) {
      const nextStudent = filteredStudents[nextStudentIndex];
      const nextActivity = mockActivities[nextActivityIndex];
      
      if (nextStudent && nextActivity) {
        const key = `${nextStudent.id}-${nextActivity.id}`;
        setFocusedCell({ studentId: nextStudent.id, activityId: nextActivity.id });
        
        setTimeout(() => {
          const input = inputRefs.current[key];
          if (input) {
            input.focus();
            input.select();
          }
        }, 0);
      }
    }
  };
  
  // Função para alternar entre modos de visualização
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'detailed' ? 'summary' : 'detailed');
  };
  
  // Função para acessar rapidamente uma célula específica
  const setInputRef = (studentId: number, activityId: number, el: HTMLInputElement | null) => {
    const key = `${studentId}-${activityId}`;
    if (el) {
      inputRefs.current[key] = el;
    } else if (inputRefs.current[key]) {
      delete inputRefs.current[key];
    }
  };
  
  // Função para calcular a média de todos os alunos em uma atividade específica
  const calculateActivityAverage = (activityId: number) => {
    if (filteredStudents.length === 0) return 0;
    
    let sum = 0;
    let count = 0;
    
    filteredStudents.forEach(student => {
      const key = `${selectedSubject.id}-${selectedUnit.id}-${activityId}-${student.id}`;
      const grade = parseFloat(grades[key] || '0');
      if (grade > 0) {
        sum += grade;
        count++;
      }
    });
    
    return count ? sum / count : 0;
  };

  // Calcular o número total de páginas
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  
  // Obter os alunos da página atual
  const getCurrentPageStudents = () => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  };
  
  // Controlar a visibilidade do cabeçalho fixo ao rolar
  useEffect(() => {
    const handleScroll = () => {
      const tableHeader = document.getElementById('grade-table-header');
      if (tableHeader) {
        const tableTop = tableHeader.getBoundingClientRect().top;
        setHeaderVisible(tableTop < 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full">
      {/* Cabeçalho e Controles */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> 
              Notas - {selectedSubject.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Turma {turmaSelecionada} - {students.length} alunos
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar aluno..."
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            
            <button 
              className="border border-indigo-200 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 flex items-center"
              onClick={handleExportGrades}
            >
              <Download className="w-4 h-4 mr-1" /> Exportar
            </button>
            
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center"
              onClick={handleSaveGrades}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-1" /> Salvar
            </button>
          </div>
        </div>
      </div>
      
      {/* Seletores de Unidade */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Filter className="w-4 h-4 text-indigo-600" /> Filtros e Configurações
          </h4>
          <button 
            className="text-sm text-indigo-600 flex items-center gap-1"
            onClick={() => setShowStats(!showStats)}
          >
            <PieChart className="w-4 h-4" />
            {showStats ? 'Ocultar estatísticas' : 'Mostrar estatísticas'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="text-sm font-medium text-gray-700 block mb-1">Unidade</label>
            <div className="flex flex-wrap gap-2">
              {mockUnits.map((unit) => (
                <button
                  key={unit.id}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedUnit.id === unit.id 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedUnit(unit)}
                >
                  {unit.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-700 block mb-1">Nota de aprovação</label>
            <div className="relative">
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={passingGrade}
                disabled
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 flex flex-col">
            <label className="text-sm font-medium text-gray-700 block mb-1">Ações</label>
            <div className="flex gap-2 h-full">
              <button
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg flex items-center justify-center"
                onClick={toggleViewMode}
                title={viewMode === 'detailed' ? 'Alternar para visualização resumida' : 'Alternar para visualização detalhada'}
              >
                {viewMode === 'detailed' ? 
                  <BarChart className="w-4 h-4 mr-1" /> : 
                  <Edit className="w-4 h-4 mr-1" />}
                {viewMode === 'detailed' ? 'Médias' : 'Notas'}
              </button>
              
              <button
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg flex items-center justify-center"
                onClick={() => setSearchTerm('')}
                disabled={searchTerm === ''}
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Limpar
              </button>
            </div>
          </div>
        </div>
        
        {/* Estatísticas da turma */}
        {showStats && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Estatísticas da Turma - {selectedUnit.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <BarChart className="w-4 h-4" /> Média da Turma
                </span>
                <span className={`font-medium ${
                  stats.average >= passingGrade ? 'text-green-700' : 
                  stats.average >= 5 ? 'text-amber-700' : 
                  'text-red-700'
                }`}>{formatGrade(stats.average)}</span>
              </div>
              <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-green-700">Aprovados</span>
                <span className="font-medium text-green-900">{stats.approved} ({filteredStudents.length > 0 ? (stats.approved / filteredStudents.length * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-amber-700">Recuperação</span>
                <span className="font-medium text-amber-900">{stats.pending} ({filteredStudents.length > 0 ? (stats.pending / filteredStudents.length * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="bg-red-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-red-700">Reprovados</span>
                <span className="font-medium text-red-900">{stats.failed} ({filteredStudents.length > 0 ? (stats.failed / filteredStudents.length * 100).toFixed(0) : 0}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Alerta quando não há alunos */}
      {noStudentsFound && (
        <div className="p-8 text-center bg-amber-50 border-b border-amber-200">
          <div className="text-amber-700 mb-2">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-medium text-lg">Nenhum aluno encontrado para a turma {turmaSelecionada}</h3>
          </div>
          <p className="text-amber-600">
            Verifique se a turma está correta ou se existem alunos cadastrados.
          </p>
        </div>
      )}
      
      {/* Cabeçalho fixo que aparece ao rolar */}
      {headerVisible && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md transition-all duration-300">
          <div className="flex items-center justify-between p-3 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-indigo-700">
                Notas: {selectedUnit.name}
              </span>
              <span className="text-sm text-gray-500">
                Turma {turmaSelecionada} ({filteredStudents.length} alunos)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                onClick={handleSaveGrades}
              >
                <Save className="w-4 h-4 inline mr-1" /> Salvar Notas
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabela de notas - Versão melhorada com paginação */}
      <div className="overflow-x-auto" id="grade-table-wrapper">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left" id="grade-table">
              <thead id="grade-table-header">
                <tr className="text-indigo-700 border-b bg-indigo-50/50">
                  <th className="py-3 px-4 font-medium sticky left-0 bg-indigo-50/50 z-10">Aluno</th>
                  <th className="py-3 px-4 font-medium text-center bg-indigo-50/70" colSpan={mockActivities.length}>
                    Atividades - {selectedUnit.name}
                  </th>
                  <th className="py-3 px-4 font-medium text-center">Média da Unidade</th>
                  <th className="py-3 px-4 font-medium text-center">Média Geral</th>
                  <th className="py-3 px-4 font-medium text-center">Situação</th>
                </tr>
                <tr className="text-indigo-700 border-b bg-indigo-50/30">
                  <th className="py-2 px-4 sticky left-0 bg-indigo-50/30 z-10"></th>
                  {mockActivities.map((activity) => (
                    <th key={activity.id} className="py-2 px-2 text-center text-xs font-medium">
                      {activity.name}
                      {viewMode === 'summary' && (
                        <div className="text-xs mt-1 font-normal">
                          Média: <span className={`font-medium ${
                            calculateActivityAverage(activity.id) >= passingGrade ? 'text-green-700' : 
                            calculateActivityAverage(activity.id) >= 5 ? 'text-amber-700' : 
                            'text-red-700'
                          }`}>
                            {formatGrade(calculateActivityAverage(activity.id))}
                          </span>
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="py-2 px-4"></th>
                  <th className="py-2 px-4"></th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={mockActivities.length + 4} className="py-6 text-center text-gray-500">
                      {searchTerm ? 'Nenhum aluno encontrado com este termo de busca.' : 'Nenhum aluno disponível para esta turma.'}
                    </td>
                  </tr>
                ) : (
                  getCurrentPageStudents().map((student, index) => {
                    const unitAverage = calculateStudentAverage(student.id);
                    const totalAverage = calculateStudentTotalAverage(student.id);
                    const passing = isPassingGrade(unitAverage, passingGrade);
                    
                    return (
                      <tr 
                        key={student.id} 
                        className={`border-b last:border-b-0 hover:bg-indigo-50/40 transition-colors ${
                          filteredStudents.some(s => s.id === focusedCell?.studentId) && student.id === focusedCell?.studentId 
                            ? 'bg-indigo-50/70' 
                            : index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                        }`}
                      >
                        <td className="py-4 px-4 sticky left-0 z-10 bg-inherit">
                          <div className="font-medium text-indigo-900">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.class} - {student.shift}</div>
                        </td>
                        
                        {mockActivities.map((activity) => {
                          const key = `${selectedSubject.id}-${selectedUnit.id}-${activity.id}-${student.id}`;
                          const gradeValue = grades[key] || '';
                          
                          // Se estivermos no modo resumido, mostrar apenas médias
                          if (viewMode === 'summary') {
                            return (
                              <td key={`${student.id}-${activity.id}`} className="py-3 px-2 text-center">
                                <span className={`inline-block font-medium px-2 py-1 rounded-md ${
                                  gradeValue && parseFloat(gradeValue) < 5 ? 'bg-red-50 text-red-700' :
                                  gradeValue && parseFloat(gradeValue) < 7 ? 'bg-amber-50 text-amber-700' :
                                  gradeValue ? 'bg-green-50 text-green-700' : 'text-gray-400'
                                }`}>
                                  {gradeValue || '-'}
                                </span>
                              </td>
                            );
                          }
                          
                          return (
                            <td key={`${student.id}-${activity.id}`} className="py-3 px-2">
                              <div className="flex justify-center">
                                <input 
                                  type="number" 
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  className={`w-14 border ${
                                    focusedCell?.studentId === student.id && focusedCell?.activityId === activity.id
                                      ? 'border-indigo-400 ring-2 ring-indigo-300'
                                      : 'border-gray-300 hover:border-indigo-300'
                                  } rounded-lg p-2 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                    gradeValue && parseFloat(gradeValue) < 5 ? 'bg-red-50 text-red-700' :
                                    gradeValue && parseFloat(gradeValue) < 7 ? 'bg-amber-50 text-amber-700' :
                                    gradeValue ? 'bg-green-50 text-green-700' : ''
                                  }`}
                                  value={gradeValue}
                                  onChange={(e) => handleGradeChange(student.id, e.target.value, activity.id)}
                                  onKeyDown={(e) => handleKeyDown(e, student.id, activity.id)}
                                  onFocus={() => setFocusedCell({ studentId: student.id, activityId: activity.id })}
                                  ref={(el) => setInputRef(student.id, activity.id, el)}
                                  placeholder="-"
                                  title={`Nota de ${activity.name} para ${student.name}`}
                                />
                              </div>
                            </td>
                          );
                        })}
                        
                        <td className="py-4 px-4">
                          <div className={`font-bold text-center px-3 py-1.5 rounded-lg ${
                            unitAverage >= 7 ? 'bg-green-100 text-green-800' : 
                            unitAverage >= 5 ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {formatGrade(unitAverage)}
                          </div>
                        </td>
                        
                        <td className="py-4 px-4">
                          <div className={`font-bold text-center px-3 py-1.5 rounded-lg ${
                            totalAverage >= 7 ? 'bg-green-100 text-green-800' : 
                            totalAverage >= 5 ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {formatGrade(totalAverage)}
                          </div>
                        </td>
                        
                        <td className="py-4 px-4 text-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            totalAverage >= 7 ? 'bg-green-100 text-green-800' : 
                            totalAverage >= 5 ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {totalAverage >= 7 ? 'Aprovado' : totalAverage >= 5 ? 'Recuperação' : 'Reprovado'}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
            {/* Controles de paginação */}
            {filteredStudents.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Total: {filteredStudents.length} alunos
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Por página:</label>
                    <select 
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                      value={studentsPerPage}
                      onChange={(e) => {
                        setStudentsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset para a primeira página
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="50">Todos</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    title="Primeira página"
                  >
                    &laquo;
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    title="Página anterior"
                  >
                    &lsaquo;
                  </button>
                  
                  <span className="px-3 py-1 text-sm">
                    Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    title="Próxima página"
                  >
                    &rsaquo;
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    title="Última página"
                  >
                    &raquo;
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    className="border border-indigo-200 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 flex items-center"
                    onClick={() => setSearchTerm('')}
                    disabled={searchTerm === ''}
                  >
                    Limpar Busca
                  </button>
                  
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center"
                    onClick={handleSaveGrades}
                    disabled={loading}
                  >
                    <CheckSquare className="w-4 h-4 mr-1" /> Salvar Notas
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Dicas de atalhos de teclado */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-between items-center text-xs">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Aprovado (≥ 7,0)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Recuperação (5,0 a 6,9)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Reprovado (&lt; 5,0)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
            <span>Sem nota lançada</span>
          </div>
        </div>
        <div className="text-gray-500 mt-3 md:mt-0">
          <span className="mr-3"><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Tab</kbd> ou <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">→</kbd>: Próxima atividade</span>
          <span className="mr-3"><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">↓</kbd> ou <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd>: Próximo aluno</span>
        </div>
      </div>
    </div>
  );
} 