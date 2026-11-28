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
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      
      {/* Header de la página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-buap-azul-oscuro">Gestión de Cursos</h1>
          <p className="text-gray-500 mt-2">Administra el catálogo de cursos y enlaces de la plataforma.</p>
        </div>
        <button 
          onClick={() => abrirModal()} 
          className="flex items-center gap-2 bg-buap-azul-oscuro text-white px-6 py-3 rounded-xl font-bold hover:bg-buap-azul-claro transition-all shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo Curso
        </button>
      </div>

      {/* Grid de Tarjetas */}
      {cursos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
          No hay cursos registrados aún. ¡Crea el primero!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
              
              {/* Imagen de portada */}
              <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                {curso.imagen_url ? (
                  <img src={curso.imagen_url} alt={curso.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Sin imagen</div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-buap-azul-oscuro text-xs font-bold px-3 py-1 rounded-full shadow-sm capitalize">
                  {curso.carrera}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 leading-tight mb-2">{curso.titulo}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{curso.descripcion || 'Sin descripción'}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-buap-azul-claro bg-buap-azul-claro/10 px-2 py-1 rounded">
                    ⏱ {curso.duracion || 'N/A'}
                  </span>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => abrirModal(curso)} 
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleEliminar(curso.id)} 
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PARA CREAR/EDITAR */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fadeIn">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-buap-azul-oscuro">
                {editando ? 'Editar Curso' : 'Agregar Nuevo Curso'}
              </h2>
              <button 
                onClick={() => setModalAbierto(false)} 
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Título del Curso *</label>
                  <input 
                    type="text" 
                    value={formData.titulo} 
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
                    required 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-claro focus:border-transparent transition-all" 
                    placeholder="Ej. Introducción a la IA"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                  <textarea 
                    value={formData.descripcion} 
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
                    rows="3" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-claro focus:border-transparent transition-all"
                    placeholder="Breve descripción del curso..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Duración</label>
                  <input 
                    type="text" 
                    value={formData.duracion} 
                    onChange={(e) => setFormData({...formData, duracion: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-claro focus:border-transparent transition-all" 
                    placeholder="Ej. 10 horas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Carrera</label>
                  <select 
                    value={formData.carrera} 
                    onChange={(e) => setFormData({...formData, carrera: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-claro focus:border-transparent transition-all"
                  >
                    <option value="administracion">Administración</option>
                    <option value="gastronomia">Gastronomía</option>
                    <option value="comercio">Comercio</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL de la Imagen</label>
                  <input 
                    type="url" 
                    value={formData.imagen_url || ''} 
                    onChange={(e) => setFormData({...formData, imagen_url: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-claro focus:border-transparent transition-all" 
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Enlace del Curso (Saberes.mx)</label>
                  <input 
                    type="url" 
                    value={formData.link_curso || ''} 
                    onChange={(e) => setFormData({...formData, link_curso: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-buap-azul-claro focus:border-transparent transition-all" 
                    placeholder="https://saberes.mx/..."
                  />
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)} 
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={cargando} 
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-buap-azul-oscuro hover:bg-buap-azul-claro transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Guardando...
                    </>
                  ) : 'Guardar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}