import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-buap-azul-oscuro text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/LU.png"
            alt="Logo UVIE"
            className="h-17 w-auto"
          />
          <div className="border-l border-white/30 pl-3">
            <div className="text-sm font-semibold">UVIE</div>
            <div className="text-xs text-white/70">Unidad de Vinculación en Inteligencia Estratégica</div>
          </div>
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link to="/productos" className="hover:text-buap-azul-claro transition">Productos</Link>
          <Link to="/noticias" className="hover:text-buap-azul-claro transition">Noticias</Link>
          <Link to="/cursos" className="hover:text-buap-azul-claro transition">Cursos</Link>
          <Link to="/banco-prompters" className="hover:text-buap-azul-claro transition">Banco de Prompts</Link>
          <Link to="/sobre-nosotros" className="hover:text-buap-azul-claro transition">Sobre Nosotros</Link>
          
        </nav>
      </div>
    </header>
  );
}