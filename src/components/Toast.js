import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, onRemove }) => {
  const timersRef = useRef({});

  useEffect(() => {
    const currentTimers = timersRef.current;
    
    toasts.forEach(toast => {
      if (!currentTimers[toast.id]) {
        currentTimers[toast.id] = setTimeout(() => {
          onRemove(toast.id);
          delete currentTimers[toast.id];
        }, 5000);
      }
    });

    return () => {
      Object.keys(currentTimers).forEach(id => {
        if (!toasts.find(t => t.id === id)) {
          clearTimeout(currentTimers[id]);
          delete currentTimers[id];
        }
      });
    };
  }, [toasts, onRemove]);

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-emerald-900/90',
          borderColor: 'border-emerald-400/25',
          textColor: 'text-emerald-100',
          iconColor: 'text-emerald-400'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-900/90',
          borderColor: 'border-red-400/25',
          textColor: 'text-red-100',
          iconColor: 'text-red-400'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-900/90',
          borderColor: 'border-blue-400/25',
          textColor: 'text-blue-100',
          iconColor: 'text-blue-400'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-[#16162a]/90',
          borderColor: 'border-white/10',
          textColor: 'text-white/90',
          iconColor: 'text-white/40'
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3">
      {toasts.map(toast => {
        const config = getToastConfig(toast.type);
        const IconComponent = config.icon;

        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm
              animate-slide-right transform transition-all duration-300
              ${config.bgColor} ${config.borderColor} ${config.textColor}
              max-w-sm
            `}
          >
            <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />

            <p className="flex-1 text-sm leading-relaxed">
              {toast.message}
            </p>

            <button
              onClick={() => onRemove(toast.id)}
              className="text-white/40 hover:text-white/80 transition-colors p-1 -m-1"
              aria-label="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;