import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db.js';
import authRoutes from './routes/auth.js';
import noticiasRoutes from './routes/noticias.js';
import productosRoutes from './routes/productos.js';
import pilaresRoutes from './routes/pilares.js';
import cursosRoutes from './routes/cursos.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pilares', pilaresRoutes);
app.use('/api/cursos', cursosRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API UVIE funcionando' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    await testConnection();
});