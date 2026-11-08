import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

router.get('/tech', async (req, res) => {
    try {
        // El RSS general de la BUAP es la fuente más estable
        const rssUrl = 'https://www.buap.mx/rss.xml'; 
        const agent = new https.Agent({ rejectUnauthorized: false });

        console.log("🔎 Leyendo RSS oficial de la BUAP...");

        const response = await axios.get(rssUrl, { 
            httpsAgent: agent,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const xml = response.data;
        const $ = cheerio.load(xml, { xmlMode: true });
        const noticias = [];

        $('item').each((i, el) => {
            const titulo = $(el).find('title').text().trim();
            const enlace = $(el).find('link').text().trim();
            const fechaOriginal = $(el).find('pubDate').text().trim();
            
            // LIMPIEZA CRUCIAL: El RSS trae HTML sucio en la descripción
            let descripcionSucias = $(el).find('description').text().trim();
            let descripcionLimpia = descripcionSucias
                .replace(/<[^>]+>/g, ' ') // Quitar etiquetas HTML
                .replace(/\s+/g, ' ')     // Quitar espacios dobles
                .trim()
                .substring(0, 160) + '...';

            // Intentar extraer imagen del HTML de la descripción
            let imagenUrl = null;
            const matchImg = descripcionSucias.match(/<img[^>]+src="([^">]+)"/);
            if (matchImg) {
                imagenUrl = matchImg[1];
                // Si la imagen es relativa, convertirla a absoluta
                if (imagenUrl.startsWith('/')) {
                    imagenUrl = `https://www.buap.mx${imagenUrl}`;
                }
            }

            // Formatear la fecha
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
                    imagen: imagenUrl || `https://picsum.photos/seed/${encodeURIComponent(titulo.substring(0,10))}/800/400`
                });
            }
        });

        console.log(`🚀 Total de noticias extraídas del RSS: ${noticias.length}`);
        res.json({ data: noticias });

    } catch (error) {
        console.error('❌ Error crítico al leer el RSS:', error.message);
        res.status(500).json({ error: 'No se pudieron cargar las noticias' });
    }
});

// (Tus rutas de BD se mantienen igual)
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