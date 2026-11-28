import express from 'express';
import { pool } from '../db.js';
import { verificarToken } from '../middlewares/authMiddleware.js'; // <-- IMPORT CORRECTO

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cursos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', 
    verificarToken, 
    // --- INICIO DE VALIDACIONES ---
    body('titulo').trim().escape().notEmpty().withMessage('El título es obligatorio'),
    body('descripcion').trim().escape(),
    body('duracion').trim().escape(),
    body('carrera').trim().escape(),
    body('imagen_url').trim().isURL().optional({ checkFalsy: true }).withMessage('URL de imagen inválida'),
    body('link_curso').trim().isURL().optional({ checkFalsy: true }).withMessage('URL de curso inválida'),
    validarCampos,
    async (req, res) => {
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
    }
);

router.put('/:id', verificarToken, async (req, res) => {
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

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM cursos WHERE id=?', [req.params.id]);
        res.json({ mensaje: 'Curso eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;