import React, { useState, useEffect, useRef } from 'react';
import { X, Save, DollarSign, FileText, Tag, Hash, AlertCircle, Upload, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import { validateProduct } from '../utils/helpers';

const CATEGORIES = ['Electrónica', 'Accesorios', 'Ropa', 'Hogar', 'Deportes','Portátil','Otros'];

const EMPTY = {
  name:        '',
  price:       '',
  description: '',
  category:    '',
  image:       null,
};

const ProductModal = ({ isOpen, onClose, onSubmit, initialData, showToast }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name:        initialData.name        || '',
        price:       initialData.price !== undefined ? parseFloat(initialData.price).toFixed(2) : '',
        description: initialData.description || '',
        category:    initialData.category    || '',
        image:       initialData.image       || null,
      });
      setPreview(initialData.image || null);
    } else {
      setForm(EMPTY);
      setPreview(null);
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  // Validar en tiempo real
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: validationErrors } = validateProduct(form);
      setErrors(validationErrors);
    }
  }, [form, touched]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Convertir imagen a Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones de archivo
    const isImage = file.type.startsWith('image/');
    const isLt2MB = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      showToast('Formato no válido. Usa JPG, PNG o WEBP', 'error');
      return;
    }

    if (!isLt2MB) {
      showToast('El archivo es demasiado grande. Máx 2MB', 'error');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setPreview(base64);
      setForm(prev => ({ ...prev, image: base64 }));
    } catch (err) {
      console.error('Error al convertir imagen:', err);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setForm(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const price = parseFloat(form.price);

    if (isNaN(price) || price < 0) {
      showToast('El precio debe ser un número válido', 'error');
      return;
    }

    const { isValid, errors: validationErrors } = validateProduct(form);
    
    if (!isValid) {
      setErrors(validationErrors);
      setTouched({ name: true, price: true, category: true });
      return;
    }

    onSubmit({
      ...form,
      price,
      stock: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-[#0f0f1a] border border-white/[0.08] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header sticky top */}
        <div className="sticky top-0 z-10 bg-[#0f0f1a] flex-shrink-0 border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8ff00]/10 flex items-center justify-center">
              <Package size={20} className="text-[#c8ff00]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg leading-none">
                {initialData ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <p className="text-[0.7rem] text-white/30 font-mono mt-1.5 uppercase tracking-widest">
                {initialData ? `ID: ${initialData.id}` : 'Registrar nuevo artículo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/80 transition-all p-2 rounded-xl hover:bg-white/[0.05]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form con scroll interno */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 overscroll-contain -webkit-overflow-scrolling-touch">
            
            {/* Imagen */}
            <div className="space-y-3">
              <label className="label text-white/40 text-xs font-mono uppercase tracking-wider">Imagen del Producto</label>
              <div 
                className={`relative aspect-video sm:aspect-square rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                           ${preview ? 'border-transparent bg-surface2' : 'border-white/10 bg-white/[0.02] hover:border-[#c8ff00]/30'}`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white transition-colors"
                      >
                        <Upload size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex flex-col items-center gap-3 text-white/20 hover:text-[#c8ff00]/60 transition-colors"
                  >
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[0.65rem] font-mono uppercase tracking-widest">Subir Imagen</span>
                  </button>
                )}
              </div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Datos */}
            <div className="space-y-5">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="label flex items-center gap-1.5 text-white/40 text-xs"><Tag size={11} /> Nombre *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handle}
                  onBlur={handleBlur}
                  required
                  className={`field w-full bg-white/[0.03] border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/10 focus:border-[#c8ff00]/50 transition-all ${errors.name && touched.name ? 'border-red-500/50' : ''}`}
                  placeholder="Ej: Sudadera Oversize"
                />
                {errors.name && touched.name && (
                  <p className="text-[0.6rem] text-red-400 font-mono flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Precio */}
                <div className="space-y-1.5">
                  <label className="label flex items-center gap-1.5 text-white/40 text-xs"><DollarSign size={11} /> Precio *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handle}
                    onBlur={handleBlur}
                    required
                    step="0.01"
                    className={`field w-full bg-white/[0.03] border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/10 focus:border-[#c8ff00]/50 transition-all ${errors.price && touched.price ? 'border-red-500/50' : ''}`}
                    placeholder="0.00"
                  />
                  {errors.price && touched.price && (
                    <p className="text-[0.6rem] text-red-400 font-mono flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.price}
                    </p>
                  )}
                </div>

                {/* Categoría */}
                <div className="space-y-1.5">
                  <label className="label flex items-center gap-1.5 text-white/40 text-xs"><Hash size={11} /> Categoría *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handle}
                    onBlur={handleBlur}
                    required
                    className={`field w-full bg-white/[0.03] border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#c8ff00]/50 transition-all appearance-none ${errors.category && touched.category ? 'border-red-500/50' : ''}`}
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="label flex items-center gap-1.5 text-white/40 text-xs"><FileText size={11} /> Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  rows={3}
                  className="field w-full bg-white/[0.03] border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/10 focus:border-[#c8ff00]/50 transition-all resize-none"
                  placeholder="Detalles del producto..."
                />
              </div>
            </div>
          </div>

          {/* Botones siempre visibles (Sticky Footer) */}
          <div className="sticky bottom-0 z-10 bg-[#0f0f1a] flex-shrink-0 border-t border-white/[0.06] px-5 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-[0.7rem] font-mono uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#c8ff00] text-black px-8 py-2.5 rounded-xl text-[0.7rem] font-bold uppercase tracking-widest hover:bg-[#d8ff40] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(200,255,0,0.2)]"
            >
              <Save size={16} />
              {initialData ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
