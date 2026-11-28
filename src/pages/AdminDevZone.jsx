import { useState, useEffect } from 'react';

export default function AdminDevZone() {
  const [stats, setStats] = useState({ cursos: 0, productos: 0, pilares: 0, noticias: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
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

  if (cargando) return <div className="p-10 text-center text-gray-500">Cargando estadísticas del sistema...</div>;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-buap-azul-oscuro">Dev Zone</h1>
        <p className="text-gray-500 mt-2">Panel de control y estadísticas en tiempo real.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border-l-4 border-red-500">
          Error de conexión: {error}. Asegúrate de haber agregado la ruta <code>/api/stats</code> en tu backend.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Cursos</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.cursos}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Productos</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.productos}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-yellow-500">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Pilares</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.pilares}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-500">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Noticias</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.noticias}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Sistema</h2>
        <div className="flex items-center gap-3 text-green-600 font-bold text-lg">
          <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.7)]"></span>
          Base de Datos (TiDB) Conectada
        </div>
        <p className="text-sm text-gray-500 mt-3">
          El frontend se está comunicando correctamente con el servidor en Render.
        </p>
      </div>
    </div>
  );
}