import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

router.get('/tech', async (req, res) => {
    try {
        const boletinUrl = 'https://boletin.buap.mx/inicio'; 
        const agent = new https.Agent({ rejectUnauthorized: false });

        const response = await axios.get(boletinUrl, { 
            httpsAgent: agent,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const html = response.data;
        const $ = cheerio.load(html);

        const noticias = [];
        const palabrasClave = ['inteligencia artificial', 'ia', 'tecnolog', 'software', 'digital', 'cómputo', 'datos', 'innovación', 'robot', 'algoritmo', 'ciencia'];
        let urlsVisitadas = new Set();

        const enlaces = $('a').map((i, el) => {
            const titulo = $(el).text().trim();
            const href = $(el).attr('href');
            return { titulo, href };
        }).get();

        const enlacesTech = enlaces.filter(item => {
            if (!item.href || !item.titulo || item.titulo.length < 20) return false;
            if (!item.href.includes('/node/')) return false;
            const textoLower = item.titulo.toLowerCase();
            return palabrasClave.some(p => textoLower.includes(p));
        });

        const enlacesFinales = enlacesTech.slice(0, 8);

        for (const item of enlacesFinales) {
            let enlaceCompleto = item.href.startsWith('/') ? `https://boletin.buap.mx${item.href}` : item.href;
            
            if (urlsVisitadas.has(enlaceCompleto)) continue;
            urlsVisitadas.add(enlaceCompleto);

            let imagenReal = null;
            let resumen = "Haz clic para leer la nota completa en el Boletín BUAP.";

            try {
                const notaResponse = await axios.get(enlaceCompleto, { 
                    httpsAgent: agent, 
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    timeout: 5000 
                });
                const $nota = cheerio.load(notaResponse.data);

                // Buscar la imagen principal del artículo (usualmente está dentro del campo body o content)
                let imagenEncontrada = $nota('.field--name-body img, .node__content img, article img').first().attr('src');
                
                // Si no está ahí, buscar en el meta og:image
                if (!imagenEncontrada) {
                    imagenEncontrada = $nota('meta[property="og:image"]').attr('content');
                }

                // Limpiamos la URL de la imagen
                if (imagenEncontrada) {
                    if (imagenEncontrada.startsWith('/')) {
                        imagenReal = `https://boletin.buap.mx${imagenEncontrada}`;
                    } else if (!imagenEncontrada.startsWith('http')) {
                        imagenReal = `https://boletin.buap.mx/${imagenEncontrada}`;
                    } else {
                        imagenReal = imagenEncontrada;
                    }
                }

                const primerParrafo = $nota('p').filter((i, el) => $(el).text().trim().length > 50).first().text().trim();
                if (primerParrafo) {
                    resumen = primerParrafo.substring(0, 160) + '...';
                }

            } catch (err) {
                console.log(`No se pudo entrar a la nota: ${enlaceCompleto}`);
            }

            noticias.push({
                titulo: item.titulo,
                enlace: enlaceCompleto,
                fecha: 'Reciente',
                descripcion: resumen,
                imagen: imagenReal || `https://picsum.photos/seed/${encodeURIComponent(item.titulo.substring(0,10))}/800/400`
            });
        }

        res.json({ data: noticias });

    } catch (error) {
        console.error('❌ Error en scraping del Boletín:', error.message);
        res.status(500).json({ error: 'No se pudieron cargar las noticias del Boletín' });
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