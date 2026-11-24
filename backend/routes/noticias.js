import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

const procesarRSS = (xml) => {
    const $ = cheerio.load(xml, { xmlMode: true });
    const noticias = [];

    $('item').each((i, el) => {
        const titulo = $(el).find('title').text().trim();
        const enlace = $(el).find('link').text().trim();
        const fechaOriginal = $(el).find('pubDate').text().trim();
        let descSucias = $(el).find('description').text().trim();
        
        let imagenUrl = null;
        const matchImg = descSucias.match(/<img[^>]+src="([^">]+)"/);
        if (matchImg) {
            imagenUrl = matchImg[1];
            if (imagenUrl.startsWith('/')) imagenUrl = `https://www.buap.mx${imagenUrl}`;
        }

        let descLimpia = descSucias
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/Title:/gi, '')
            .replace(/Description:/gi, '')
            .replace(/location\s*=\s*.*/gi, '')
            .replace(/window\.open.*/gi, '')
            .replace(/https?:\/\/[^\s]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
            
        if (descLimpia.length > 160) descLimpia = descLimpia.substring(0, 160) + '...';

        const fechaObj = new Date(fechaOriginal);
        const fechaFormateada = !isNaN(fechaObj) 
            ? fechaObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Reciente';

        const t = `${titulo} ${descLimpia}`.toLowerCase();
        
        // Filtro: Tiene que ser de IA, DCyTIC, AURA o LNS. Descartar PDFs y convocatorias.
        const basura = t.includes('.pdf') || t.includes('convocatoria') || t.includes('inscripciones') || t.includes('puebla, cuna');
        const esValido = ['inteligencia artificial', 'ia ', ' ia', 'ia,', 'ia.', 'aura', 'algoritmo', 'algorítmic', 'lns', 'supercómputo', 'machine learning', 'deep learning', 'chatbot', 'dcytic'].some(p => t.includes(p));

        if (titulo && enlace && esValido && !basura) {
            noticias.push({
                titulo,
                enlace,
                fecha: fechaFormateada,
                descripcion: descLimpia || 'Da clic para leer la nota completa.',
                imagen: imagenUrl || `https://picsum.photos/seed/${encodeURIComponent(titulo.substring(0,10))}/800/400`
            });
        }
    });
    return noticias;
};

const scrapeAura = async () => {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const noticias = [];
    try {
        const { data } = await axios.get('https://www.aurabuap.mx/blog', { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }});
        const $ = cheerio.load(data);
        
        $('.wix-blog-post').each((i, el) => {
            const titulo = $(el).find('.post-title').text().trim();
            let enlace = $(el).find('a').attr('href');
            const descripcion = $(el).find('.post-description').text().trim().substring(0, 160) + '...';
            
            if (enlace && !enlace.startsWith('http')) {
                enlace = `https://www.aurabuap.mx${enlace.startsWith('/') ? '' : '/'}${enlace}`;
            }

            if (titulo && enlace) {
                noticias.push({
                    titulo,
                    enlace,
                    fecha: 'Reciente',
                    descripcion: descripcion || 'Da clic para leer la nota completa.',
                    imagen: `https://picsum.photos/seed/${encodeURIComponent(titulo.substring(0,10))}/800/400`
                });
            }
        });
    } catch (e) {
        console.log("Error scraping AURA:", e.message);
    }
    return noticias;
};

const noticiasLNSReales = [
    {
        titulo: "LNS de la BUAP se consolida como un centro para el desarrollo de la ciencia",
        enlace: "https://lns.buap.mx",
        fecha: "2 de Diciembre de 2025",
        descripcion: "El Laboratorio Nacional de Supercómputo impulsa la investigación en inteligencia artificial y ciencia de datos en la región.",
        imagen: "https://picsum.photos/seed/lns1/800/400"
    },
    {
        titulo: "LNS será parte del Clúster Nacional de Alto Rendimiento e IA",
        enlace: "https://lns.buap.mx",
        fecha: "21 de Agosto de 2025",
        descripcion: "La BUAP forma parte de la red nacional que apoyará el entrenamiento de modelos de lenguaje masivos y aprendizaje automático.",
        imagen: "https://picsum.photos/seed/lns2/800/400"
    },
    {
        titulo: "Albergará Laboratorio de Supercómputo BUAP 120 proyectos de investigación",
        enlace: "https://lns.buap.mx",
        fecha: "22 de Marzo de 2024",
        descripcion: "Investigadores de todo el país utilizan la infraestructura del LNS para simulaciones de IA, algoritmos genéticos y big data.",
        imagen: "https://picsum.photos/seed/lns3/800/400"
    },
    {
        titulo: "La BUAP se suma al Clúster Nacional de Cómputo de Alto Rendimiento",
        enlace: "https://lns.buap.mx",
        fecha: "28 de Agosto de 2023",
        descripcion: "A través del LNS, la universidad fortalece la capacitación en inteligencia artificial y análisis de datos.",
        imagen: "https://picsum.photos/seed/lns4/800/400"
    }
];

router.get('/tech', async (req, res) => {
    try {
        const [auraNoticias, resTech] = await Promise.all([
            scrapeAura(),
            axios.get('https://dcytic.buap.mx/rss.xml', { httpsAgent: new https.Agent({ rejectUnauthorized: false }), headers: { 'User-Agent': 'Mozilla/5.0' }})
                .then(r => procesarRSS(r.data)).catch(e => [])
        ]);

        const noticias = [...auraNoticias, ...noticiasLNSReales, ...resTech];
        let noticiasUnicas = Array.from(new Map(noticias.map(n => [n.enlace, n])).values());

        res.json({ data: noticiasUnicas });

    } catch (error) {
        console.error('Error crítico:', error.message);
        res.status(500).json({ error: 'Error al cargar noticias' });
    }
});

router.get('/', async (req, res) => {
    try { const [rows] = await pool.query('SELECT * FROM noticias ORDER BY fecha DESC'); res.json(rows); } catch (error) { res.status(500).json({ error: error.message }); }
});
router.get('/:id', async (req, res) => {
    try { const [rows] = await pool.query('SELECT * FROM noticias WHERE id = ?', [req.params.id]); if (rows.length === 0) return res.status(404).json({ error: 'No encontrada' }); res.json(rows[0]); } catch (error) { res.status(500).json({ error: error.message }); }
});
router.post('/', async (req, res) => {
    try { const { titulo, fecha, contenido, imagen, imagen_url } = req.body; const [result] = await pool.query('INSERT INTO noticias (titulo, fecha, contenido, imagen, imagen_url) VALUES (?, ?, ?, ?, ?)', [titulo, fecha, contenido, imagen, imagen_url]); res.status(201).json({ id: result.insertId }); } catch (error) { res.status(500).json({ error: error.message }); }
});

export default router;