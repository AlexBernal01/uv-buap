import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-buap-azul-oscuro text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <img
            src="/LU.png"
            alt="Logo UVIE"
            className="h-16 w-auto"
          />
          <p className="text-sm text-white/70 mb-4">
            Unidad de Vinculación en Inteligencia Estratégica
          </p>
          <div className="text-sm text-white/70">
            Facultad de Administración<br />
            <span className="text-sm text-white font-bold">Benemérita Universidad Autónoma de Puebla</span>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold mb-3">Secciones</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-buap-azul-claro transition">Inicio</Link></li>
            <li><Link to="/pilares" className="hover:text-buap-azul-claro transition">Pilares</Link></li>
            <li><Link to="/productos" className="hover:text-buap-azul-claro transition">Productos Insignia</Link></li>
            <li><Link to="/noticias" className="hover:text-buap-azul-claro transition">Noticias</Link></li>
            <li><Link to="/cursos" className="hover:text-buap-azul-claro transition">Cursos</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-bold mb-3">Equipo</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>M.C. María del Carmen Santiago Díaz</li>
            <li>M.C. Ana Claudia Zenteno Vázquez</li>
            <li><Link to="/sobre-nosotros" className="hover:text-buap-azul-claro transition">Sobre Nosotros</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/50 text-center">
          © {new Date().getFullYear()} UVIE - BUAP. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}