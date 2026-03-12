// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Cargar productos con fallback al JSON inicial
export const loadProducts = async () => {
  try {
    const localData = localStorage.getItem('products');
    if (localData) return JSON.parse(localData);

    const response = await fetch('/data/products.json');
    if (response.ok) {
      const data = await response.json();
      const products = data.products || [];
      localStorage.setItem('products', JSON.stringify(products));
      return products;
    }
    return [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Guardar colección completa
export const saveProducts = (products) => {
  try {
    localStorage.setItem('products', JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Agregar un producto (incluyendo soporte para base64)
export const addProduct = (productData) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const newProduct = {
    ...productData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  const updatedProducts = [...products, newProduct];
  if (saveProducts(updatedProducts)) return newProduct;
  return null;
};

// Actualizar un producto
export const updateProduct = (id, updatedData) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index] = { 
    ...products[index], 
    ...updatedData, 
    updatedAt: new Date().toISOString() 
  };
  
  if (saveProducts(products)) return products[index];
  return null;
};

// Eliminar un producto
export const deleteProduct = (id) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return saveProducts(products.filter(p => p.id !== id));
};