import { useState, useEffect, useCallback } from 'react'; 

const API = 'http://localhost:3001/products'; 

// Validar que un producto tenga los campos mínimos requeridos
const validateProduct = (product) => {
  if (!product || typeof product !== 'object') return false;
  
  // Convertir tipos si es necesario (price y stock pueden venir como strings)
  const validatedProduct = {
    name: product.name || '',
    price: typeof product.price === 'number' ? product.price : 
           typeof product.price === 'string' ? parseFloat(product.price) || 0 : 0,
    stock: typeof product.stock === 'number' ? product.stock : 
           typeof product.stock === 'string' ? parseInt(product.stock) || 0 : 0,
    category: product.category || '',
    description: product.description || '',
    image: product.image || null,
    sku: product.sku || null
  };
  
  return (
    typeof validatedProduct.name === 'string' && validatedProduct.name.trim() !== '' &&
    typeof validatedProduct.price === 'number' && validatedProduct.price >= 0 &&
    typeof validatedProduct.stock === 'number' && validatedProduct.stock >= 0 &&
    typeof validatedProduct.category === 'string' && validatedProduct.category.trim() !== ''
  );
};

export const useProducts = () => { 
  const [products, setProducts] = useState([]); 
  const [loading,  setLoading]  = useState(true); 
  const [error,    setError]    = useState(null); 

  const fetchProducts = useCallback(async () => { 
    setLoading(true); 
    setError(null); 
    try { 
      const res  = await fetch(API); 
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json(); 
      // Validar que los productos tengan estructura correcta
      const validatedProducts = Array.isArray(data) 
        ? data.filter(p => p && typeof p === 'object' && p.id != null)
        : [];
      setProducts(validatedProducts); 
    } catch (err) { 
      setError('No se pudo conectar con el servidor.'); 
    } finally { 
      setLoading(false); 
    } 
  }, []); 

  useEffect(() => { fetchProducts(); }, [fetchProducts]); 

  const addProduct = async (product) => { 
    try {
      console.log('📦 Intentando agregar producto:', product);
      
      if (!validateProduct(product)) {
        const errorMsg = 'Datos del producto inválidos. Verifica que todos los campos requeridos estén presentes y sean válidos.';
        console.error('❌ Error de validación:', errorMsg, product);
        throw new Error(errorMsg);
      }
      
      // Preparar datos para enviar al servidor
      const productToSend = {
        name: product.name.trim(),
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
        stock: typeof product.stock === 'number' ? product.stock : parseInt(product.stock) || 0,
        category: product.category.trim(),
        description: product.description?.trim() || '',
        image: product.image || null,
        sku: product.sku || null
      };
      
      console.log('🔄 Enviando producto al servidor:', productToSend);
      
      const res = await fetch(API, { 
        method:  'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }, 
        body:    JSON.stringify(productToSend), 
      });
      
      console.log('📡 Respuesta de eliminación - Status:', res.status, res.statusText);
      
      if (!res.ok) {
        let errorDetails = `Error ${res.status}: ${res.statusText}`;
        let serverErrorData = null;
        
        // Intentar obtener más detalles del error del servidor
        try {
          const errorResponse = await res.text();
          if (errorResponse) {
            errorDetails += ` - ${errorResponse}`;
            // Intentar parsear como JSON para estructura de error del backend
            try {
              serverErrorData = JSON.parse(errorResponse);
            } catch (parseError) {
              // Si no es JSON, mantener como texto
            }
          }
        } catch (e) {
          console.warn('No se pudo leer la respuesta de error del servidor:', e);
        }
        
        console.error('❌ Error del servidor al eliminar:', errorDetails, serverErrorData);
        
        // Crear error más informativo
        const error = new Error(`Error al eliminar producto: ${errorDetails}`);
        error.serverResponse = serverErrorData;
        error.statusCode = res.status;
        throw error;
      }
      
      const saved = await res.json(); 
      console.log('✅ Producto agregado exitosamente:', saved);
      
      setProducts(prev => [...prev, saved]); 
      return saved; 
      
    } catch (error) {
      console.error('💥 Error crítico en addProduct:', error.message, error.stack);
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  }; 

  const updateProduct = async (id, product) => { 
    if (!id || typeof id !== 'number') {
      throw new Error('ID inválido para actualización');
    }
    
    if (!validateProduct(product)) {
      throw new Error('Datos del producto inválidos');
    }
    
    const res = await fetch(`${API}/${id}`, { 
      method:  'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body:    JSON.stringify(product), 
    });
    
    if (!res.ok) {
      throw new Error(`Error al actualizar producto: ${res.status}`);
    }
    
    const updated = await res.json(); 
    setProducts(prev => prev.map(p => p.id === id ? updated : p)); 
    return updated; 
  }; 

  const deleteProduct = async (id, maxRetries = 2) => { 
    console.log('🗑️ Intentando eliminar producto con ID:', id, 'Tipo:', typeof id);
    
    // Validación flexible: acepta números, strings (alfanuméricos o numéricos) y bigint
    const isValidId = id != null && 
                    (typeof id === 'number' || 
                     (typeof id === 'string' && id.trim() !== '') ||
                     typeof id === 'bigint');
    
    if (!isValidId) {
      const errorMsg = `ID inválido para eliminación: ${id} (tipo: ${typeof id})`;
      console.error('❌ Error de validación:', errorMsg);
      throw new Error(errorMsg);
    }
    
    // Para strings, asegurar que no esté vacío después de trim
    if (typeof id === 'string' && id.trim() === '') {
      const errorMsg = 'ID string no puede estar vacío';
      console.error('❌ Error de validación:', errorMsg);
      throw new Error(errorMsg);
    }
    
    // Usar el ID directamente (no convertir a número para IDs alfanuméricos)
    const finalId = id;
    console.log('🔄 Eliminando producto con ID:', finalId);
    
    let lastError = null;
    let attempt = 0;
    
    while (attempt <= maxRetries) {
      try {
        attempt++;
        console.log(`🔄 Intento ${attempt} de ${maxRetries + 1}`);
        
        // Crear un timeout para la solicitud (8 segundos)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const res = await fetch(`${API}/${finalId}`, { 
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Respuesta de eliminación - Status:', res.status, res.statusText);
        
        if (!res.ok) {
          let errorDetails = `Error ${res.status}: ${res.statusText}`;
          let serverErrorData = null;
          
          // Intentar obtener más detalles del error del servidor
          try {
            const errorResponse = await res.text();
            if (errorResponse) {
              errorDetails += ` - ${errorResponse}`;
              // Intentar parsear como JSON para estructura de error del backend
              try {
                serverErrorData = JSON.parse(errorResponse);
              } catch (parseError) {
                // Si no es JSON, mantener como texto
              }
            }
          } catch (e) {
            console.warn('No se pudo leer la respuesta de error del servidor:', e);
          }
          
          console.error('❌ Error del servidor al eliminar:', errorDetails, serverErrorData);
          
          // Crear error más informativo
          lastError = new Error(`Error al eliminar producto: ${errorDetails}`);
          lastError.serverResponse = serverErrorData;
          lastError.statusCode = res.status;
          lastError.isRetryable = res.status >= 500 || res.status === 408 || res.status === 429;
          
          // Si no es un error reintentable o es el último intento, lanzar el error
          if (!lastError.isRetryable || attempt > maxRetries) {
            throw lastError;
          }
          
          // Esperar antes de reintentar (backoff exponencial)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`⏰ Reintentando en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.log('✅ Producto eliminado exitosamente');
        
        // Actualizar estado local - comparar IDs directamente (strings o numbers)
        setProducts(prev => prev.filter(p => {
          // Comparación flexible: permite comparar string vs number si representan el mismo valor
          if (typeof p.id === 'number' && typeof finalId === 'string') {
            return p.id !== parseInt(finalId, 10);
          } else if (typeof p.id === 'string' && typeof finalId === 'number') {
            return parseInt(p.id, 10) !== finalId;
          }
          return p.id !== finalId;
        })); 
        
        return; // Éxito, salir de la función
        
      } catch (error) {
        console.error(`💥 Error en intento ${attempt}:`, error.message);
        lastError = error;
        
        // Si es un error de timeout o de red, es reintentable
        if (error.name === 'AbortError' || error.message.includes('network')) {
          error.isRetryable = true;
        }
        
        // Si no es reintentable o es el último intento, lanzar el error
        if (!error.isRetryable || attempt > maxRetries) {
          console.error('💥 Error crítico en deleteProduct después de todos los intentos:', error.message, error.stack);
          throw error;
        }
        
        // Esperar antes de reintentar (backoff exponencial)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏰ Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    throw lastError;
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