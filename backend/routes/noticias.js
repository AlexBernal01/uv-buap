import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

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
        if (rows.length === 0) return res.status(404).json({ error: 'Noticia no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { titulo, fecha, contenido, imagen, imagen_url } = req.body;
        const [result] = await pool.query(
            'INSERT INTO noticias (titulo, fecha, contenido, imagen, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [titulo, fecha, contenido, imagen, imagen_url]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;