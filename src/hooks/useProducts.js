import { useState, useEffect, useCallback } from 'react';
 
const API = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'http://localhost:3001/products'
  : 'http://localhost:3001/products';
 
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
 
  // ── Cargar productos ──────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(API);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetch:', err.message);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
 
  // ── Agregar ───────────────────────────────────────
  const addProduct = async (product) => {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const saved = await res.json();
    setProducts(prev => [...prev, saved]);
    return saved;
  };
 
  // ── Editar ────────────────────────────────────────
  const updateProduct = async (id, product) => {
    const res = await fetch(`${API}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const updated = await res.json();
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };
 
  // ── Eliminar — SOLO VISUAL, no toca el backend ────
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
 
  // ── Borrar todos ──────────────────────────────────
  const clearProducts = async () => {
    await fetch(API, { method: 'DELETE' });
    setProducts([]);
  };
 
  // ── Exportar JSON ─────────────────────────────────
  const exportProducts = () => {
    const blob = new Blob(
      [JSON.stringify(products, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `products-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
 
  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    clearProducts,
    exportProducts,
    refetch: fetchProducts,
  };
};