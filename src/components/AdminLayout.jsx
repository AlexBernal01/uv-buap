import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('uvie_token');
    localStorage.removeItem('uvie_user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Cursos', path: '/admin/cursos' },
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Pilares', path: '/admin/pilares' },
    { name: 'Dev Zone', path: '/admin/dev' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-buap-azul-oscuro text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <img src="/LU.png" alt="UVIE" className="h-10 w-auto" />
          <div>
            <h2 className="font-bold text-lg leading-tight">Admin Panel</h2>
            <p className="text-xs text-white/60">UVIE - BUAP</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10 text-white/80'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/80 text-red-200 transition-colors font-semibold"
          >
            Cerrar Sesión
          </button>
          <Link to="/" className="block text-center mt-4 text-xs text-white/50 hover:text-white transition">
            Volver al sitio público
          </Link>
        </div>
      </aside>

      {/* Contenido Derecho */}
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}