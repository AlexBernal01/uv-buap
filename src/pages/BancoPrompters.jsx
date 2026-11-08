import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { plantillasBase } from '../data/plantillas';
import { proveedoresIA } from '../data/roles';


const parsearTexto = (texto) => {
  const partes = texto.split(/(\[[^\]]+\])/g);
  return partes.map((parte, index) => {
    const esVariable = parte.startsWith('[') && parte.endsWith(']');
    return {
      id: index,
      esVariable,
      etiquetaOriginal: esVariable ? parte.replace(/^\[|\]$/g, '') : null,
      valorActual: esVariable ? '' : parte,
      editado: false,
    };
  });
};


const generarTextoFinal = (bloques) => {
  return bloques.map(b => {
    if (b.esVariable) {
      return b.valorActual ? b.valorActual : `[${b.etiquetaOriginal}]`;
    }
    return b.valorActual;
  }).join('');
};

function EditorBloques({ bloquesIniciales, onChange }) {
  const [bloques, setBloques] = useState(() => parsearTexto(bloquesIniciales));
  const [inputActivo, setInputActivo] = useState(null);
  const [valorTemp, setValorTemp] = useState('');

  const guardarVariable = (id) => {
    if (valorTemp.trim() === '') {
      setInputActivo(null);
      return;
    }
    
    const nuevosBloques = bloques.map(b => 
      b.id === id ? { ...b, valorActual: valorTemp, editado: true } : b
    );
    
    setBloques(nuevosBloques);
    setInputActivo(null);
    setValorTemp('');
    onChange(generarTextoFinal(nuevosBloques));
  };

  const restaurar = () => {
    const reset = parsearTexto(bloquesIniciales);
    setBloques(reset);
    onChange(bloquesIniciales);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-sm text-gray-800 leading-relaxed min-h-[150px]">
      {bloques.map((bloque) => {
      
        if (!bloque.esVariable) {
          return <span key={bloque.id} className="whitespace-pre-wrap">{bloque.valorActual}</span>;
        }

   
        if (inputActivo === bloque.id) {
          return (
            <input
              key={bloque.id}
              type="text"
              autoFocus
              value={valorTemp}
              onChange={(e) => setValorTemp(e.target.value)}
              onBlur={() => guardarVariable(bloque.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); guardarVariable(bloque.id); }
                if (e.key === 'Escape') { setInputActivo(null); setValorTemp(''); }
              }}
              placeholder={bloque.etiquetaOriginal}
              className="inline-block bg-white border-2 border-buap-azul-claro rounded px-2 py-0.5 text-sm text-buap-azul-oscuro focus:outline-none w-48 mx-1 shadow-sm"
              style={{ width: `${Math.max(120, valorTemp.length * 8 + 20)}px` }}
            />
          );
        }


        return (
          <button
            key={bloque.id}
            onClick={() => { setInputActivo(bloque.id); setValorTemp(bloque.valorActual); }}
            className={`inline-block font-semibold px-2 py-0.5 rounded mx-1 transition cursor-pointer text-sm ${
              bloque.editado 
                ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200' 
                : 'bg-yellow-100 text-buap-azul-oscuro border border-yellow-300 hover:bg-yellow-200'
            }`}
            title="Haz clic para editar"
          >
            {bloque.editado ? bloque.valorActual : `[${bloque.etiquetaOriginal}]`}
          </button>
        );
      })}

      {}
      <div className="mt-4 border-t border-gray-200 pt-3 flex justify-end">
         <button onClick={restaurar} className="text-xs text-gray-500 hover:text-red-500 underline">
            Restaurar esta plantilla
         </button>
      </div>
    </div>
  );
}

export default function BancoPrompters() {
  const [filtro, setFiltro] = useState('Todas');
  

  const [textosFinales, setTextosFinales] = useState(() =>
    Object.fromEntries(plantillasBase.map((p) => [p.id, p.texto]))
  );
  const [copiado, setCopiado] = useState(null);

  const categorias = useMemo(() => {
    const cats = [...new Set(plantillasBase.map((p) => p.categoria))];
    return ['Todas', ...cats.sort((a, b) => a.localeCompare(b))];
  }, []);

  const actualizarTexto = (id, textoPlano) => {
    setTextosFinales((prev) => ({ ...prev, [id]: textoPlano }));
  };

  const copiar = async (id) => {
    try {
      await navigator.clipboard.writeText(textosFinales[id]);
      setCopiado(id);
      setTimeout(() => setCopiado(null), 2000);
    } catch { alert('No se pudo copiar.'); }
  };

  const abrirIA = async (id, ia) => {
    try {
      await navigator.clipboard.writeText(textosFinales[id]);
      window.open(ia.url(textosFinales[id]), '_blank', 'noopener,noreferrer');
      setCopiado(id + '-' + ia.id);
      setTimeout(() => setCopiado(null), 3000);
    } catch { alert('No se pudo copiar.'); }
  };

  const plantillasFiltradas = filtro === 'Todas' ? plantillasBase : plantillasBase.filter((p) => p.categoria === filtro);
  const iasConPrompt = proveedoresIA.filter(ia => ia.enviaPrompt);
  const iasSinPrompt = proveedoresIA.filter(ia => !ia.enviaPrompt);

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-buap-azul-oscuro mb-2">Banco de Prompters</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                filtro === cat ? 'bg-buap-azul-oscuro text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{cat}</button>
          ))}
        </div>

        <div className="space-y-8">
          {plantillasFiltradas.map((p) => {
            const esCopiado = copiado === p.id;

            return (
              <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-buap-azul-claro font-semibold block mb-1">{p.categoria}</span>
                    <span className="text-lg font-display font-bold text-gray-800">{p.titulo}</span>
                  </div>
                </div>

                {}
                <EditorBloques 
                  key={p.id} 
                  bloquesIniciales={p.texto} 
                  onChange={(nuevoTexto) => actualizarTexto(p.id, nuevoTexto)} 
                />

                <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copiar(p.id)}
                      className={`text-xs px-5 py-2.5 rounded-lg font-bold transition shadow-sm ${
                        esCopiado ? 'bg-green-500 text-white' : 'bg-buap-azul-oscuro text-white hover:bg-buap-azul-claro'
                      }`}
                    >{esCopiado ? '✓ ¡Copiado!' : 'Copiar Prompt'}</button>
                  </div>

                  {}
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-400 font-semibold mr-1">Abrir con Prompter en:</span>
                    <div className="flex gap-1.5">
                      {iasConPrompt.map(ia => (
                        <button
                          key={ia.id}
                          onClick={() => abrirIA(p.id, ia)}
                          title={`Abrir en ${ia.nombre} (Con prompt automático)`}
                          
                        >
                          {copiado === p.id + '-' + ia.id ? '✓' : <img src={ia.logo} alt={ia.nombre} className="w-5 h-5 object-contain" />}
                        </button>
                      ))}
                    </div>
                    <div className="h-5 w-px bg-gray-300 mx-1"></div>
                      <span className="text-xs text-gray-400 font-semibold mr-1">Abrir sin Prompter en:</span>
                    <div className="flex gap-1.5">
                     
                      {iasSinPrompt.map(ia => (
                        
                        <button
                          key={ia.id}
                          onClick={() => abrirIA(p.id, ia)}
                          title={`Abrir en ${ia.nombre} (Copia y pega manual)`}
                         
                        >
                          {copiado === p.id + '-' + ia.id ? '✓' : <img src={ia.logo} alt={ia.nombre} className="w-5 h-5 object-contain" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}