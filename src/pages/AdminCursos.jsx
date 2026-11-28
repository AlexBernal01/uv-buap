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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 mb-10 border-t-4 border-buap-azul-oscuro">
      <h2 className="text-2xl font-bold text-buap-azul-oscuro mb-6">Agregar Nuevo Curso (Admin)</h2>
      
      {mensaje && (
        <div className={`p-3 mb-4 rounded ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Título del Curso *</label>
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-buap-azul-claro" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-buap-azul-claro"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Duración</label>
            <input type="text" name="duracion" value={formData.duracion} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-buap-azul-claro" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Carrera</label>
            <select name="carrera" value={formData.carrera} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-buap-azul-claro bg-white">
              <option value="administracion">Administración</option>
              <option value="gastronomia">Gastronomía</option>
              <option value="comercio">Comercio</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">URL de la Imagen</label>
          <input type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-buap-azul-claro" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Link del Curso (Saberes.mx)</label>
          <input type="url" name="link_curso" value={formData.link_curso} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-buap-azul-claro" placeholder="https://saberes.mx/..." />
        </div>
        <button type="submit" disabled={cargando} className="w-full bg-buap-azul-oscuro text-white font-bold py-3 px-4 rounded-lg hover:bg-buap-azul-claro transition duration-300 disabled:opacity-50 mt-4">
          {cargando ? 'Guardando...' : 'Guardar Curso'}
        </button>
      </form>
    </div>
  );
}