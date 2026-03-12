import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // ✅ removeToast se define PRIMERO 
  const removeToast = useCallback((id) => { 
    setToasts(prev => prev.filter(t => t.id !== id)); 
  }, []); 

  // ✅ showToast se define DESPUÉS — puede usar removeToast 
  const showToast = useCallback((message, type = 'info', duration = 3000) => { 
    const id = Date.now() + Math.random(); 
    setToasts(prev => [...prev, { id, message, type }]); 
    setTimeout(() => removeToast(id), duration); 
  }, [removeToast]); 

  return { toasts, showToast, removeToast }; 
};