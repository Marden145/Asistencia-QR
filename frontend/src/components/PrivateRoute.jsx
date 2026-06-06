import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Si hay usuario logueado, muestra la página
  // Si no hay usuario, redirige al login
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;