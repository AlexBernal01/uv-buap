import { useState } from 'react';

export default function AdminCursos() {
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', duracion: '', carrera: 'administracion', imagen_url: '', link_curso: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');
    const token = localStorage.getItem('uvie_token'); 

    if (!token) {
      setMensaje('Error: Debes iniciar sesión como administrador.');
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cursos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('¡Curso guardado exitosamente!');
        setFormData({ titulo: '', descripcion: '', duracion: '', carrera: 'administracion', imagen_url: '', link_curso: '' });
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-buap-azul-oscuro">Gestión de Cursos</h1>
        <p className="text-gray-500 mt-2">Crea y administra los cursos que se muestran en el sitio web.</p>
      </div>

      {mensaje && (
        <div className={`p-4 mb-6 rounded-lg font-medium ${mensaje.includes('Error') ? 'bg-red-100 text-red-700 border-l-4 border-red-500' : 'bg-green-100 text-green-700 border-l-4 border-green-500'}`}>
          {mensaje}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Título del Curso *</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-oscuro focus:border-transparent transition-all" 
                  placeholder="Ej. Análisis de Datos para Todos" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-oscuro focus:border-transparent transition-all"
                  placeholder="Describe brevemente de qué trata el curso..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duración</label>
                <input type="text" name="duracion" value={formData.duracion} onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-oscuro focus:border-transparent transition-all" 
                  placeholder="Ej. 8 horas" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Carrera</label>
                <select name="carrera" value={formData.carrera} onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-oscuro focus:border-transparent transition-all">
                  <option value="administracion">Administración</option>
                  <option value="gastronomia">Gastronomía</option>
                  <option value="comercio">Comercio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL de la Imagen</label>
                <input type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-oscuro focus:border-transparent transition-all" 
                  placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Enlace del Curso</label>
                <input type="url" name="link_curso" value={formData.link_curso} onChange={handleChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-oscuro focus:border-transparent transition-all" 
                  placeholder="https://saberes.mx/..." />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button type="submit" disabled={cargando} 
                className="w-full md:w-auto px-8 py-3 bg-buap-azul-oscuro text-white font-bold rounded-xl hover:bg-buap-azul-claro transition-colors duration-300 disabled:opacity-50">
                {cargando ? 'Guardando...' : 'Guardar Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}