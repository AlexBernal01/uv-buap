import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

const PALABRAS_CLAVE_IA = [
    'inteligencia artificial', 'ia ', ' ia', 'ia,', 'ia.', 'ia:', 'ia;', 'ia"',
    'aura', 'ética algorítmica', 'algoritmo', 'algorítmic',
    'lns', 'supercómputo', 'supercomputo', 'cómputo de alto rendimiento',
    'aprendizaje automático', 'machine learning', 'deep learning',
    'modelo de lenguaje', 'llm', 'gpu', 'procesamiento de lenguaje natural',
    'automatización inteligente', 'agente de ia', 'chatbot', 'redes neuronales',
    'ciencia de datos', 'big data'
];

const esNoticiaIA = (titulo, descripcion = '') => {
    const texto = `${titulo} ${descripcion}`.toLowerCase();
    return PALABRAS_CLAVE_IA.some(palabra => texto.includes(palabra));
};

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

        let descLimpia = descSucias.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().substring(0, 160) + '...';

        const fechaObj = new Date(fechaOriginal);
        const fechaFormateada = !isNaN(fechaObj) 
            ? fechaObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Reciente';

        // FILTRO ESTRICTO: Solo pasa si es de IA
        if (titulo && enlace && esNoticiaIA(titulo, descLimpia)) {
            noticias.push({
                titulo,
                enlace,
                fecha: fechaFormateada,
                descripcion: descLimpia,
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
        
        $('article, .post-item, [data-hook="post-list-item"]').each((i, el) => {
            const titulo = $(el).find('h2, h3, [data-hook="post-title"]').text().trim();
            let enlace = $(el).find('a').attr('href');
            const descripcion = $(el).find('p, [data-hook="post-description"]').text().trim().substring(0, 160) + '...';
            
            if (enlace && !enlace.startsWith('http')) {
                enlace = `https://www.aurabuap.mx${enlace.startsWith('/') ? '' : '/'}${enlace}`;
            }

            if (titulo && enlace && esNoticiaIA(titulo, descripcion)) {
                noticias.push({
                    titulo,
                    enlace,
                    fecha: 'Reciente',
                    descripcion,
                    imagen: `https://picsum.photos/seed/${encodeURIComponent(titulo.substring(0,10))}/800/400`
                });
            }
        });
    } catch (e) {
        console.log("Error scraping AURA:", e.message);
    }
    return noticias;
};

const scrapeLNS = async () => {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const noticias = [];
    try {
        const resLNS = await axios.get('https://news.google.com/rss/search?q=LNS+BUAP+inteligencia+artificial&hl=es-419&gl=MX&ceid=MX:es-419', { httpsAgent: agent });
        const lnsNoticias = procesarRSS(resLNS.data);
        lnsNoticias.forEach(n => noticias.push(n));
    } catch (e) {
        console.log("Error buscando noticias de LNS:", e.message);
    }
    return noticias;
};

router.get('/tech', async (req, res) => {
    try {
        let noticias = [];

        const [resGeneral, resTech, auraNoticias, lnsNoticias] = await Promise.all([
            axios.get('https://www.buap.mx/rss.xml', { httpsAgent: new https.Agent({ rejectUnauthorized: false }), headers: { 'User-Agent': 'Mozilla/5.0' }})
                .then(r => procesarRSS(r.data)).catch(e => { console.log("Error RSS General:", e.message); return []; }),
            
            axios.get('https://dcytic.buap.mx/rss.xml', { httpsAgent: new https.Agent({ rejectUnauthorized: false }), headers: { 'User-Agent': 'Mozilla/5.0' }})
                .then(r => procesarRSS(r.data)).catch(e => { console.log("Error RSS DCyTIC:", e.message); return []; }),
            
            scrapeAura(),
            
            scrapeLNS()
        ]);

        noticias = [...resGeneral, ...resTech, ...auraNoticias, ...lnsNoticias];

        const noticiasUnicas = Array.from(new Map(noticias.map(n => [n.enlace, n])).values());

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