import { createContext, useContext } from 'react';
import { useToast }                  from '../hooks/useToast';
import ToastContainer                from '../components/Toast/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onEliminar={toast.eliminar} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);