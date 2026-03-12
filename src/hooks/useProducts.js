import { useState, useEffect, useCallback } from 'react'; 

const API = 'http://localhost:3001/products'; 

export const useProducts = () => { 
  const [products, setProducts] = useState([]); 
  const [loading,  setLoading]  = useState(true); 
  const [error,    setError]    = useState(null); 

  const fetchProducts = useCallback(async () => { 
    setLoading(true); 
    setError(null); 
    try { 
      const res  = await fetch(API); 
      const data = await res.json(); 
      setProducts(Array.isArray(data) ? data : []); 
    } catch (err) { 
      setError('No se pudo conectar con el servidor.'); 
    } finally { 
      setLoading(false); 
    } 
  }, []); 

  useEffect(() => { fetchProducts(); }, [fetchProducts]); 

  const addProduct = async (product) => { 
    const res  = await fetch(API, { 
      method:  'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body:    JSON.stringify(product), 
    }); 
    const saved = await res.json(); 
    setProducts(prev => [...prev, saved]); 
    return saved; 
  }; 

  const updateProduct = async (id, product) => { 
    const res     = await fetch(`${API}/${id}`, { 
      method:  'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body:    JSON.stringify(product), 
    }); 
    const updated = await res.json(); 
    setProducts(prev => prev.map(p => p.id === id ? updated : p)); 
    return updated; 
  }; 

  const deleteProduct = async (id) => { 
    await fetch(`${API}/${id}`, { method: 'DELETE' }); 
    setProducts(prev => prev.filter(p => p.id !== id)); 
  }; 

  const clearProducts = async () => { 
    await fetch(API, { method: 'DELETE' }); 
    setProducts([]); 
  }; 

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