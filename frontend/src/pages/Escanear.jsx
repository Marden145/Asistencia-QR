import QRScanner     from '../components/QR/QRScanner';
import SesionControl from '../components/Sesion/SesionControl';
import { useState }  from 'react';
import sesionService from '../services/sesion.service';

const Escanear = () => {
  const [scannerHabilitado, setScannerHabilitado] = useState(false);

  const handleSesionCambia = (estaAbierta) => {
    setScannerHabilitado(estaAbierta);
  };

  return (
  <div
    className="min-h-screen p-4 md:p-8 flex flex-col items-center"
    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
  >
    <SesionControl onSesionCambia={handleSesionCambia} />

    {scannerHabilitado
      ? <QRScanner />
      : (
        <p className="text-sm mt-4 text-center px-4" style={{ color: 'rgba(147,197,253,0.3)' }}>
          Abre una sesión para habilitar el scanner
        </p>
      )
    }
  </div>
);
};

export default Escanear;