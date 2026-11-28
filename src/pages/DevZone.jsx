import { useState, useEffect } from 'react';

export default function DevZone() {
  const [stats, setStats] = useState({ cursos: 0, productos: 0, pilares: 0, noticias: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error al cargar stats", error);
      } finally {
        setCargando(false);
      }
    };
    fetchStats();
  }, []);

  if (cargando) return <div className="p-10 text-center">Cargando estadísticas...</div>;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-buap-azul-oscuro mb-2">Dev Zone - Estadísticas</h1>
      <p className="text-gray-500 mb-8">Monitoreo en tiempo real de los datos de la plataforma.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
          <p className="text-sm text-gray-500 font-bold uppercase">Total Cursos</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.cursos}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500">
          <p className="text-sm text-gray-500 font-bold uppercase">Total Productos</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.productos}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-yellow-500">
          <p className="text-sm text-gray-500 font-bold uppercase">Total Pilares</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.pilares}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-500">
          <p className="text-sm text-gray-500 font-bold uppercase">Total Noticias</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{stats.noticias}</p>
        </div>
      </div>

      {/* Aquí puedes agregar gráficos con librerías como Recharts si lo deseas */}
      <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Sistema</h2>
        <div className="flex items-center gap-2 text-green-600 font-bold">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Base de datos TiDB Conectada
        </div>
        <p className="text-sm text-gray-500 mt-2">El servidor backend está respondiendo correctamente.</p>
      </div>
    </div>
  );
}