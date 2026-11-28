import { pool } from './db.js'; 

app.get('/api/stats', async (req, res) => {
    try {
        const [cursos] = await pool.query('SELECT COUNT(*) as count FROM cursos');
        const [productos] = await pool.query('SELECT COUNT(*) as count FROM productos');
        const [pilares] = await pool.query('SELECT COUNT(*) as count FROM pilares');
        const [noticias] = await pool.query('SELECT COUNT(*) as count FROM noticias');
        
        res.json({
            cursos: cursos[0].count,
            productos: productos[0].count,
            pilares: pilares[0].count,
            noticias: noticias[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});