import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const gradeColor: Record<string, string> = {
  S: 'text-yellow-400', A: 'text-green-400', B: 'text-blue-400',
  C: 'text-orange-400', D: 'text-red-400', F: 'text-red-600'
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/analysis`);
      return res.json();
    }
  });

  const analyses = data?.data || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard AguaFlow</h1>
          <p className="text-slate-400">Análisis de inteligencia empresarial en tiempo real</p>
        </div>
        <Link
          to="/analysis/new"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          + Nuevo Análisis
        </Link>
      </div>

      {/* AGUA FLOW explanation */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {[
          { letter: 'A', name: 'Agilidad', desc: 'Velocidad de ejecución', color: 'bg-blue-500/20 border-blue-500/40' },
          { letter: 'G', name: 'Crecimiento', desc: 'Indicadores de expansión', color: 'bg-green-500/20 border-green-500/40' },
          { letter: 'U', name: 'Unidad', desc: 'Cohesión de equipo', color: 'bg-purple-500/20 border-purple-500/40' },
          { letter: 'A', name: 'Adaptabilidad', desc: 'Flexibilidad ante cambios', color: 'bg-yellow-500/20 border-yellow-500/40' },
          { letter: 'F', name: 'Flujo', desc: 'Eficiencia del workflow', color: 'bg-cyan-500/20 border-cyan-500/40' }
        ].map(({ letter, name, desc, color }) => (
          <div key={name} className={`border rounded-xl p-4 text-center ${color}`}>
            <p className="text-3xl font-black text-white mb-1">{letter}</p>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-white mb-2">Sin análisis todavía</h2>
          <p className="text-slate-400 mb-6">Crea tu primer análisis AGUA FLOW</p>
          <Link to="/analysis/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-500 transition-colors">
            Empezar análisis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {analyses.map((a: any) => (
            <Link key={a.id} to={`/analysis/${a.id}`} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{a.company?.name}</h3>
                <span className={`text-2xl font-black ${gradeColor[a.grade || 'F']}`}>
                  {a.grade || '?'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-3">{new Date(a.createdAt).toLocaleDateString('es-ES')}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.status === 'COMPLETE' ? 'bg-green-500/20 text-green-400' :
                  a.status === 'ANALYZING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-slate-600 text-slate-400'
                }`}>{a.status}</span>
                <span className="text-xs text-slate-500">Score: {a.overallScore?.toFixed(0) || '—'}/100</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
