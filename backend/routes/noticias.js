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
        
        const basura = t.includes('.pdf') || t.includes('convocatoria') || t.includes('inscripciones') || t.includes('puebla, cuna');
        const esValido = ['inteligencia artificial', 'ia ', ' ia', 'ia,', 'ia.', 'aura', 'algoritmo', 'algorítmic', 'lns', 'supercómputo', 'machine learning', 'deep learning', 'chatbot', 'dcytic'].some(p => t.includes(p));

        if (titulo && enlace && esValido && !basura) {
            noticias.push({
                titulo,
                enlace,
                fecha: fechaFormateada,
                descripcion: descLimpia || 'Da clic para leer la nota completa.',
                imagen: imagenUrl || null // Si no hay imagen, se manda null
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
            
            let imagenAura = $(el).find('img').attr('src');
            if (imagenAura && imagenAura.startsWith('/')) {
                imagenAura = `https://www.aurabuap.mx${imagenAura}`;
            }
            
            if (enlace && !enlace.startsWith('http')) {
                enlace = `https://www.aurabuap.mx${enlace.startsWith('/') ? '' : '/'}${enlace}`;
            }

            if (titulo && enlace) {
                noticias.push({
                    titulo,
                    enlace,
                    fecha: 'Reciente',
                    descripcion: descripcion || 'Da clic para leer la nota completa.',
                    imagen: imagenAura || null
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
        const { data } = await axios.get('https://lns.buap.mx', { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }});
        const $ = cheerio.load(data);
        
        // Buscamos cualquier bloque que parezca una noticia
        $('article, .post, .news-item, .views-row').each((i, el) => {
            const titulo = $(el).find('h2, h3, .title, .node__title').first().text().trim();
            let enlace = $(el).find('a').attr('href');
            
            let imagen = $(el).find('img').attr('src');
            if (imagen && imagen.startsWith('/')) {
                imagen = `https://lns.buap.mx${imagen}`;
            }
            
            if (enlace && !enlace.startsWith('http')) {
                enlace = `https://lns.buap.mx${enlace.startsWith('/') ? '' : '/'}${enlace}`;
            }

            if (titulo && enlace) {
                noticias.push({
                    titulo,
                    enlace,
                    fecha: 'Reciente',
                    descripcion: 'Da clic para leer la nota completa en el sitio del LNS.',
                    imagen: imagen || null
                });
            }
        });
    } catch (e) {
        console.log("Error scraping LNS:", e.message);
    }
    return noticias;
};

router.get('/tech', async (req, res) => {
    try {
        const [auraNoticias, resTech, lnsNoticias] = await Promise.all([
            scrapeAura(),
            axios.get('https://dcytic.buap.mx/rss.xml', { httpsAgent: new https.Agent({ rejectUnauthorized: false }), headers: { 'User-Agent': 'Mozilla/5.0' }})
                .then(r => procesarRSS(r.data)).catch(e => []),
            scrapeLNS()
        ]);

        const noticias = [...auraNoticias, ...lnsNoticias, ...resTech];
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