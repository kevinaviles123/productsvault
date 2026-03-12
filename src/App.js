import React, { useState } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Dashboard from './components/Dashboard';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { useProducts } from './hooks/useProducts';
import { useToast } from './hooks/useToast';

function App() {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  } = useProducts();

  const { toasts, showToast, removeToast } = useToast();

  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [categoryFilter,  setCategoryFilter]  = useState('all');
  const [sortBy,          setSortBy]          = useState('name');

  // Filtrar y ordenar — protegido contra null/undefined
  const filteredProducts = products
    .filter(product => {
      const name     = (product.name        || '').toLowerCase();
      const desc     = (product.description || '').toLowerCase();
      const term     = searchTerm.toLowerCase();
      const matchesSearch   = name.includes(term) || desc.includes(term);
      const matchesCategory = categoryFilter === 'all' ||
                              product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name')  return (a.name  || '').localeCompare(b.name  || '');
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'stock') return (a.stock || 0) - (b.stock || 0);
      return 0;
    });

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Handlers
  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast('Producto actualizado exitosamente', 'success');
      } else {
        await addProduct(formData);
        showToast('Producto agregado exitosamente', 'success');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error al guardar:', err);
      showToast('Error al procesar la solicitud', 'error');
    }
  };

  const handleDelete = async (id) => {
    console.log('🔍 handleDelete llamado con ID:', id, 'Tipo:', typeof id);
    
    try {
      // Mostrar toast de carga mientras se procesa la eliminación
      const loadingToast = showToast('Eliminando producto...', 'loading', 0);
      
      await deleteProduct(id);
      
      // Remover toast de carga y mostrar éxito
      removeToast(loadingToast);
      showToast('Producto eliminado permanentemente', 'success');
      
    } catch (err) {
      console.error('❌ Error en handleDelete:', {
        message: err.message,
        id: id,
        idType: typeof id,
        stack: err.stack,
        serverError: err.serverResponse,
        statusCode: err.statusCode
      });
      
      // Mensajes de error más específicos para el usuario
      let userMessage = 'Error al eliminar producto';
      
      if (err.statusCode === 404) {
        userMessage = 'Producto no encontrado. Puede que ya haya sido eliminado.';
      } else if (err.statusCode === 500) {
        userMessage = 'Error del servidor. Intente nuevamente en unos momentos.';
      } else if (err.message.includes('network') || err.name === 'AbortError') {
        userMessage = 'Error de conexión. Verifique su conexión a internet.';
      } else if (err.message.includes('ID inválido')) {
        userMessage = 'Error: ID de producto inválido.';
      }
      
      showToast(userMessage, 'error');
      
      // Resincronizar con el servidor en caso de error
      try {
        console.log('🔄 Resincronizando estado después de error...');
        await fetchProducts();
        console.log('✅ Estado resincronizado exitosamente');
      } catch (refetchError) {
        console.error('❌ Error al resincronizar estado:', refetchError);
        showToast('No se pudo actualizar la lista de productos', 'warning');
      }
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div style={{ backgroundColor: '#09090f', minHeight: '100vh' }}
         className="text-white flex flex-col">

      <Header
        productCount={products.length}
        onAddClick={() => handleOpenModal()}
        products={products}
      />

      <main style={{ backgroundColor: '#09090f' }}
            className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

        {/* KPIs */}
        <Dashboard products={products} />

        {/* Filtros */}
        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Título */}
        <div className="flex items-baseline gap-3">
          <h2 className="font-display font-bold text-white/80 text-base">
            Inventario
          </h2>
          <span className="text-[0.65rem] text-white/25 font-mono">
            {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2
                            border-[#c8ff00] border-t-transparent
                            animate-spin" />
          </div>
        )}

        {/* Error — backend no disponible */}
        {!loading && error && (
          <div className="text-center py-10 space-y-2
                          bg-[#0f0f1a] border border-red-400/20
                          rounded-2xl p-8">
            <p className="text-red-400/70 text-sm font-mono">{error}</p>
            <p className="text-white/20 text-xs font-mono">
              Verifica que el backend esté corriendo en puerto 3001
            </p>
            <code className="text-[0.65rem] text-white/15 font-mono block mt-2">
              cd backend → npm run dev
            </code>
          </div>
        )}

        {/* Grid productos */}
        {!loading && !error && (
          <div className="grid gap-4
                          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                          items-start">
            {filteredProducts.length === 0 ? (
              <EmptyState
                hasFilters={searchTerm !== '' || categoryFilter !== 'all'}
                onClearFilters={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                onAddClick={() => handleOpenModal()}
              />
            ) : (
              filteredProducts.map((product, index) => {
                // Asegurar que siempre haya una key única
                const uniqueKey = product.id ? product.id : `product-${index}-${Date.now()}`;
                return (
                  <ProductCard
                    key={uniqueKey}
                    product={product}
                    onEdit={() => handleOpenModal(product)}
                    onDelete={() => handleDelete(product.id)}
                    index={index}
                    showToast={showToast}
                  />
                );
              })
            )}
          </div>
        )}

      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSave}
        initialData={editingProduct}
        showToast={showToast}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;