import QRScanner from '../components/QR/QRScanner';
import SesionControl from '../components/Sesion/SesionControl';
import { useState } from 'react';
const Escanear = () => {
  const [scannerHabilitado, setScannerHabilitado] = useState(false);

  const handleSesionCambia = (estaAbierta) => {
    if (estaAbierta) {
      // habilitar el scanner
      setScannerHabilitado(true);
    } else {
      // deshabilitar el scanner — no tiene sentido escanear sin sesión
      setScannerHabilitado(false);
    }
  };
  return (
     <div
      className="min-h-screen p-8 flex flex-col items-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <SesionControl onSesionCambia={handleSesionCambia} />
      {scannerHabilitado ? <QRScanner />: <p>Scanner deshabilitado</p> }
    </div>
  );
};

export default Escanear;