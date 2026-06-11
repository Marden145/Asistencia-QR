import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute    from './components/PrivateRoute';
import Navbar          from './components/Navbar';
import Login           from './pages/Login';
import Personas        from './pages/Personas';
import Escanear        from './pages/Escanear';
import Asistencia      from './pages/Asistencia';
import Dashboard       from './pages/Dashboard';
import Inventario      from './pages/Inventario';
import PersonasJuntaDirectiva from './pages/PersonasJuntaDirectiva';
import { SessionProvider }         from './context/SessionContext';
import SessionExpiradaModal        from './components/SessionExpiradaModal';
import { ToastProvider } from './context/ToastContext';
function App() {
  return (
  <SessionProvider>
    <AuthProvider>
      <ToastProvider>
      
      <BrowserRouter>
      <SessionExpiradaModal />
        <Routes>

          {/* Ruta pública — no requiere login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas — requieren login */}
          <Route path="/personas" element={
            <PrivateRoute>
              <Navbar />
              <Personas />
            </PrivateRoute>
          } />

          <Route path="/escanear" element={
            <PrivateRoute>
              <Navbar />
              <Escanear />
            </PrivateRoute>
          } />

          <Route path="/asistencia" element={
            <PrivateRoute>
              <Navbar />
              <Asistencia />
            </PrivateRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/inventario" element={
            <PrivateRoute>
              <Navbar />
              <Inventario />
            </PrivateRoute>
          } />
          <Route path="/personas-junta-directiva" element={
            <PrivateRoute>
              <Navbar />
              <PersonasJuntaDirectiva />
            </PrivateRoute>
          } />
          

          {/* Si va a / lo manda al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </SessionProvider>
    
  );
}

export default App;
