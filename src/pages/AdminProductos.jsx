import { useState } from 'react';

export default function AdminProductos() {
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', imagen_url: '' });
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('¡Producto guardado exitosamente! (Simulación)');
    setFormData({ titulo: '', descripcion: '', imagen_url: '' });
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-buap-azul-oscuro">Gestión de Productos</h1>
        <p className="text-gray-500 mt-2">Administra los productos insignia de la UVIE.</p>
      </div>

      {mensaje && <div className="p-4 mb-6 rounded-lg font-medium bg-green-100 text-green-700 border-l-4 border-green-500">{mensaje}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
            <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-buap-azul-oscuro" placeholder="Ej. Software UVIE" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="4" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-buap-azul-oscuro" placeholder="Descripción del producto..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">URL de la Imagen</label>
            <input type="url" value={formData.imagen_url} onChange={(e) => setFormData({...formData, imagen_url: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-buap-azul-oscuro" placeholder="https://..." />
          </div>
          <button type="submit" className="px-8 py-3 bg-buap-azul-oscuro text-white font-bold rounded-xl hover:bg-buap-azul-claro transition-colors">
            Guardar Producto
          </button>
        </form>
      </div>
    </div>
  );
}