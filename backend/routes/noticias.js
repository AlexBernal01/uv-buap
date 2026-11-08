import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

// Función auxiliar para procesar un XML RSS
const procesarRSS = (xml, esDcytic = false) => {
    const $ = cheerio.load(xml, { xmlMode: true });
    const noticias = [];

    $('item').each((i, el) => {
        const titulo = $(el).find('title').text().trim();
        const enlace = $(el).find('link').text().trim();
        const fechaOriginal = $(el).find('pubDate').text().trim();
        
        let descripcionSucias = $(el).find('description').text().trim();
        let descripcionLimpia = descripcionSucias
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 160) + '...';

        // Si es DCyTIC, a veces el RSS no tiene imagen, intentamos sacarla del HTML
        let imagenUrl = null;
        const matchImg = descripcionSucias.match(/<img[^>]+src="([^">]+)"/);
        if (matchImg) {
            imagenUrl = matchImg[1];
            if (imagenUrl.startsWith('/')) {
                imagenUrl = `https://${esDcytic ? 'dcytic.buap.mx' : 'www.buap.mx'}${imagenUrl}`;
            }
        }

        const fechaObj = new Date(fechaOriginal);
        const fechaFormateada = !isNaN(fechaObj) 
            ? fechaObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Reciente';

        if (titulo && enlace) {
            noticias.push({
                titulo: titulo,
                enlace: enlace,
                fecha: fechaFormateada,
                descripcion: descripcionLimpia || "Haz clic para leer la nota completa.",
                imagen: imagenUrl || `https://picsum.photos/seed/${encodeURIComponent(titulo.substring(0,10))}/800/400`,
                // Forzamos la categoría para que los filtros del frontend funcionen
                esTech: esDcytic 
            });
        }
    });
    return noticias;
};

router.get('/tech', async (req, res) => {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        let todasLasNoticias = [];

        // 1. RSS General de la BUAP (Noticias institucionales)
        try {
            const resGeneral = await axios.get('https://www.buap.mx/rss.xml', { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }});
            todasLasNoticias = [...todasLasNoticias, ...procesarRSS(resGeneral.data, false)];
        } catch (e) { console.log("Error RSS General:", e.message); }

        // 2. RSS de DCyTIC (Noticias de Tecnología)
        try {
            const resTech = await axios.get('https://dcytic.buap.mx/rss.xml', { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }});
            todasLasNoticias = [...todasLasNoticias, ...procesarRSS(resTech.data, true)];
        } catch (e) { console.log("Error RSS DCyTIC:", e.message); }

        // Mezclar y quitar duplicados
        const noticiasUnicas = Array.from(new Set(todasLasNoticias.map(n => n.enlace)))
            .map(enlace => todasLasNoticias.find(n => n.enlace === enlace));

        // Ordenar por fecha (aproximada) para que lo más nuevo salga primero
        noticiasUnicas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        res.json({ data: noticiasUnicas });

    } catch (error) {
        console.error('❌ Error crítico:', error.message);
        res.status(500).json({ error: 'No se pudieron cargar las noticias' });
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