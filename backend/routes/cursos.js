import express from 'express';
import { pool } from '../db.js';
import { verificarToken, soloAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. GET - Todos los cursos (Público)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET - Un curso por ID (Público)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. POST - Guardar nuevo curso (SOLO ADMIN)
router.post('/', verificarToken, soloAdmin, async (req, res) => {
    try {
        const { titulo, descripcion, duracion, carrera, imagen_url } = req.body;
        if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

        const [result] = await pool.query(
            'INSERT INTO cursos (titulo, descripcion, duracion, carrera, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion, duracion, carrera, imagen_url]
        );

        res.status(201).json({ message: 'Curso agregado correctamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. DELETE - Eliminar curso (SOLO ADMIN)
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM cursos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Curso eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;