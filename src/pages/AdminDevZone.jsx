import { useState, useEffect } from 'react';

export default function AdminDevZone() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/visitas/stats`);
        if (!res.ok) throw new Error('Error al obtener estadísticas');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchStats();
  }, []);

  if (cargando) return <div className="p-10 text-center text-gray-500">Cargando estadísticas de visitas...</div>;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-buap-azul-oscuro">Dev Zone - Tráfico</h1>
        <p className="text-gray-500 mt-2">Estadísticas reales de visitas a la plataforma.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border-l-4 border-red-500">
          Error de conexión: {error}.
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-500">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Visitas Totales</p>
              <p className="text-5xl font-extrabold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-green-500">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Visitas Hoy</p>
              <p className="text-5xl font-extrabold text-gray-800 mt-2">{stats.hoy}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Páginas más visitadas</h2>
            <div className="space-y-4">
              {stats.porPagina.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">{item.pagina}</span>
                  <span className="bg-buap-azul-claro/20 text-buap-azul-oscuro py-1 px-3 rounded-full font-bold text-sm">
                    {item.visitas} visitas
                  </span>
                </div>
              ))}
              {stats.porPagina.length === 0 && (
                <p className="text-gray-400">Aún no hay visitas registradas.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}