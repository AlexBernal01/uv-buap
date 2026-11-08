import { useState, useEffect } from 'react';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const API_URL =  'http://localhost:3001/api';
        const response = await fetch(`${API_URL}/noticias/tech`);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const json = await response.json();
        
        if (json.data && json.data.length > 0) {
          setNoticias(json.data);
        } else {
          throw new Error("Sin noticias");
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las noticias automáticas.");
        setNoticias([
          { titulo: "Bienvenido a la UVIE", enlace: "#", fecha: "Hoy", descripcion: "Explora los productos insignia.", imagen: "https://picsum.photos/seed/1/800/400" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  if (loading) return <p className="p-8 text-center text-gray-500">Cargando noticias...</p>;
  if (noticias.length === 0) return null;

  const noticiaHero = noticias[0];
  const noticiasNormales = noticias.slice(1, 4);
  const noticiasRapidas = noticias.slice(4, 7);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="border-b-4 border-buap-azul-oscuro pb-2 mb-8">
          <h2 className="font-display text-4xl font-bold text-buap-azul-oscuro">
            Actualidad UVIE & BUAP
          </h2>
        </div>

        {error && <p className="text-orange-500 mb-4 text-sm bg-orange-50 p-3 rounded">{error}</p>}

        {noticiaHero && (
          <a href={noticiaHero.enlace} target="_blank" rel="noreferrer" className="group block mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[350px] md:h-[400px] w-full overflow-hidden bg-gray-100">
                <img 
                  src={noticiaHero.imagen} 
                  alt={noticiaHero.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/uvie-hero/800/400'; }}
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <span className="text-sm font-bold text-buap-azul-claro mb-2 block uppercase tracking-wider">{noticiaHero.fecha}</span>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4 group-hover:text-buap-azul-oscuro transition leading-tight">
                  {noticiaHero.titulo}
                </h3>
                <p className="text-gray-600 text-lg mb-6 line-clamp-4">
                  {noticiaHero.descripcion}
                </p>
                <span className="text-buap-azul-oscuro font-bold underline underline-offset-4 text-lg">Leer nota completa →</span>
              </div>
            </div>
          </a>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticiasNormales.map((noticia, i) => (
                <a key={i} href={noticia.enlace} target="_blank" rel="noreferrer" className="group flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={noticia.imagen} 
                      alt={noticia.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      onError={(e) => { e.target.src = 'https://picsum.photos/seed/uvie-normal/400/300'; }} 
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-bold text-buap-azul-claro mb-2 uppercase">{noticia.fecha}</span>
                    <h4 className="font-display font-bold text-lg text-gray-900 mb-2 group-hover:text-buap-azul-oscuro transition leading-snug line-clamp-2">
                      {noticia.titulo}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-3 mt-auto">
                      {noticia.descripcion}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-300 pb-2">
              Noticias Rápidas
            </h4>
            
            <div className="flex flex-col gap-6">
              {noticiasRapidas.map((noticia, i) => (
                <a key={i} href={noticia.enlace} target="_blank" rel="noreferrer" className="group flex gap-4 items-start">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                    <img 
                      src={noticia.imagen} 
                      alt={noticia.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      onError={(e) => { e.target.src = 'https://picsum.photos/seed/uvie-rapida/400/300'; }} 
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-buap-azul-claro mb-1 uppercase">{noticia.fecha}</span>
                    <h5 className="font-display font-bold text-sm text-gray-900 mb-1 group-hover:text-buap-azul-oscuro transition leading-snug line-clamp-2">
                      {noticia.titulo}
                    </h5>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {noticia.descripcion}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}