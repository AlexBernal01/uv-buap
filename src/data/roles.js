export const rolesDisponibles = [
  { id: '', nombre: 'Sin rol específico', prefijo: '' },
  { id: 'asesor', nombre: 'Asesor pedagógico', prefijo: 'Actúa como asesor pedagógico experto en educación superior. ' },
  { id: 'programador', nombre: 'Programador', prefijo: 'Actúa como programador senior con experiencia en desarrollo de software educativo. ' },
  { id: 'disenador', nombre: 'Diseñador instruccional', prefijo: 'Actúa como diseñador instruccional especializado en educación basada en competencias. ' },
  { id: 'investigador', nombre: 'Investigador académico', prefijo: 'Actúa como investigador académico con publicaciones en revistas indexadas. ' },
  { id: 'analista', nombre: 'Analista de datos', prefijo: 'Actúa como analista de datos con experiencia en educación. ' },
  { id: 'redactor', nombre: 'Redactor académico', prefijo: 'Actúa como redactor académico con dominio de estilo APA 7. ' },
  { id: 'tutor', nombre: 'Tutor personalizado', prefijo: 'Actúa como tutor personalizado que adapta sus explicaciones al nivel del estudiante. ' },
  { id: 'personalizado', nombre: 'Personalizado...', prefijo: '' }
];

export const proveedoresIA = [
  {
    id: 'claude',
    nombre: 'Claude',
    enviaPrompt: true, // Sí acepta URL con prompt
    url: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    color: 'bg-[#D97757] hover:bg-[#c46445]', // Color oficial de Claude
    logo: '/logos/claude.png' // Asegúrate de tener este logo
  },
  {
    id: 'chatgpt',
    nombre: 'Chat GPT',
    enviaPrompt: false, // No acepta URL con prompt
    url: () => `https://chatgpt.com/`,
    color: 'bg-teal-600 hover:bg-teal-700',
    logo: '/logos/gpt.png'
  },
  {
    id: 'gemini',
    nombre: 'Gemini',
    enviaPrompt: false, // No acepta URL con prompt
    url: () => `https://gemini.google.com/app`,
    color: 'bg-blue-600 hover:bg-blue-700',
    logo: '/logos/gemini.jpg'
  }
];