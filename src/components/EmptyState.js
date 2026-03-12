import React from 'react';
import { Plus, FilterX,  PackageOpen, SearchX } from 'lucide-react';

const EmptyState = ({ hasFilters, onClearFilters, onAddClick }) => {
  return (
    <div className="col-span-full flex flex-col items-center
                    justify-center py-20 px-6 text-center">

      {/* Ícono principal */}
      <div className="mb-6 opacity-15">
        {hasFilters
          ? <SearchX size={72} className="text-white mx-auto" />
          : <PackageOpen size={72} className="text-white mx-auto" />
        }
      </div>

      {/* Título */}
      <h3 className="font-display font-bold text-xl text-white/70 mb-3">
        {hasFilters ? 'Sin resultados' : 'Inventario vacío'}
      </h3>

      {/* Subtítulo */}
      <p className="text-sm text-white/30 mb-8 max-w-xs leading-relaxed">
        {hasFilters
          ? 'No hay productos que coincidan con los filtros. Prueba con otros criterios.'
          : 'Tu inventario está vacío. Agrega tu primer producto para comenzar.'}
      </p>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {hasFilters ? (
          <>
            <button
              onClick={onClearFilters}
              className="btn btn-ghost px-6 py-2.5"
            >
              <FilterX size={16} />
              Limpiar filtros
            </button>
            <button
              onClick={onAddClick}
              className="btn btn-primary px-6 py-2.5"
            >
              <Plus size={16} />
              Crear producto
            </button>
          </>
        ) : (
          <button
            onClick={onAddClick}
            className="btn btn-primary px-6 py-3 text-sm"
          >
            <Plus size={16} />
            Agregar primer producto
          </button>
        )}
      </div>

      {/* Nota inferior */}
      <div className="mt-8 pt-5 border-t border-white/[0.05] w-full max-w-xs">
        <p className="text-[0.68rem] text-white/20 font-mono">
          {hasFilters
            ? 'Intenta con términos más generales'
            : 'Los productos aparecerán aquí en tarjetas'}
        </p>
      </div>

    </div>
  );
};

export default EmptyState;