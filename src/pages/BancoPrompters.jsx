import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { plantillasBase } from '../data/plantillas';
import { proveedoresIA } from '../data/roles';

function TextoEditable({ texto, onCambiar }) {
  const [activo, setActivo] = useState(null);
  const [valorTemp, setValorTemp] = useState('');

  const confirmar = (indice) => {
    // Si está vacío, no reemplazamos, solo cerramos
    if (valorTemp.trim() === '') {
      setActivo(null);
      return;
    }
    
    const partes = texto.split(/(\[[^\]]+\])/g);
    let contador = 0;
    const nuevoTexto = partes
      .map((p) => {
        if (p.startsWith('[') && p.endsWith(']')) {
          const actual = contador;
          contador++;
          if (actual === indice) {
            return valorTemp;
          }
        }
        return p;
      })
      .join('');
      
    onCambiar(nuevoTexto);
    setActivo(null);
    setValorTemp('');
  };

  const partes = texto.split(/(\[[^\]]+\])/g);
  let contadorHuecos = -1;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
      {partes.map((part, i) => {
        const esCorchete = part.startsWith('[') && part.endsWith(']');
        
        if (esCorchete) {
          contadorHuecos++;
          const indiceActual = contadorHuecos;

          if (activo === indiceActual) {
            return (
              <input
                key={i}
                type="text"
                autoFocus
                value={valorTemp}
                onChange={(e) => setValorTemp(e.target.value)}
                onBlur={() => confirmar(indiceActual)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    confirmar(indiceActual);
                  }
                  if (e.key === 'Escape') {
                    setActivo(null);
                    setValorTemp('');
                  }
                }}
                placeholder={part.replace(/^\[|\]$/g, '')}
                className="inline-block bg-white border border-buap-azul-claro rounded px-1 py-0.5 text-xs text-buap-azul-oscuro focus:outline-none min-w-[8rem] mx-0.5"
              />
            );
          }

          return (
            <button
              key={i}
              onClick={() => {
                setActivo(indiceActual);
                setValorTemp('');
              }}
              className="bg-yellow-100 text-buap-azul-oscuro font-semibold px-1.5 py-0.5 rounded hover:bg-yellow-200 transition cursor-pointer mx-0.5 inline-block"
            >
              {part}
            </button>
          );
        }
        
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

export default function BancoPrompters() {
  const [filtro, setFiltro] = useState('Todas');
  const [textos, setTextos] = useState(() =>
    Object.fromEntries(plantillasBase.map((p) => [p.id, p.texto]))
  );
  const [copiado, setCopiado] = useState(null);
  const [previewAbierto, setPreviewAbierto] = useState(null);

  const categorias = useMemo(
    () => ['Todas', ...new Set(plantillasBase.map((p) => p.categoria))],
    []
  );

  const actualizar = (id, valor) => {
    setTextos((prev) => ({ ...prev, [id]: valor }));
  };

  const restaurar = (id) => {
    const original = plantillasBase.find((p) => p.id === id);
    setTextos((prev) => ({ ...prev, [id]: original.texto }));
  };

  const copiar = async (id) => {
    try {
      await navigator.clipboard.writeText(textos[id]);
      setCopiado(id);
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      alert('No se pudo copiar. Selecciona el texto manualmente.');
    }
  };

  const abrirIAExterna = async (id, proveedor) => {
    try {
      const prompt = textos[id];
      await navigator.clipboard.writeText(prompt);

      const prov = proveedoresIA.find((p) => p.id === proveedor);
      if (prov && typeof prov.url === 'function') {
        window.open(prov.url(prompt), '_blank', 'noopener,noreferrer');
      }

      setCopiado(id + '-' + proveedor);
      setTimeout(() => setCopiado(null), 3500);
    } catch {
      alert('No se pudo copiar. Selecciona el texto manualmente.');
    }
  };

  const plantillasFiltradas =
    filtro === 'Todas'
      ? plantillasBase
      : plantillasBase.filter((p) => p.categoria === filtro);

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-buap-azul-oscuro mb-2">
          Banco de Prompters para Profesores
        </h1>
        <p className="text-gray-600 mb-6">
          Haz clic en las palabras <span className="bg-yellow-100 text-buap-azul-oscuro px-1.5 py-0.5 rounded text-xs font-semibold">amarillas</span> para rellenar los datos requeridos. El texto restante está fijado para asegurar que la IA genere una actividad con la estructura pedagógica correcta.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                filtro === cat
                  ? 'bg-buap-azul-oscuro text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {plantillasFiltradas.map((p) => {
            const esCopiado = copiado === p.id;
            const preview = previewAbierto === p.id;

            return (
              <div
                key={p.id}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-buap-azul-claro font-semibold">
                      {p.categoria}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {p.titulo}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {proveedoresIA.map((prov) => {
                      const esCopiadoProv = copiado === p.id + '-' + prov.id;
                      return (
                        <button
                          key={prov.id}
                          onClick={() => abrirIAExterna(p.id, prov.id)}
                          title={`Abrir en ${prov.nombre}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition shadow-sm`}
                        >
                          {esCopiadoProv ? (
                            <span className="text-[10px]">✓</span>
                          ) : (
                            <img src={prov.logo} alt={prov.nombre} className="w-5 h-5 object-contain" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <TextoEditable
                  texto={textos[p.id]}
                  onCambiar={(nuevo) => actualizar(p.id, nuevo)}
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => copiar(p.id)}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition ${
                      esCopiado
                        ? 'bg-green-100 text-green-700'
                        : 'bg-buap-azul-oscuro text-white hover:bg-buap-azul-claro'
                    }`}
                  >
                    {esCopiado ? '✓ Copiado' : '📋 Copiar Prompter'}
                  </button>

                  <button
                    onClick={() => setPreviewAbierto(preview ? null : p.id)}
                    className="text-xs px-4 py-2 rounded-lg font-semibold text-buap-azul-oscuro bg-gray-100 hover:bg-gray-200 transition"
                  >
                    {preview ? 'Ocultar vista previa' : 'Ver vista previa'}
                  </button>

                  <button
                    onClick={() => restaurar(p.id)}
                    className="text-xs px-4 py-2 rounded-lg font-semibold text-gray-500 hover:text-buap-azul-oscuro transition"
                  >
                    Restaurar original
                  </button>
                </div>

                {preview && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h4 className="text-xs uppercase tracking-wide text-buap-azul-claro font-semibold mb-2">
                      Vista previa del prompt final
                    </h4>
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap font-mono">
                      {textos[p.id]}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-4 bg-buap-azul-claro/10 rounded-lg border border-buap-azul-claro/30">
          <p className="text-sm text-buap-azul-oscuro">
            <strong>¿Cómo funciona?</strong> Al hacer clic en "Copiar Prompter", el texto completo (con tus ediciones) se copia. Pégalo en ChatGPT, Gemini o Claude y la IA te devolverá el material y la actividad solicitada.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-buap-azul-claro hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {copiado && copiado.includes('-') && (
        <div className="fixed bottom-4 right-4 bg-buap-azul-oscuro text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50">
          Prompt copiado. Pégalo con Ctrl+V en el chat de tu IA.
        </div>
      )}
    </section>
  );
}