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
    { 
      name: 'Inicio', 
      path: '/', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    },
    { 
      name: 'Cursos', 
      path: '/admin/cursos', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
    },
    { 
      name: 'Productos', 
      path: '/admin/productos', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
    },
    { 
      name: 'Dev Zone', 
      path: '/admin/devzone', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-buap-azul-oscuro text-white flex flex-col shadow-2xl z-20 sticky top-0 h-screen">
        {/* Logo y Título */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/10">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img src="/LU.png" alt="UVIE" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl leading-tight tracking-wide">UVIE</h2>
            <p className="text-[10px] text-buap-azul-claro uppercase tracking-widest font-semibold mt-1">Admin Panel</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Menú Principal</p>
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/10 text-white font-bold shadow-inner' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {/* Indicador de barra lateral para el activo */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-buap-azul-claro rounded-r-full"></div>
                )}
                
                <span className={`${isActive ? 'text-buap-azul-claro' : 'text-white/50 group-hover:text-white/80'} transition-colors`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/10 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Configuración
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors text-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Cerrar Sesión
          </button>

          <div className="pt-4 mt-2 border-t border-white/10 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-buap-azul-claro transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Ir al sitio público
            </Link>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative">
        {/* Topbar (Opcional, para dar sensación de Dashboard) */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-buap-azul-oscuro">Panel de Administración</span>
            <span>/</span>
            <span className="capitalize">{location.pathname.replace('/admin/', '') || 'Inicio'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Sistema en línea
            </span>
            <div className="w-8 h-8 bg-buap-azul-oscuro text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Aquí se renderizan las páginas (Cursos, Productos, etc.) */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}