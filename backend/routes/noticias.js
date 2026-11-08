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
        
        // Extraer imagen
        let imagenUrl = null;
        const matchImg = descSucias.match(/<img[^>]+src="([^">]+)"/);
        if (matchImg) {
            imagenUrl = matchImg[1];
            if (imagenUrl.startsWith('/')) imagenUrl = `https://www.buap.mx${imagenUrl}`;
        }

        // Limpiar descripción
        let descLimpia = descSucias
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 160) + '...';

        const fechaObj = new Date(fechaOriginal);
        const fechaFormateada = !isNaN(fechaObj) 
            ? fechaObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Reciente';

        if (titulo && enlace) {
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

router.get('/tech', async (req, res) => {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        let noticias = [];

        // 1. Intentar RSS General
        try {
            const resGeneral = await axios.get('https://www.buap.mx/rss.xml', { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }});
            noticias = procesarRSS(resGeneral.data);
        } catch (e) { console.log("Error RSS General:", e.message); }

        // 2. Si falla o no hay, intentar RSS DCyTIC (Tecnología)
        if (noticias.length === 0) {
            try {
                const resTech = await axios.get('https://dcytic.buap.mx/rss.xml', { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }});
                noticias = procesarRSS(resTech.data);
            } catch (e) { console.log("Error RSS DCyTIC:", e.message); }
        }

        console.log(`✅ Total noticias: ${noticias.length}`);
        res.json({ data: noticias });

    } catch (error) {
        console.error('❌ Error crítico:', error.message);
        res.status(500).json({ error: 'Error al cargar noticias' });
    }
});

// (Rutas de BD se mantienen igual)
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