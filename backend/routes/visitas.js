import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { pagina } = req.body;
        await pool.query('INSERT INTO visitas (pagina) VALUES (?)', [pagina]);
        res.status(201).json({ mensaje: 'Visita registrada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
  
        const [total] = await pool.query('SELECT COUNT(*) as total FROM visitas');
    
        const [hoy] = await pool.query('SELECT COUNT(*) as hoy FROM visitas WHERE DATE(fecha) = CURDATE()');
        
    
        const [porPagina] = await pool.query(`
            SELECT pagina, COUNT(*) as visitas 
            FROM visitas 
            GROUP BY pagina 
            ORDER BY visitas DESC 
            LIMIT 5
        `);

        res.json({
            total: total[0].total,
            hoy: hoy[0].hoy,
            porPagina: porPagina
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;