// Mapa de estados de stock
export const STOCK_STATUS = {
  AGOTADO: 'agotado',
  BAJO: 'bajo',
  DISPONIBLE: 'disponible'
};

// Colores para badges según estado
export const STATUS_COLORS = {
  [STOCK_STATUS.AGOTADO]: 'bg-red-100 text-red-800',
  [STOCK_STATUS.BAJO]: 'bg-yellow-100 text-yellow-800',
  [STOCK_STATUS.DISPONIBLE]: 'bg-green-100 text-green-800'
};

// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generar SKU único
export const generateSKU = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'PRD';
  let suffix = '';
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${suffix}`;
};

// Formatear precio
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Formatear fecha
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Validar producto
export const validateProduct = (product) => {
  const errors = {};
  
  if (!product.name || product.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }
  
  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres';
  }
  
  if (!product.category || product.category.trim().length < 2) {
    errors.category = 'La categoría debe tener al menos 2 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Calcular estadísticas
export const calculateStats = (products) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
  
  const categories = {};
  products.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  
  return {
    totalProducts,
    totalValue,
    averagePrice,
    categories,
    mostExpensive: products.length > 0 
      ? products.reduce((max, p) => p.price > max.price ? p : max, products[0])
      : null,
    cheapest: products.length > 0
      ? products.reduce((min, p) => p.price < min.price ? p : min, products[0])
      : null
  };
};

// Ordenar productos
export const sortProducts = (products, sortBy = 'name', sortOrder = 'asc') => {
  const sorted = [...products];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = a.stock - b.stock;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'date':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// Filtrar productos
export const filterProducts = (products, filters) => {
  return products.filter(product => {
    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Filtro por categoría
    if (filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) return false;
    }
    
    // Filtro por rango de precio
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
    
    // Filtro por stock
    if (filters.stockStatus) {
      if (filters.stockStatus === STOCK_STATUS.AGOTADO && product.stock > 0) return false;
      if (filters.stockStatus === STOCK_STATUS.BAJO && (product.stock === 0 || product.stock >= 10)) return false;
      if (filters.stockStatus === STOCK_STATUS.DISPONIBLE && product.stock < 10) return false;
    }
    
    return true;
  });
};

// Agrupar productos por categoría
export const groupByCategory = (products) => {
  return products.reduce((groups, product) => {
    const category = product.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});
};

// Obtener productos con bajo stock
export const getLowStockProducts = (products, threshold = 5) => {
  return products.filter(p => p.stock > 0 && p.stock <= threshold);
};

// Obtener productos agotados
export const getOutOfStockProducts = (products) => {
  return products.filter(p => p.stock === 0);
};

// Calcular valor del inventario por categoría
export const getInventoryValueByCategory = (products) => {
  const categories = {};
  
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = {
        count: 0,
        totalValue: 0,
        totalStock: 0,
        products: []
      };
    }
    
    categories[product.category].count += 1;
    categories[product.category].totalValue += product.price * product.stock;
    categories[product.category].totalStock += product.stock;
    categories[product.category].products.push(product);
  });
  
  return categories;
};

// Generar reporte de inventario
export const generateInventoryReport = (products) => {
  const stats = calculateStats(products);
  const byCategory = getInventoryValueByCategory(products);
  const lowStock = getLowStockProducts(products);
  const outOfStock = getOutOfStockProducts(products);
  
  return {
    generatedAt: new Date().toISOString(),
    summary: stats,
    byCategory,
    alerts: {
      lowStock: {
        count: lowStock.length,
        products: lowStock
      },
      outOfStock: {
        count: outOfStock.length,
        products: outOfStock
      }
    },
    totalProducts: products.length,
    totalValue: stats.totalValue
  };
};

// Validar formato JSON
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Sanitizar objeto producto
export const sanitizeProduct = (product) => {
  return {
    id: product.id || generateId(),
    sku: product.sku || generateSKU(),
    name: String(product.name || '').trim(),
    price: parseFloat(product.price) || 0,
    description: String(product.description || '').trim(),
    category: String(product.category || '').trim(),
    stock: parseInt(product.stock) || 0,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Comparar dos productos
export const areProductsEqual = (productA, productB) => {
  return (
    productA.name === productB.name &&
    productA.price === productB.price &&
    productA.description === productB.description &&
    productA.category === productB.category &&
    productA.stock === productB.stock
  );
};

// Obtener productos duplicados (por nombre)
export const findDuplicates = (products) => {
  const seen = new Map();
  const duplicates = [];
  
  products.forEach(product => {
    const key = product.name.toLowerCase();
    if (seen.has(key)) {
      duplicates.push({
        original: seen.get(key),
        duplicate: product
      });
    } else {
      seen.set(key, product);
    }
  });
  
  return duplicates;
};