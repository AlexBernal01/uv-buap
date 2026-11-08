import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

router.get('/tech', async (req, res) => {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const url = 'https://boletin.buap.mx/boletines'; 

        const response = await axios.get(url, { 
            httpsAgent: agent, 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        
        const $ = cheerio.load(response.data);
        const noticias = [];

        $('.views-row').each((i, el) => {
            const tituloTag = $(el).find('h2 a, h3 a').first();
            const titulo = tituloTag.text().trim();
            const enlace = tituloTag.attr('href');
            
            if (!titulo || !enlace) return;

            const imgTag = $(el).find('img').first();
            let imagen = imgTag.attr('src');
            if (imagen && imagen.startsWith('/')) {
                imagen = `https://boletin.buap.mx${imagen}`;
            }

            const fecha = $(el).find('.date-display-single').text().trim() || 'Reciente';

            let desc = $(el).find('.field--name-body p, .views-field-body').text().trim();
            if (!desc) desc = "Haz clic para leer la nota completa.";
            desc = desc.substring(0, 150) + '...';

            noticias.push({
                titulo,
                enlace: enlace.startsWith('/') ? `https://boletin.buap.mx${enlace}` : enlace,
                fecha,
                descripcion: desc,
                imagen: imagen || `https://picsum.photos/seed/${encodeURIComponent(titulo.substring(0,10))}/800/400`
            });
        });

        console.log(`✅ Noticias reales extraídas: ${noticias.length}`);
        res.json({ data: noticias });

    } catch (error) {
        console.error('❌ Error crítico en el scraping:', error.message);
        res.status(500).json({ error: 'Error al cargar noticias' });
    }
});

// Rutas de Base de Datos (se mantienen igual)
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