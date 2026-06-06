import { motion }                                    from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip,
         Legend, ResponsiveContainer }               from 'recharts';

const COLORES = ['#22c55e', '#f87171'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3"
      style={{
        background: 'rgba(11,17,32,0.97)',
        border: '0.5px solid rgba(147,197,253,0.15)'
      }}>
      <p className="text-xs" style={{ color: 'rgba(147,197,253,0.6)' }}>
        {payload[0].name}:
        <span className="ml-1 font-medium" style={{ color: '#e0f2fe' }}>
          {payload[0].value} personas
        </span>
      </p>
    </div>
  );
};

const DistribucionChart = ({ presentes, ausentes }) => {
  const data = [
    { name: 'Presentes', value: presentes },
    { name: 'Ausentes',  value: ausentes  }
  ];

  const sinDatos = presentes === 0 && ausentes === 0;

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
          Distribución
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
          Presencia vs ausencia
        </p>
      </div>

      {sinDatos ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="rgba(147,197,253,0.2)" strokeWidth="1.2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <p className="text-sm" style={{ color: 'rgba(147,197,253,0.3)' }}>
            Sin datos esta semana
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORES[i]} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                color: 'rgba(147,197,253,0.5)',
                paddingTop: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default DistribucionChart;