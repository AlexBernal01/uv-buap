import { useState, useEffect } from 'react';

export default function AdminCursos() {
  const [cursos, setCursos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', duracion: '', carrera: 'administracion', imagen_url: '', link_curso: '' });
  const [cargando, setCargando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('uvie_token');


  const fetchCursos = async () => {
    try {
      const res = await fetch(`${API_URL}/cursos`);
      const data = await res.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);


  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este curso?')) return;
    try {
      await fetch(`${API_URL}/cursos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCursos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };


  const abrirModal = (curso = null) => {
    if (curso) {
      setEditando(curso.id);
      setFormData(curso);
    } else {
      setEditando(null);
      setFormData({ titulo: '', descripcion: '', duracion: '', carrera: 'administracion', imagen_url: '', link_curso: '' });
    }
    setModalAbierto(true);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    const url = editando ? `${API_URL}/cursos/${editando}` : `${API_URL}/cursos`;
    const method = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalAbierto(false);
        fetchCursos();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-buap-azul-oscuro">Gestión de Cursos</h1>
          <p className="text-gray-500 mt-2">Administra el catálogo de cursos.</p>
        </div>
        <button onClick={() => abrirModal()} className="bg-buap-azul-oscuro text-white px-6 py-3 rounded-xl font-bold hover:bg-buap-azul-claro transition">
          + Nuevo Curso
        </button>
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-bold">Título</th>
              <th className="p-4 font-bold">Carrera</th>
              <th className="p-4 font-bold">Duración</th>
              <th className="p-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{curso.titulo}</td>
                <td className="p-4 text-gray-600 capitalize">{curso.carrera}</td>
                <td className="p-4 text-gray-600">{curso.duracion}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => abrirModal(curso)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleEliminar(curso.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr><td colSpan="4" className="text-center p-8 text-gray-400">No hay cursos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>


      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-buap-azul-oscuro">{editando ? 'Editar Curso' : 'Nuevo Curso'}</h2>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Título *</label>
                  <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="w-full p-3 border rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Descripción</label>
                  <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="3" className="w-full p-3 border rounded-lg"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Duración</label>
                  <input type="text" value={formData.duracion} onChange={(e) => setFormData({...formData, duracion: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Carrera</label>
                  <select value={formData.carrera} onChange={(e) => setFormData({...formData, carrera: e.target.value})} className="w-full p-3 border rounded-lg bg-white">
                    <option value="administracion">Administración</option>
                    <option value="gastronomia">Gastronomía</option>
                    <option value="comercio">Comercio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">URL Imagen</label>
                  <input type="url" value={formData.imagen_url || ''} onChange={(e) => setFormData({...formData, imagen_url: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Enlace del Curso</label>
                  <input type="url" value={formData.link_curso || ''} onChange={(e) => setFormData({...formData, link_curso: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalAbierto(false)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={cargando} className="px-6 py-2 rounded-lg font-bold text-white bg-buap-azul-oscuro hover:bg-buap-azul-claro">
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}