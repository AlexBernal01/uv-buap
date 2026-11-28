import express from 'express';
import axios from 'axios';
import { pool } from '../db.js';

const router = express.Router();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const obtenerNoticiasIA = async () => {
    try {
       
        const query = 'inteligencia artificial';
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=es&max=10&apikey=${GNEWS_API_KEY}`;
        
        const { data } = await axios.get(url);
        
        if (!data.articles) return [];
        
        return data.articles.map(articulo => ({
            titulo: articulo.title,
            enlace: articulo.url,
            fecha: new Date(articulo.publishedAt).toLocaleDateString('es-MX', { 
                day: 'numeric', month: 'long', year: 'numeric' 
            }),
            descripcion: articulo.description || 'Da clic para leer la nota completa.',
            imagen: articulo.image || null
        }));
    } catch (error) {
        console.error('Error GNews:', error.message);
        return [];
    }
};

router.get('/tech', async (req, res) => {
    try {
        const noticias = await obtenerNoticiasIA();
        res.json({ data: noticias });
    } catch (error) {
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