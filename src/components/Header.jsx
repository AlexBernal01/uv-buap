import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-buap-azul-oscuro text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/LU.png" alt="Logo UVIE" className="h-17 w-auto" />
          <div className="border-l border-white/30 pl-3">
            <div className="text-sm font-semibold">UVIE</div>
            <div className="text-xs text-white/70">
              Unidad de Vinculación en Inteligencia Estratégica
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/productos" className="hover:text-buap-azul-claro transition">
            Productos
          </Link>
          <Link to="/noticias" className="hover:text-buap-azul-claro transition">
            Noticias
          </Link>
          <Link to="/cursos" className="hover:text-buap-azul-claro transition">
            Cursos
          </Link>

          <div className="relative group py-2">
            <Link
              
              className="hover:text-buap-azul-claro transition inline-flex items-center gap-1"
            >
              Banco de Prompts
            </Link>

            <ul className="hidden group-hover:block absolute left-0 top-full pt-2 w-48 z-50">
              <div className="bg-white text-gray-800 shadow-lg rounded-md py-2 border border-gray-100">
                <li>
                  <Link
                    to="/banco-prompters"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-buap-azul-claro transition"
                  >
                    Para Profesores
                  </Link>
                </li>
                <li>
                  <Link
                    to="/banco-asistentes"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-buap-azul-claro transition"
                  >
                    Para Asistentes
                  </Link>
                </li>
              </div>
            </ul>
          </div>

          <Link to="/sobre-nosotros" className="hover:text-buap-azul-claro transition">
            Sobre Nosotros
          </Link>
          <Link to="/login" className="hover:text-buap-azul-claro transition">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}