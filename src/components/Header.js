import React from 'react';
import { Plus, Package } from 'lucide-react';

const Header = ({ productCount, onAddClick, products }) => {
  const totalValue = products.reduce(
    (sum, p) => sum + (parseFloat(p.price) || 0), 0
  );

  const formattedValue = `$${totalValue.toLocaleString('es-CO', {
    maximumFractionDigits: 0,
  })}`;

  return (
    <header className="bg-[#09090f]/90 border-b border-white/[0.06]
                       sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[64px] gap-4">

          {/* Logo + stats */}
          <div className="flex items-center gap-6">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-[#0f0f1a] border border-white/[0.08]
                                rounded-xl flex items-center justify-center">
                  <Package size={18} className="text-[#c8ff00]" />
                </div>
                {/* Punto animado */}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5
                                 bg-[#c8ff00] rounded-full border-2 border-[#09090f]"
                      style={{ animation: 'pulseDot 2.5s ease infinite' }} />
              </div>

              <h1 className="font-display font-extrabold text-lg
                             tracking-tight text-white select-none">
                Product
                <span className="text-[#c8ff00]"> Vault</span>
              </h1>
            </div>

            {/* Separador */}
            <div className="hidden lg:block h-5 w-px bg-white/[0.08]" />

            {/* Stats — solo desktop */}
            <div className="hidden lg:flex items-center">
              <div className="bg-[#0f0f1a] border border-white/[0.06]
                              rounded-full px-4 py-1.5">
                <span className="text-[0.72rem] text-white/40 font-mono">
                  <span className="text-[#c8ff00] font-semibold">
                    {productCount}
                  </span>
                  {' '}productos · {' '}
                  <span className="text-[#c8ff00] font-semibold">
                    {formattedValue}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Botón agregar */}
          <button
            onClick={onAddClick}
            className="btn btn-primary text-[0.75rem] px-5 py-2.5 flex items-center gap-2 shadow-[0_0_20px_rgba(200,255,0,0.15)] hover:shadow-[0_0_25px_rgba(200,255,0,0.25)] transition-all duration-300"
            aria-label="Agregar producto"
          >
            <Plus size={16} className="flex-shrink-0" />
            <span className="hidden sm:inline">Agregar Producto</span>
            <span className="sm:hidden">Nuevo</span>
          </button>

        </div>

        {/* Stats móvil/tablet — oculto en LG+ */}
        <div className="lg:hidden pb-3">
          <div className="bg-[#0f0f1a] border border-white/[0.06]
                          rounded-xl px-4 py-2 text-center">
            <span className="text-[0.72rem] text-white/40 font-mono">
              <span className="text-[#c8ff00] font-semibold">{productCount}</span>
              {' '}productos · {' '}
              <span className="text-[#c8ff00] font-semibold">{formattedValue}</span>
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;