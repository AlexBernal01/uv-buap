import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UVIE_BASE64 } from '../data/uvie-base64';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Contextos integrados para evitar el error de importación
const CONTEXTOS_CARRERAS = {
  general: 'Eres un asistente experto de la Facultad de Administración de la BUAP. Ayudas a profesores, alumnos y visitantes a resolver dudas sobre la UVIE, sus cursos, productos y servicios.',
  administracion: 'Eres un asistente especializado en la carrera de Administración de Empresas de la BUAP. Ayudas a docentes y alumnos con temas de gestión, estrategia, liderazgo y emprendimiento.',
  gastronomia: 'Eres un asistente especializado en la carrera de Gastronomía de la BUAP. Ayudas a docentes y alumnos con temas culinarios, tendencias gastronómicas, costos y gestión de alimentos.',
  comercio: 'Eres un asistente especializado en la carrera de Comercio Internacional de la BUAP. Ayudas a docentes y alumnos con temas de exportación, logística, aduanas y mercados globales.'
};

const SYSTEM_PROMPT_BASE = `Habla de forma natural, cercana y profesional. Responde en máximo 4-5 oraciones. NO uses markdown pesado. Ve directo al grano.`;

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      rol: 'bot',
      texto: 'Hola, soy el asistente virtual de la UVIE. Para darte la mejor información, cuéntame primero: ¿cuál es tu rol?',
      opciones: [
        { label: 'Profesor', valor: 'profesor' },
        { label: 'Alumno', valor: 'alumno' },
        { label: 'Visitante', valor: 'visitante' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [contexto, setContexto] = useState({ rol: null, carrera: null });
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const detectarCarrera = (texto) => {
    const lower = texto.toLowerCase();
    if (lower.includes('gastronom') || lower.includes('chef') || lower.includes('cocina')) return 'gastronomia';
    if (lower.includes('comercio') || lower.includes('internacional') || lower.includes('exporta')) return 'comercio';
    if (lower.includes('administra') || lower.includes('gestion') || lower.includes('empresa')) return 'administracion';
    return null;
  };

  const manejarOpcion = (opcion, mensajeIndex) => {
    setMensajes(prev => [...prev, { rol: 'user', texto: opcion.label }]);

    setMensajes(prev => {
      const copia = [...prev];
      if (copia[mensajeIndex]) {
        copia[mensajeIndex] = { ...copia[mensajeIndex], opciones: null };
      }
      return copia;
    });

    if (opcion.valor === 'profesor' || opcion.valor === 'alumno' || opcion.valor === 'visitante') {
      setContexto(prev => ({ ...prev, rol: opcion.valor }));

      if (opcion.valor === 'profesor') {
        setTimeout(() => {
          setMensajes(prev => [...prev, {
            rol: 'bot',
            texto: 'Perfecto. ¿De qué carrera eres?',
            opciones: [
              { label: 'Gastronomía', valor: 'gastronomia' },
              { label: 'Administración', valor: 'administracion' },
              { label: 'Comercio Internacional', valor: 'comercio' }
            ]
          }]);
        }, 400);
      } else {
        setTimeout(() => {
          setMensajes(prev => [...prev, {
            rol: 'bot',
            texto: 'Muy bien. ¿Qué te gustaría saber?',
            opciones: [
              { label: '¿Qué es la UVIE?', valor: 'pregunta:¿Qué es la UVIE?' },
              { label: 'Cursos disponibles', valor: 'pregunta:¿Qué cursos ofrecen?' },
              { label: 'Productos insignia', valor: 'pregunta:¿Cuáles son los productos insignia de la UVIE?' }
            ]
          }]);
        }, 400);
      }
      return;
    }

    if (opcion.valor === 'gastronomia' || opcion.valor === 'administracion' || opcion.valor === 'comercio') {
      setContexto(prev => ({ ...prev, carrera: opcion.valor }));

      setTimeout(() => {
        setMensajes(prev => [...prev, {
          rol: 'bot',
          texto: 'Excelente. Ahora dime, ¿qué te gustaría consultar?',
          opciones: [
            { label: 'Cursos para mi carrera', valor: 'pregunta:¿Qué cursos hay para mi carrera?' },
            { label: 'Noticias recientes', valor: 'pregunta:¿Cuáles son las noticias recientes de la UVIE?' }
          ]
        }]);
      }, 400);
      return;
    }

    if (opcion.valor.startsWith('pregunta:')) {
      const pregunta = opcion.valor.replace('pregunta:', '');
      enviarMensaje(pregunta);
      return;
    }
  };

  const enviarMensaje = async (textoDirecto) => {
    const mensajeUsuario = textoDirecto || input;
    if (!mensajeUsuario.trim() || cargando) return;

    setInput('');
    setMensajes(prev => [...prev, { rol: 'user', texto: mensajeUsuario }]);
    setCargando(true);

    try {
      let carrera = contexto.carrera || detectarCarrera(mensajeUsuario);

      // Usamos los contextos integrados en lugar de promptsCarreras
      let systemPrompt = CONTEXTOS_CARRERAS.general;
      if (carrera && CONTEXTOS_CARRERAS[carrera]) {
        systemPrompt = CONTEXTOS_CARRERAS[carrera];
      }

      let contextoExtra = '';
      if (contexto.rol) contextoExtra += `El usuario es ${contexto.rol}. `;
      if (carrera) contextoExtra += `Pertenece a la carrera de ${carrera}. `;

      const interaction = await ai.models.generateContent({
        model: 'gemini-3.6-flash', // Modelo actualizado
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: 'application/pdf', data: UVIE_BASE64 } },
              { text: `${systemPrompt}\n\n${SYSTEM_PROMPT_BASE}\n\n${contextoExtra}\nMensaje del usuario: ${mensajeUsuario}` }
            ]
          }
        ]
      });

      const textoRespuesta = interaction.text;

      setMensajes(prev => [...prev, { rol: 'bot', texto: textoRespuesta }]);
    } catch (error) {
      console.error('Error Gemini:', error);
      setMensajes(prev => [...prev, {
        rol: 'bot',
        texto: 'Lo siento, hubo un error. Verifica tu conexión o la API Key.'
      }]);
    } finally {
      setCargando(false);
    }
  };

  const manejarEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <>
      <button
        onClick={() => setAbierto(!abierto)}
        className="fixed bottom-6 right-6 bg-buap-azul-oscuro text-white p-4 rounded-full shadow-lg hover:bg-buap-azul-claro transition z-50"
        aria-label="Abrir chat"
      >
        {abierto ? 'Cerrar' : 'Chat'}
      </button>

      {abierto && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-buap-azul-oscuro text-white p-4 relative">
            <h3 className="font-display font-bold">Asistente UVIE</h3>
            <p className="text-xs text-white/70">Cuéntame tu perfil y te ayudo</p>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {mensajes.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.rol === 'user'
                      ? 'bg-buap-azul-oscuro text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.texto}
                  </div>
                </div>

                {msg.rol === 'bot' && msg.opciones && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.opciones.map((op, j) => (
                      <button
                        key={j}
                        onClick={() => manejarOpcion(op, i)}
                        className="text-xs px-3 py-2 rounded-full bg-buap-azul-claro/10 text-buap-azul-oscuro border border-buap-azul-claro/30 hover:bg-buap-azul-claro/20 transition"
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-500">
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={manejarEnter}
                placeholder="O escribe tu pregunta..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-buap-azul-claro"
              />
              <button
                onClick={() => enviarMensaje()}
                disabled={cargando}
                className="bg-buap-azul-oscuro text-white px-4 py-2 rounded-lg text-sm hover:bg-buap-azul-claro transition disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}