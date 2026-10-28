import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/carrera/:carrera', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos WHERE carrera = ? ORDER BY id ASC', [req.params.carrera]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;