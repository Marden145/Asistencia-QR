import { AnimatePresence } from 'framer-motion';
import ToastItem           from './ToastItem';

const ToastContainer = ({ toasts = [], onEliminar }) => {
  return (
    <div
      className="fixed z-[9998] flex flex-col-reverse gap-3" 
      style={{ top: '24px', right: '24px', maxWidth: '360px', width: '100%' }}
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts?.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onEliminar={onEliminar}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;