import logoBuap from '../assets/logo-buap.png';
import fondoBuap from '../assets/login-architecture.webp';

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {}
      <img
        src={fondoBuap}
        alt="Campus BUAP"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {}
      <div className="absolute inset-0 bg-gradient-to-br from-buap-azul-oscuro/95 via-buap-azul-oscuro/85 to-buap-azul-claro/60" />

      {}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 py-10 flex flex-col justify-between text-white">
        {}
        <div className="flex items-center gap-4">
          <img
            src={logoBuap}
            alt="BUAP"
            className="w-16 h-16 object-contain"
          />
          <div className="border-l border-white/40 pl-4 leading-tight">
            <p className="text-sm font-light">Facultad de</p>
            <p className="text-lg font-bold">Administración</p>
          </div>
        </div>

        {}
        <div className="max-w-3xl">
          <p className="text-buap-azul-claro text-sm font-semibold tracking-widest uppercase mb-3">
            UVIE
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
            Unidad de Vinculación en Inteligencia Estratégica
          </h1>
          <p className="text-xl text-white/85 max-w-3xl mb-4">
            Acelerando la transformación digital en la Facultad de Administración.
          </p>
          <p className="text-white/70 max-w-3xl">
            Generamos conocimiento aplicado e innovación para fortalecer la formación,
            la investigación y la toma de decisiones en organizaciones públicas, privadas y sociales.
          </p>
        </div>

        {}
        <div className="border-t border-white/20 pt-4">
          <p className="text-xs tracking-wider text-white/70">
            DESARROLLADO POR{' '}
            <span className="font-bold text-white">
              Unidad de Vinculación en Inteligencia Estratégica
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}