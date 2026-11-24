import { useState, useEffect } from 'react';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        // OJO AQUÍ: Asegúrate de que no se duplique el /api. 
        // Si en tu variable de entorno VITE_API_URL ya tienes el /api, quítalo de aquí abajo.
        const API_URL = import.meta.env.VITE_API_URL || 'https://uv-buap.onrender.com';
        const respuesta = await fetch(`${API_URL}/noticias/tech`);
        
        if (!respuesta.ok) throw new Error('Error al cargar noticias');
        
        const data = await respuesta.json();
        setNoticias(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarNoticias();
  }, []);

  if (cargando) {
    return (
      <div className="text-center py-24 text-buap-azul-oscuro font-bold text-lg">
        Cargando noticias de Inteligencia Artificial...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        No hay noticias de Inteligencia Artificial en este momento.
      </div>
    );
  }

  const noticiaPrincipal = noticias[0];
  const noticiasSecundarias = noticias.slice(1, 4);
  const noticiasRapidas = noticias.slice(4, 8);

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        <h1 className="font-display text-3xl font-bold text-buap-azul-oscuro mb-8 border-b-2 border-buap-azul-oscuro pb-2">
          Actualidad BUAP
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2">
            <article className="group cursor-pointer flex flex-col md:flex-row h-full bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img 
                  src={noticiaPrincipal.imagen} 
                  alt={noticiaPrincipal.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="md:w-1/2 p-6 flex flex-col justify-center">
                <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-3 block">
                  {noticiaPrincipal.fecha}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-buap-azul-claro transition line-clamp-3">
                  {noticiaPrincipal.titulo}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-4">
                  {noticiaPrincipal.descripcion}
                </p>
                <a 
                  href={noticiaPrincipal.enlace} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border-b-2 border-buap-azul-oscuro text-buap-azul-oscuro font-bold pb-1 self-start hover:text-buap-azul-claro hover:border-buap-azul-claro transition"
                >
                  Leer nota completa →
                </a>
              </div>
            </article>
          </div>

          <div className="lg:col-span-1 border border-gray-200 rounded-xl p-5 bg-white">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
              Noticias Rápidas
            </h3>
            <div className="flex flex-col gap-4">
              {noticiasRapidas.map((noticia, idx) => (
                <a key={idx} href={noticia.enlace} target="_blank" rel="noopener noreferrer" className="flex gap-3 group">
                  <div className="w-16 h-16 shrink-0 rounded overflow-hidden">
                    <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-500 font-bold block mb-1">{noticia.fecha}</span>
                    <h4 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 group-hover:text-buap-azul-claro transition">
                      {noticia.titulo}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {noticiasSecundarias.map((noticia, idx) => (
            <article key={idx} className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={noticia.imagen} 
                  alt={noticia.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-2 block">
                  {noticia.fecha}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-buap-azul-claro transition line-clamp-3">
                  {noticia.titulo}
                </h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {noticia.descripcion}
                </p>
                <a 
                  href={noticia.enlace} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto inline-block border-b-2 border-buap-azul-oscuro text-buap-azul-oscuro font-bold pb-1 self-start hover:text-buap-azul-claro hover:border-buap-azul-claro transition text-sm"
                >
                  Leer nota completa →
                </a>
              </div>
            </article>
          ))}
        </div>

        {noticias.length > 8 && (
          <div className="flex justify-center mt-8">
            <button className="bg-buap-azul-oscuro text-white font-bold px-8 py-3 rounded-full hover:bg-buap-azul-claro transition">
              Cargar más noticias ↓
            </button>
          </div>
        )}

      </div>
    </section>
  );
}