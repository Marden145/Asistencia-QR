import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3"
      style={{
        background: 'rgba(11,17,32,0.97)',
        border: '0.5px solid rgba(147,197,253,0.15)',
        backdropFilter: 'blur(16px)'
      }}>
      <p className="text-xs font-medium mb-2" style={{ color: 'rgba(147,197,253,0.6)' }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1 last:mb-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span style={{ color: 'rgba(224,242,254,0.7)' }}>{p.name}:</span>
          </div>
          <span className="font-medium" style={{ color: '#e0f2fe' }}>
            {p.value} {p.value === 1 ? 'persona' : 'personas'}
          </span>
        </div>
      ))}
    </div>
  );
};

const EstadoPagosChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 h-full"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(147,197,253,0.1)'
      }}
    >
      <div className="mb-6">
        <h3 className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
          Estado de Pagos
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
          Personas al día vs Pendientes
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(147,197,253,0.06)" vertical={false} />
          <XAxis
            dataKey="semana"
            tick={{ fontSize: 11, fill: 'rgba(147,197,253,0.4)', fontFamily: 'inherit' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'rgba(147,197,253,0.4)', fontFamily: 'inherit' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147,197,253,0.04)' }} />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: 'rgba(147,197,253,0.5)', paddingTop: '16px' }}
          />
          {/* Barras agrupadas */}
          <Bar dataKey="pagaron" name="Pagaron" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.85} maxBarSize={40} />
          <Bar dataKey="deben" name="Deben" fill="#f87171" radius={[4, 4, 0, 0]} opacity={0.85} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default EstadoPagosChart;