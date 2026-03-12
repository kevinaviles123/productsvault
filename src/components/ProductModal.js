import React, { useState, useEffect, useRef } from 'react';
import { X, Save, DollarSign, FileText, Tag, Hash, AlertCircle, Upload, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import { validateProduct } from '../utils/helpers';


const EMPTY = { name: '', price: '', description: '', category: '', image: null };

const ProductModal = ({ isOpen, onClose, onSubmit, initialData, showToast }) => {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
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

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: ve } = validateProduct(form);
      setErrors(ve);
    }
  }, [form, touched]);

  const handle     = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Formato no válido. Usa JPG, PNG o WEBP', 'error'); return; }
    if (file.size / 1024 / 1024 >= 2)   { showToast('El archivo es demasiado grande. Máx 2MB', 'error'); return; }
    try {
      const base64 = await convertToBase64(file);
      setPreview(base64);
      setForm(prev => ({ ...prev, image: base64 }));
    } catch (err) { console.error(err); }
  };

  const removeImage = () => {
    setPreview(null);
    setForm(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) { showToast('El precio debe ser un número válido', 'error'); return; }
    const { isValid, errors: ve } = validateProduct(form);
    if (!isValid) { setErrors(ve); setTouched({ name: true, price: true, category: true }); return; }
    onSubmit({ ...form, price, stock: 0 });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay — solo visible en desktop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm
                   hidden sm:flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal desktop — centrado */}
        <div
          className="bg-[#0f0f1a] border border-white/[0.08]
                     w-full max-w-lg rounded-2xl flex flex-col shadow-2xl"
          style={{ maxHeight: '88vh' }}
          onClick={e => e.stopPropagation()}
        >
          <ModalContent
            initialData={initialData}
            onClose={onClose}
            handleSubmit={handleSubmit}
            form={form}
            errors={errors}
            touched={touched}
            handle={handle}
            handleBlur={handleBlur}
            preview={preview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
          />
        </div>
      </div>

      {/* Mobile — pantalla completa sin overlay oscuro */}
      <div
        className="fixed inset-0 z-[100] sm:hidden
                   bg-[#0f0f1a] flex flex-col"
      >
        <ModalContent
          initialData={initialData}
          onClose={onClose}
          handleSubmit={handleSubmit}
          form={form}
          errors={errors}
          touched={touched}
          handle={handle}
          handleBlur={handleBlur}
          preview={preview}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />
      </div>
    </>
  );
};

// Contenido del modal — compartido entre mobile y desktop
const ModalContent = ({
  initialData, onClose, handleSubmit,
  form, errors, touched, handle, handleBlur,
  preview, fileInputRef, handleImageChange, removeImage
}) => (
  <>
    {/* Header */}
    <div className="flex-shrink-0 border-b border-white/[0.06]
                    px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#c8ff00]/10
                        flex items-center justify-center flex-shrink-0">
          <Package size={18} className="text-[#c8ff00]" />
        </div>
        <div>
          <h3 className="font-display font-bold text-white text-base leading-none">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <p className="text-[0.6rem] text-white/25 font-mono mt-0.5 uppercase tracking-widest">
            {initialData ? `ID: ${initialData.id}` : 'Registrar nuevo artículo en catálogo'}
          </p>
        </div>
      </div>
      <button onClick={onClose}
              className="text-white/30 hover:text-white p-2 rounded-xl
                         hover:bg-white/[0.05] transition-all">
        <X size={20} />
      </button>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

      {/* Área scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
           style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* Imagen */}
        <div className="flex items-center gap-4">
          <div className={`relative rounded-xl border-2 border-dashed
                          flex-shrink-0 w-20 h-20 overflow-hidden
                          flex flex-col items-center justify-center
                          transition-all
                          ${preview ? 'border-transparent' : 'border-white/10 bg-white/[0.02]'}`}>
            {preview ? (
              <>
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0
                                active:opacity-100 hover:opacity-100
                                transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => fileInputRef.current.click()}
                          className="p-1.5 bg-white/10 rounded-lg text-white">
                    <Upload size={13} />
                  </button>
                  <button type="button" onClick={removeImage}
                          className="p-1.5 bg-red-500/20 rounded-lg text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              </>
            ) : (
              <button type="button" onClick={() => fileInputRef.current.click()}
                      className="flex flex-col items-center gap-1 text-white/20
                                 hover:text-[#c8ff00]/60 transition-colors">
                <ImageIcon size={26} strokeWidth={1} />
                <span className="text-[0.5rem] font-mono uppercase tracking-widest text-center leading-tight">
                  Subir<br/>Imagen
                </span>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[0.6rem] text-white/40 font-mono uppercase tracking-widest">
              Imagen del producto
            </p>
            <button type="button" onClick={() => fileInputRef.current.click()}
                    className="text-[0.65rem] text-[#c8ff00]/60 font-mono
                               hover:text-[#c8ff00] transition-colors text-left">
              {preview ? '↺ Cambiar imagen' : '+ Seleccionar archivo'}
            </button>
            <p className="text-[0.55rem] text-white/15 font-mono">JPG, PNG o WEBP. Máx 2MB.</p>
          </div>
        </div>

        <input type="file" ref={fileInputRef}
               onChange={handleImageChange} accept="image/*" className="hidden" />

        {/* Nombre */}
        <div>
          <label className="label flex items-center gap-1.5">
            <Tag size={10} /> Nombre *
          </label>
          <input type="text" name="name" value={form.name}
                 onChange={handle} onBlur={handleBlur} required
                 className={`field ${errors.name && touched.name ? 'border-red-500/50' : ''}`}
                 placeholder="Ej: Laptop Gaming MSI" />
          {errors.name && touched.name && (
            <p className="text-[0.6rem] text-red-400 font-mono flex items-center gap-1 mt-1">
              <AlertCircle size={10} /> {errors.name}
            </p>
          )}
        </div>

        {/* Precio + Categoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label flex items-center gap-1.5">
              <DollarSign size={10} /> Precio *
            </label>
            <input type="number" name="price" value={form.price}
                   onChange={handle} onBlur={handleBlur} required step="0.01"
                   className={`field ${errors.price && touched.price ? 'border-red-500/50' : ''}`}
                   placeholder="0.00" />
            {errors.price && touched.price && (
              <p className="text-[0.6rem] text-red-400 font-mono flex items-center gap-1 mt-1">
                <AlertCircle size={10} /> {errors.price}
              </p>
            )}
          </div>
          <div>
            <label className="label flex items-center gap-1.5">
              <Hash size={10} /> Categoría *
            </label>
            <select name="category" value={form.category}
                    onChange={handle} onBlur={handleBlur} required
                    className={`field appearance-none ${errors.category && touched.category ? 'border-red-500/50' : ''}`}>
              <option value="" disabled>Seleccionar...</option>
              {['Electrónica','Accesorios','Ropa','Hogar','Deportes','Portátil','Otros'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="label flex items-center gap-1.5">
            <FileText size={10} /> Descripción
          </label>
          <textarea name="description" value={form.description}
                    onChange={handle} rows={3}
                    className="field resize-none"
                    placeholder="Detalles del producto..." />
        </div>

      </div>

      {/* Footer siempre visible */}
      <div className="flex-shrink-0 border-t border-white/[0.06]
                      bg-[#0f0f1a] px-5 py-4
                      flex items-center justify-end gap-3">
        <button type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-[0.7rem] font-mono
                           uppercase tracking-widest text-white/40
                           hover:text-white hover:bg-white/5 transition-all">
          Cancelar
        </button>
        <button type="submit"
                className="bg-[#c8ff00] text-black px-6 py-2.5 rounded-xl
                           text-[0.7rem] font-bold uppercase tracking-widest
                           hover:bg-[#d8ff40] active:scale-[0.98] transition-all
                           flex items-center gap-2
                           shadow-[0_0_20px_rgba(200,255,0,0.2)]">
          <Save size={14} />
          {initialData ? 'Actualizar' : 'Guardar'}
        </button>
      </div>

    </form>
  </>
);

export default ProductModal;