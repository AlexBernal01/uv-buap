import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

const scrapeBoletinBusqueda = async () => {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const noticias = [];
    
    try {
        // 1. Buscamos directamente en el Boletín usando su buscador
        const busquedaUrl = 'https://boletin.buap.mx/boletines?search_api_fulltext=inteligencia+artificial';
        
        const { data } = await axios.get(busquedaUrl, { 
            httpsAgent: agent, 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });
        
        const $ = cheerio.load(data);
        const enlacesNotas = new Set();
        
        // 2. Extraemos los enlaces de los resultados de la búsqueda
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            // El boletín usa /node/ o /?q=node/ para sus notas
            if (href && (href.includes('/node/') || href.includes('?q=node/'))) {
                const urlCompleta = href.startsWith('http') ? href : `https://boletin.buap.mx${href.startsWith('/') ? '' : '/'}${href}`;
                enlacesNotas.add(urlCompleta);
            }
        });

        // 3. Entramos a cada nota (máx 10 para no saturar) para sacar título, fecha e imagen
        const promesas = Array.from(enlacesNotas).slice(0, 10).map(async (url) => {
            try {
                const { data: notaHtml } = await axios.get(url, { 
                    httpsAgent: agent, 
                    headers: { 'User-Agent': 'Mozilla/5.0' }, 
                    timeout: 5000 
                });
                
                const $nota = cheerio.load(notaHtml);
                
                // Título y fecha
                const titulo = $nota('h1').first().text().trim() || $nota('title').text().trim();
                const fechaTexto = $nota('.date, .field--name-created, time').first().text().trim();
                const descripcion = $nota('meta[name="description"]').attr('content') || '';
                
                // Imagen (og:image es la más confiable)
                let imagen = $nota('meta[property="og:image"]').attr('content');
                if (!imagen) imagen = $nota('meta[name="twitter:image"]').attr('content');
                if (!imagen) imagen = $nota('.field--name-field-image img, article img').first().attr('src');
                
                if (imagen && imagen.startsWith('/')) {
                    imagen = `https://boletin.buap.mx${imagen}`;
                }

                if (titulo && url) {
                    return {
                        titulo,
                        enlace: url,
                        fecha: fechaTexto || 'Reciente',
                        descripcion: descripcion.substring(0, 160) + '...',
                        imagen: imagen || null
                    };
                }
                return null;
            } catch (e) {
                return null;
            }
        });

        const resultados = await Promise.all(promesas);
        return resultados.filter(n => n !== null);
        
    } catch (e) {
        console.log("Error scraping Boletín BUAP:", e.message);
        return [];
    }
};

router.get('/tech', async (req, res) => {
    try {
        const noticias = await scrapeBoletinBusqueda();
        
        // Quitamos duplicados por si el mismo enlace aparece dos veces
        let noticiasUnicas = Array.from(new Map(noticias.map(n => [n.enlace, n])).values());

        res.json({ data: noticiasUnicas });
    } catch (error) {
        console.error('Error crítico:', error.message);
        res.status(500).json({ error: 'Error al cargar noticias' });
    }
});

// Tus otras rutas (GET /, GET /:id, POST /) se quedan igual
router.get('/', async (req, res) => {
    try { 
        const [rows] = await pool.query('SELECT * FROM noticias ORDER BY fecha DESC'); 
        res.json(rows); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

router.get('/:id', async (req, res) => {
    try { 
        const [rows] = await pool.query('SELECT * FROM noticias WHERE id = ?', [req.params.id]); 
        if (rows.length === 0) return res.status(404).json({ error: 'No encontrada' }); 
        res.json(rows[0]); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

router.post('/', async (req, res) => {
    try { 
        const { titulo, fecha, contenido, imagen, imagen_url } = req.body; 
        const [result] = await pool.query('INSERT INTO noticias (titulo, fecha, contenido, imagen, imagen_url) VALUES (?, ?, ?, ?, ?)', [titulo, fecha, contenido, imagen, imagen_url]); 
        res.status(201).json({ id: result.insertId }); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

export default router;