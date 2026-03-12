import React from 'react';
import { Edit3, Trash2, Calendar, Box, Package } from 'lucide-react';
import MySwal from '../MySwal';

const STATUS = {
  agotado: {
    label: 'Agotado',
    cls:   'bg-red-500/10 text-red-400 ring-1 ring-red-400/20',
  },
  bajo: {
    label: 'Stock Bajo',
    cls:   'bg-orange-500/10 text-orange-400 ring-1 ring-orange-400/20',
  },
  activo: {
    label: 'Activo',
    cls:   'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20',
  },
};

const ProductCard = ({ product, onEdit, onDelete, index, showToast }) => {
  // Validar y proporcionar valores por defecto para props
  const safeProduct = product || {};
  const safeOnEdit = onEdit || (() => {});
  const safeOnDelete = onDelete || (() => {});
  const safeShowToast = showToast || (() => {});
  
  const stockNum  = parseInt(safeProduct.stock) || 0;
  const statusKey = stockNum === 0 ? 'agotado' : stockNum <= 5 ? 'bajo' : 'activo';
  const status    = STATUS[statusKey] || STATUS.activo;

  const handleDelete = async () => { 
    console.log('🔄 ProductCard.handleDelete - safeProduct.id:', safeProduct.id, 'Tipo:', typeof safeProduct.id);
    
    // Validar que tenemos un ID antes de proceder
    if (!safeProduct.id && safeProduct.id !== 0) {
      console.error('❌ Error: Producto sin ID - no se puede eliminar', safeProduct);
      safeShowToast('Error: Producto no tiene ID válido', 'error');
      return;
    }
    
    const result = await MySwal.fire({ 
      title: '¿Eliminar producto?', 
      html: ` 
        <span style="color:rgba(255,255,255,0.4); 
                     font-size:0.78rem; 
                     line-height:1.6"> 
          <b style="color:#fff">${safeProduct.name || 'Producto sin nombre'}</b> 
          será eliminado permanentemente. 
        </span> 
      `, 
      icon: 'warning', 
      iconColor: '#f97316', 
      showCancelButton: true, 
      confirmButtonText: 'Sí, eliminar', 
      confirmButtonColor: '#ef4444', 
      cancelButtonText: 'Cancelar', 
      reverseButtons: true, 
    }); 
  
    if (result.isConfirmed) { 
      console.log('✅ Usuario confirmó eliminación - Enviando ID:', safeProduct.id);
      
      try {
        // Llamar a la función de eliminación y esperar a que complete
        await safeOnDelete(safeProduct.id);
        
        // Solo mostrar éxito si la eliminación se completó sin errores
        MySwal.fire({ 
          title: '¡Eliminado!', 
          html: ` 
            <span style="color:rgba(255,255,255,0.4); 
                     font-size:0.78rem"> 
              El producto fue eliminado permanentemente. 
            </span> 
          `, 
          icon: 'success', 
          iconColor: '#c8ff00', 
          timer: 1500, 
          showConfirmButton: false, 
        }); 
      } catch (error) {
        console.error('❌ Error durante la eliminación:', error);
        
        // Mostrar error específico si la eliminación falla
        MySwal.fire({ 
          title: 'Error', 
          html: ` 
            <span style="color:rgba(255,255,255,0.4); 
                     font-size:0.78rem"> 
              No se pudo eliminar el producto. 
            </span> 
          `, 
          icon: 'error', 
          iconColor: '#ef4444', 
          timer: 2000, 
          showConfirmButton: false, 
        });
      }
    } else {
      console.log('❌ Usuario canceló la eliminación');
    }
  }; 

  return (
    <div
      className="relative group bg-[#0f0f1a] border border-white/[0.07] rounded-2xl 
                 overflow-hidden transition-all duration-200 
                 hover:border-[#c8ff00]/25 hover:-translate-y-1 
                 hover:shadow-[0_0_40px_rgba(200,255,0,0.08)] 
                 flex flex-col h-full"
      style={{ animationDelay: `${(index || 0) * 50}ms` }}
    >
      {/* Área imagen — altura fija y consistente */}
      <div className="relative h-44 bg-[#16162a] overflow-hidden 
                      border-b border-white/[0.05] flex-shrink-0">
        
        {/* Imagen real */}
        {safeProduct.image && (
          <img
            src={safeProduct.image}
            alt={safeProduct.name || 'Producto'}
            className="w-full h-full object-cover object-center 
                       transition-transform duration-500 
                       group-hover:scale-105"
          />
        )}

        {/* Placeholder cuando no hay imagen */}
        {!safeProduct.image && (
          <div className="w-full h-full flex flex-col items-center 
                          justify-center gap-2">
            <Box size={36} className="text-white/[0.06]" />
            <span className="text-[0.6rem] text-white/[0.08] 
                             font-mono uppercase tracking-widest">
              Sin imagen
            </span>
          </div>
        )}

        {/* Gradiente sutil sobre imagen para legibilidad */}
        {safeProduct.image && (
          <div className="absolute inset-0 
                          bg-gradient-to-t from-[#0f0f1a]/60 
                          via-transparent to-transparent" />
        )}

        {/* Badge estado */}
        <span className={`absolute top-2.5 right-2.5 z-20 
                          text-[0.58rem] font-semibold tracking-wider 
                          px-2.5 py-1 rounded-full 
                          backdrop-blur-md ${status.cls}`}>
          {status.label}
        </span>
      </div>

      {/* Contenido — flex-1 para igualar alturas */}
      <div className="p-4 flex flex-col flex-1">

        {/* Categoría + SKU */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[0.58rem] text-[#c8ff00] tracking-[0.15em] 
                           uppercase font-mono font-semibold">
            {safeProduct.category || '—'}
          </span>
          {safeProduct.sku && (
            <span className="text-[0.58rem] text-white/20 font-mono">
              {safeProduct.sku}
            </span>
          )}
        </div>

        {/* Nombre — line-clamp-1 */}
        <h3 className="font-display font-bold text-[0.85rem] sm:text-[0.9rem] text-white 
                       leading-tight mb-2 line-clamp-1">
          {safeProduct.name || 'Producto sin nombre'}
        </h3>

        {/* Descripción — máximo 2 líneas */}
        {safeProduct.description && (
          <p className="text-[0.7rem] text-white/30 leading-relaxed 
                        mb-3 line-clamp-2">
            {safeProduct.description}
          </p>
        )}

        {/* Precio + Stock en la misma fila */}
        <div className="flex items-center justify-between 
                        py-2.5 border-t border-b border-white/[0.05] mb-3">
          
          <div className="flex items-center gap-1.5">
            <Package size={12} className="text-white/25" />
            <span className="text-[0.68rem] font-mono text-white/40">
              {stockNum} uds
            </span>
          </div>

          <p className="font-display font-bold text-[#c8ff00] leading-none 
                        truncate max-w-[130px]" 
             style={{ fontSize: 'clamp(0.8rem, 3vw, 1.05rem)' }}>
            ${parseFloat(safeProduct.price || 0).toLocaleString('es-CO', { 
              maximumFractionDigits: 0 
            })}
          </p>
        </div>

        {/* Fecha — más sutil */}
        {safeProduct.createdAt && (
          <div className="flex items-center gap-1 text-white/15 mb-3">
            <Calendar size={10} />
            <span className="text-[0.6rem] font-mono">
              {new Date(safeProduct.createdAt).toLocaleDateString('es-CO')}
            </span>
          </div>
        )}

        {/* Botones siempre al final */}
        <div className="flex gap-2 pt-2.5 border-t border-white/[0.05] mt-auto">

          {/* Editar */}
          <button
            onClick={safeOnEdit}
            className="flex-1 flex items-center justify-center gap-1.5 
                       py-2 sm:py-2.5 rounded-xl text-[0.72rem] sm:text-xs font-mono 
                       text-white/40 bg-white/[0.04] 
                       border border-white/[0.07] 
                       hover:text-white hover:bg-white/[0.08] 
                       hover:border-white/20 
                       transition-all duration-150"
            aria-label="Editar producto"
          >
            <Edit3 size={12} />
            Editar
          </button>

          {/* Eliminar */}
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-1.5 
                       py-2 sm:py-2.5 rounded-xl text-[0.72rem] sm:text-xs font-mono 
                       text-red-400/50 bg-transparent 
                       border border-white/[0.06] 
                       hover:text-red-400 hover:bg-red-500/10 
                       hover:border-red-400/25 
                       transition-all duration-150"
            aria-label="Eliminar producto"
          >
            <Trash2 size={12} />
            Eliminar
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;