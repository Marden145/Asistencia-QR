import { motion }           from 'framer-motion';
import { getWeek, getYear } from 'date-fns';
import useAsistencia        from '../hooks/useAsistencia';
import StatCard             from '../components/Dashboard/StatCard';
import AttendanceChart      from '../components/Dashboard/AttendanceChart';
import DistribucionChart    from '../components/Dashboard/DistribucionChart';
import WeeklyTable          from '../components/Dashboard/WeeklyTable';

const iconPresentes = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#22c55e" strokeWidth="1.8">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const iconAusentes = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#f87171" strokeWidth="1.8">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const iconPersonas = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#93c5fd" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const iconPorcentaje = (color) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const Dashboard = () => {
  const { metricas, loading, error, semana, año, setSemana, setAño } = useAsistencia();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2"
            style={{ borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3b82f6' }}
          />
          <p className="text-sm" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Cargando métricas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <p className="text-sm" style={{ color: 'rgba(239,68,68,0.7)' }}>{error}</p>
      </div>
    );
  }

  const pctColor = metricas.porcentaje >= 80 ? '#22c55e' : '#fb923c';

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#e0f2fe' }}>
            Dashboard
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Semana {semana} — {año}
          </p>
        </div>

        {/* Selector de semana */}
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(147,197,253,0.12)'
          }}>
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.45)' }}>
            Semana
          </span>
          <input
            type="number"
            value={semana}
            min={1}
            max={52}
            onChange={e => setSemana(Number(e.target.value))}
            className="w-12 text-center text-sm font-medium outline-none bg-transparent"
            style={{ color: '#93c5fd' }}
          />
          <div className="w-px h-4" style={{ background: 'rgba(147,197,253,0.12)' }} />
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.45)' }}>
            Año
          </span>
          <input
            type="number"
            value={año}
            onChange={e => setAño(Number(e.target.value))}
            className="w-16 text-center text-sm font-medium outline-none bg-transparent"
            style={{ color: '#93c5fd' }}
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { titulo: 'Total personas',   valor: metricas.totalPersonas, subtitulo: 'registros activos',   icon: iconPersonas,              accentColor: '#93c5fd', delay: 0.1  },
          { titulo: 'Presentes',        valor: metricas.presentes,     subtitulo: 'esta semana',          icon: iconPresentes,             accentColor: '#22c55e', delay: 0.15 },
          { titulo: 'Ausentes',         valor: metricas.ausentes,      subtitulo: 'esta semana',          icon: iconAusentes,              accentColor: '#f87171', delay: 0.2  },
          { titulo: 'Tasa asistencia',  valor: `${metricas.porcentaje}%`, subtitulo: 'del total',        icon: iconPorcentaje(pctColor),  accentColor: pctColor,  delay: 0.25 },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <AttendanceChart data={metricas.porDia} />
        </div>
        <div>
          <DistribucionChart
            presentes={metricas.presentes}
            ausentes={metricas.ausentes}
          />
        </div>
      </div>

      {/* Tabla semanal */}
      <WeeklyTable asistencias={metricas.asistencias} />

    </div>
  );
};

export default Dashboard;