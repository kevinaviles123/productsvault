import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const Toolbar = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories = [], // fallback a array vacío
  sortBy,
  onSortChange
}) => {
  return (
    <div className="bg-surface border border-white/[0.07] rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-white/40 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-white/40 mb-2">
            Categoría
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/25" />
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block text-sm font-medium text-white/40 mb-2">
            Ordenar por
          </label>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/25" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="name">Nombre (A-Z)</option>
              <option value="price">Precio (menor a mayor)</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {(searchTerm || categoryFilter !== 'all') && (
        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">Filtros activos:</span>

            {searchTerm && (
              <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-accent/70 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {categoryFilter !== 'all' && (
              <span className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                Categoría: {categoryFilter}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="hover:text-blue-400/70 transition-colors"
                  aria-label="Limpiar categoría"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;