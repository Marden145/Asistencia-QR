import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span style={{ color: 'rgba(224,242,254,0.7)' }}>Ingresos:</span>
          <span className="font-medium" style={{ color: '#e0f2fe' }}>
            ₡{p.value.toLocaleString('es-CR')}
          </span>
        </div>
      ))}
    </div>
  );
};

const IngresosSemanaChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 h-full"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(147,197,253,0.1)'
      }}
    >
      <div className="mb-6">
        <h3 className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
          Ingresos Semanales
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
          Recaudación del mes actual
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
            tickFormatter={(value) => `₡${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147,197,253,0.04)' }} />
          {/* Usamos un color verde esmeralda para representar dinero */}
          <Bar dataKey="monto" name="Monto" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default IngresosSemanaChart;