import express from 'express';
import { pool } from '../db.js';
import { verificarToken } from '../middlewares/authMiddleware.js'; // <-- IMPORT CORRECTO

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', verificarToken, async (req, res) => {
    try {
        const { titulo, descripcion, imagen_url, precio } = req.body;
        await pool.query(
            'INSERT INTO productos (titulo, descripcion, imagen_url, precio) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, imagen_url, precio]
        );
        res.json({ mensaje: 'Producto creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, imagen_url, precio } = req.body;
        await pool.query(
            'UPDATE productos SET titulo=?, descripcion=?, imagen_url=?, precio=? WHERE id=?',
            [titulo, descripcion, imagen_url, precio, id]
        );
        res.json({ mensaje: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM productos WHERE id=?', [req.params.id]);
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;