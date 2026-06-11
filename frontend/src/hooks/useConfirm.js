import { useState, useCallback } from 'react';

const useConfirm = () => {
  const [state, setState] = useState({ isOpen: false, data: null });

  const abrirConfirmacion = useCallback((data = null) => {
    setState({ isOpen: true, data });
  }, []);

  const cerrarConfirmacion = useCallback(() => {
    setState({ isOpen: false, data: null });
  }, []);

  return {
    isOpen: state.isOpen,
    confirmData: state.data,
    abrirConfirmacion,
    cerrarConfirmacion
  };
};
export default useConfirm;