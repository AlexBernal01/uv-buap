import { useState } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';

export default function Cursos() {
  const [filtro, setFiltro] = useState('todos');
  const { data: cursos, loading, error } = useSupabaseData('cursos');

  if (loading) return <p className="p-8 text-center text-gray-400">Cargando cursos...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;

  const cursosFiltrados =
    filtro === 'todos' ? cursos : cursos.filter((c) => c.carrera === filtro);

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl font-bold text-buap-azul-oscuro mb-2">
            Cursos para Profesores
          </h2>
          <p className="text-gray-600">Explora nuestra oferta académica disponible en la plataforma Saberes.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {['todos', 'administracion', 'gastronomia', 'comercio'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filtro === f
                  ? 'bg-buap-azul-oscuro text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursosFiltrados.map((curso) => {
            const urlDestino = curso.link_curso || '#'; 
            
            return (
              <div key={curso.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-t-4 border-t-buap-azul-oscuro">
                <a href={urlDestino} target="_blank" rel="noopener noreferrer" className="relative h-48 w-full overflow-hidden bg-gray-200 block group">
                  <img
                    src={curso.imagen_url || 'https://via.placeholder.com/400x200?text=Curso'}
                    alt={curso.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold uppercase tracking-wider bg-buap-azul-oscuro text-white px-3 py-1 rounded-sm shadow-sm">
                      {curso.carrera}
                    </span>
                  </div>
                </a>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-buap-azul-oscuro mb-2 line-clamp-2 leading-tight">
                    {curso.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">
                    ⏱ Duración: {curso.duracion}
                  </p>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                    {curso.descripcion || 'Sin descripción disponible.'}
                  </p>
                  
                  <a 
                    href={urlDestino} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-gray-50 text-buap-azul-oscuro border border-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-buap-azul-oscuro hover:text-white transition-colors duration-300"
                  >
                    Ir al curso en Saberes.mx →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {cursosFiltrados.length === 0 && (
          <p className="text-center text-gray-400 py-12 text-lg">
            No hay cursos disponibles en esta categoría por el momento.
          </p>
        )}
      </div>
    </section>
  );
}