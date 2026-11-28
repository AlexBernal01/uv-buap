import express from 'express';
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { pool } from '../db.js';

const router = express.Router();

const scrapeBoletinBUAP = async () => {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const noticias = [];
    
    try {
        const { data } = await axios.get('https://boletin.buap.mx/boletines', { 
            httpsAgent: agent, 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });
        
        const $ = cheerio.load(data);
        const enlacesNotas = new Set();
        
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('/node/') || href.includes('?q=node/'))) {
                const urlCompleta = href.startsWith('http') ? href : `https://boletin.buap.mx${href.startsWith('/') ? '' : '/'}${href}`;
                enlacesNotas.add(urlCompleta);
            }
        });

        const promesas = Array.from(enlacesNotas).slice(0, 20).map(async (url) => {
            try {
                const { data: notaHtml } = await axios.get(url, { 
                    httpsAgent: agent, 
                    headers: { 'User-Agent': 'Mozilla/5.0' }, 
                    timeout: 5000 
                });
                
                const $nota = cheerio.load(notaHtml);
                
                const titulo = $nota('h1').first().text().trim() || $nota('title').text().trim();
                const fechaTexto = $nota('.date, .field--name-created, time').first().text().trim();
                const descripcion = $nota('meta[name="description"]').attr('content') || '';
                
                let imagen = $nota('meta[property="og:image"]').attr('content');
                if (!imagen) imagen = $nota('meta[name="twitter:image"]').attr('content');
                if (!imagen) imagen = $nota('.field--name-field-image img, article img').first().attr('src');
                
                if (imagen && imagen.startsWith('/')) {
                    imagen = `https://boletin.buap.mx${imagen}`;
                }

                const textoFiltro = `${titulo} ${descripcion}`.toLowerCase();
                const palabrasIA = ['inteligencia artificial', 'ia ', ' ia', 'ia,', 'ia.', 'aura', 'algoritmo', 'algorítmic', 'machine learning', 'deep learning', 'chatbot', 'dcytic', 'supercómputo', 'ética algorítmica'];
                const esIA = palabrasIA.some(p => textoFiltro.includes(p));

                if (titulo && esIA) {
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
        const noticias = await scrapeBoletinBUAP();
        
        let noticiasUnicas = Array.from(new Map(noticias.map(n => [n.enlace, n])).values());

        res.json({ data: noticiasUnicas });
    } catch (error) {
        console.error('Error crítico:', error.message);
        res.status(500).json({ error: 'Error al cargar noticias' });
    }
});

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