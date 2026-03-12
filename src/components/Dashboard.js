import React from 'react';
import { Package, DollarSign } from 'lucide-react';

const Dashboard = ({ products }) => {
  const total      = products.length;
  const valor      = products.reduce(
    (s, p) => s + (parseFloat(p.price) || 0), 0
  );

  const cards = [
    {
      title:   'Total Productos',
      value:   total > 0 ? total.toLocaleString() : '0',
      icon:    Package,
      color:   'text-[#c8ff00]',
      bg:      'bg-[#c8ff00]/10',
      border:  'hover:border-[#c8ff00]/30',
    },
    {
      title:   'Valor del Catálogo',
      value:   `$${valor.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`,
      icon:    DollarSign,
      color:   'text-blue-400',
      bg:      'bg-blue-500/10',
      border:  'hover:border-blue-500/30',
    },
  ];

  return (
    <div className="mb-6">
      {/* Título sección */}
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-5 bg-[#c8ff00] rounded-full inline-block" />
        <h2 className="font-display font-bold text-white text-base">
          Resumen del Catálogo
        </h2>
      </div>

      {/* Grid KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-[#0f0f1a] border border-white/[0.07] rounded-2xl p-5
                         transition-all duration-200 ${card.border}
                         hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Ícono + número */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center
                                justify-center flex-shrink-0 ${card.bg}`}>
                  <Icon size={18} className={card.color} />
                </div>
                <span className="font-display font-bold text-2xl text-white leading-none">
                  {card.value}
                </span>
              </div>

              {/* Label */}
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider">
                {card.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;