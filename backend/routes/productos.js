import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos ORDER BY id ASC');
      
        const productos = rows.map(row => ({
            ...row,
            entregables: typeof row.entregables === 'string' 
                ? JSON.parse(row.entregables) 
                : row.entregables
        }));
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        
        const producto = {
            ...rows[0],
            entregables: typeof rows[0].entregables === 'string' 
                ? JSON.parse(rows[0].entregables) 
                : rows[0].entregables
        };
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;