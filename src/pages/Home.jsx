import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useSupabaseData } from '../hooks/useSupabaseData';

export default function Home() {
  const { data: pilares, loading: loadingPilares } = useSupabaseData('pilares', {
    order: 'orden',
    ascending: true
  });
  const { data: productos } = useSupabaseData('productos');
  const { data: cursos } = useSupabaseData('cursos');

  const [noticias, setNoticias] = useState([]);
  const [pilarAbierto, setPilarAbierto] = useState(null);

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://uv-buap.onrender.com';
        const respuesta = await fetch(`${API_URL}/noticias/tech`);
        if (respuesta.ok) {
          const data = await respuesta.json();
          setNoticias(data.data || []);
        }
      } catch (err) {
        console.error("Error cargando noticias:", err);
      }
    };
    cargarNoticias();
  }, []);

  const togglePilar = (id) => {
    setPilarAbierto(prev => (prev === id ? null : id));
  };

  return (
    <>
      <Hero />

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                  <h2 className="font-display text-2xl font-bold text-buap-azul-oscuro">
                    Pilares Estratégicos
                  </h2>
                </div>

                {loadingPilares ? (
                  <p className="text-gray-400 text-sm">Cargando pilares...</p>
                ) : (
                  <div className="space-y-3">
                    {pilares.map((pilar) => {
                      const abierto = pilarAbierto === pilar.id;
                      return (
                        <div key={pilar.id} className="bg-gray-50 rounded-lg border-l-4 border-buap-azul-claro overflow-hidden">
                          <button
                            onClick={() => togglePilar(pilar.id)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                          >
                            <h3 className="font-semibold text-buap-azul-oscuro">
                              {pilar.nombre}
                            </h3>
                            <span className="text-buap-azul-claro text-lg font-bold">
                              {abierto ? '−' : '+'}
                            </span>
                          </button>
                          {abierto && (
                            <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-200 pt-3">
                              {pilar.descripcion || 'Sin descripción disponible.'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                  <h2 className="font-display text-2xl font-bold text-buap-azul-oscuro">
                    Cursos Destacados
                  </h2>
                  <Link to="/cursos" className="text-sm font-semibold text-buap-azul-claro hover:underline">
                    Ver todos →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cursos.slice(0, 4).map((curso) => {
                    const urlDestino = curso.link_curso && curso.link_curso.trim() !== '' ? curso.link_curso : null;
                    return (
                      <div key={curso.id} className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                        <div className="relative h-32 w-full overflow-hidden bg-gray-200">
                          {curso.imagen_url ? (
                            <img
                              src={curso.imagen_url}
                              alt={curso.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">Sin imagen</div>
                          )}
                          <span className="absolute top-2 left-2 text-xs bg-buap-azul-oscuro text-white px-2 py-1 rounded">
                            {curso.carrera}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col flex-1 justify-between">
                          <div>
                            <h3 className="font-semibold text-buap-azul-oscuro line-clamp-2 text-sm">
                              {curso.titulo}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Duración: {curso.duracion}
                            </p>
                          </div>
                          {urlDestino ? (
                            <a href={urlDestino} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-semibold text-buap-azul-claro hover:underline">
                              Ir al curso →
                            </a>
                          ) : (
                            <span className="inline-block mt-3 text-sm font-semibold text-gray-400 cursor-not-allowed">
                              Próximamente
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                  <h2 className="font-display text-2xl font-bold text-buap-azul-oscuro">
                    Productos Insignia
                  </h2>
                  <Link to="/productos" className="text-sm font-semibold text-buap-azul-claro hover:underline">
                    Ver todos →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {productos.slice(0, 3).map((producto) => (
                    <div key={producto.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="font-semibold text-buap-azul-oscuro text-sm">
                        {producto.titulo}
                      </h3>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {producto.descripcion}
                      </p>
                      <Link to={`/productos/${producto.id}`} className="inline-block mt-3 text-sm font-semibold text-buap-azul-claro hover:underline">
                        Ver producto →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                <div className="bg-buap-azul-oscuro p-4">
                  <h2 className="font-display text-xl font-bold text-white">
                    Últimas Noticias
                  </h2>
                </div>
                <div className="p-4 space-y-4 max-h-[800px] overflow-y-auto">
                  {noticias.length > 0 ? (
                    noticias.map((noticia, idx) => (
                      <a key={idx} href={noticia.enlace} target="_blank" rel="noopener noreferrer" className="flex gap-3 group border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                          {noticia.imagen ? (
                            <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold text-center px-1">Sin imagen</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-blue-500 font-bold block mb-1 uppercase tracking-wider">{noticia.fecha}</span>
                          <h4 className="text-sm font-bold text-gray-800 leading-tight line-clamp-3 group-hover:text-buap-azul-claro transition">
                            {noticia.titulo}
                          </h4>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Cargando noticias o no hay disponibles.</p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                  <Link to="/noticias" className="text-sm font-semibold text-buap-azul-oscuro hover:underline">
                    Ver todas las noticias →
                  </Link>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 bg-gradient-to-r from-buap-azul-oscuro to-buap-azul-claro rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Descubre el Banco de Prompts</h2>
              <p className="text-white/80 max-w-xl">Acelera tu trabajo con plantillas de inteligencia artificial diseñadas específicamente para nuestra comunidad.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/banco-prompters" className="bg-white text-buap-azul-oscuro px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md whitespace-nowrap text-center">
                Para Profesores →
              </Link>
              <Link to="/banco-asistentes" className="bg-buap-azul-oscuro border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-buap-azul-oscuro transition shadow-md whitespace-nowrap text-center">
                Para Asistentes →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}