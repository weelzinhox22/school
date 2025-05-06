import { motion } from "framer-motion";
import { Users, BookOpen, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

// Interface para as props do componente
interface VisaoGeralProps {
  chartData: any[];
  cardVariants: any;
  compareTurnos: boolean;
  TURNO_COLORS: { [key: string]: string };
}

// Componente de Visão Geral do Dashboard
export default function VisaoGeral({ chartData, cardVariants, compareTurnos, TURNO_COLORS }: VisaoGeralProps) {
  return (
    <motion.div 
      key="visao" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }} 
      transition={{ duration: 0.3 }}
    >
      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card de Alunos */}
        <motion.div 
          custom={0} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-200"
        >
          <Users className="w-12 h-12 text-indigo-600 mb-4" />
          <span className="text-4xl font-bold text-indigo-700 mb-2">320</span>
          <span className="text-indigo-600 font-medium">Alunos</span>
          <div className="mt-4 text-sm text-indigo-500">
            <span className="font-medium">↑ 5%</span> desde o último mês
          </div>
        </motion.div>

        {/* Card de Professores */}
        <motion.div 
          custom={1} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-200"
        >
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <span className="text-4xl font-bold text-purple-700 mb-2">24</span>
          <span className="text-purple-600 font-medium">Professores</span>
          <div className="mt-4 text-sm text-purple-500">
            <span className="font-medium">+2</span> novos este mês
          </div>
        </motion.div>

        {/* Card de Turmas */}
        <motion.div 
          custom={2} 
          variants={cardVariants} 
          initial="hidden" 
          animate="visible" 
          className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-200"
        >
          <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
          <span className="text-4xl font-bold text-blue-700 mb-2">8</span>
          <span className="text-blue-600 font-medium">Turmas</span>
          <div className="mt-4 text-sm text-blue-500">
            <span className="font-medium">100%</span> ativas
          </div>
        </motion.div>
      </div>
              
      {/* Gráfico de notas médias com design melhorado */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.2 }} 
        className="bg-white rounded-xl shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-3">
            <BarChart2 className="w-8 h-8" />
            Notas médias por turma/turno
          </h2>
        </div>

        {/* Container do gráfico com altura fixa para melhor visualização */}
        <div className="h-[400px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="turma" 
                tick={{ fill: '#4B5563' }} 
                axisLine={{ stroke: '#9CA3AF' }}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fill: '#4B5563' }} 
                axisLine={{ stroke: '#9CA3AF' }}
                tickFormatter={(value) => `${value.toFixed(1)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px'
                }}
              />
              {compareTurnos ? (
                <>
                  <Bar 
                    dataKey="Manhã" 
                    fill={TURNO_COLORS["Manhã"]} 
                    radius={[8, 8, 0, 0]}
                    name="Turno Manhã"
                  />
                  <Bar 
                    dataKey="Tarde" 
                    fill={TURNO_COLORS["Tarde"]} 
                    radius={[8, 8, 0, 0]}
                    name="Turno Tarde"
                  />
                </>
              ) : (
                chartData.map((d, i) => (
                  d.media !== null && (
                    <Bar 
                      key={d.turma} 
                      dataKey="media" 
                      data={[d]} 
                      name={d.turma} 
                      fill={d.color} 
                      radius={[8, 8, 0, 0]} 
                      xAxisId={0}
                    />
                  )
                ))
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda adicional com informações relevantes */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-indigo-50 rounded-lg p-3">
            <div className="text-sm text-indigo-600 font-medium">Média Geral</div>
            <div className="text-2xl font-bold text-indigo-700">7.8</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-600 font-medium">Melhor Turma</div>
            <div className="text-2xl font-bold text-green-700">8.4</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="text-sm text-amber-600 font-medium">Meta Bimestral</div>
            <div className="text-2xl font-bold text-amber-700">8.0</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 