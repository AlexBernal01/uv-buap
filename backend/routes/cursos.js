import express from 'express';
import { pool } from '../db.js';
import { verifyToken } from '../middlewares/auth.js'; // Asumo que tienes protección

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion, duracion, carrera, imagen_url, link_curso } = req.body;
        await pool.query(
            'INSERT INTO cursos (titulo, descripcion, duracion, carrera, imagen_url, link_curso) VALUES (?, ?, ?, ?, ?, ?)',
            [titulo, descripcion, duracion, carrera, imagen_url, link_curso]
        );
        res.json({ mensaje: 'Curso creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, duracion, carrera, imagen_url, link_curso } = req.body;
        await pool.query(
            'UPDATE cursos SET titulo=?, descripcion=?, duracion=?, carrera=?, imagen_url=?, link_curso=? WHERE id=?',
            [titulo, descripcion, duracion, carrera, imagen_url, link_curso, id]
        );
        res.json({ mensaje: 'Curso actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM cursos WHERE id=?', [req.params.id]);
        res.json({ mensaje: 'Curso eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;