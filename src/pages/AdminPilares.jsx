import { useState } from 'react';

export default function AdminPilares() {
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', orden: '' });
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('¡Pilar guardado exitosamente! (Simulación)');
    setFormData({ nombre: '', descripcion: '', orden: '' });
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-buap-azul-oscuro">Gestión de Pilares</h1>
        <p className="text-gray-500 mt-2">Administra los pilares estratégicos de la UVIE.</p>
      </div>

      {mensaje && <div className="p-4 mb-6 rounded-lg font-medium bg-green-100 text-green-700 border-l-4 border-green-500">{mensaje}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Pilar</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-buap-azul-oscuro" placeholder="Ej. Innovación" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Orden (Número)</label>
              <input type="number" value={formData.orden} onChange={(e) => setFormData({...formData, orden: e.target.value})} required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-buap-azul-oscuro" placeholder="Ej. 1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="4" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-buap-azul-oscuro" placeholder="Descripción del pilar..."></textarea>
          </div>
          <button type="submit" className="px-8 py-3 bg-buap-azul-oscuro text-white font-bold rounded-xl hover:bg-buap-azul-claro transition-colors">
            Guardar Pilar
          </button>
        </form>
      </div>
    </div>
  );
}