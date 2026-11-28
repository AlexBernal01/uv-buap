import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'; // <-- NUEVO IMPORT
import { testConnection } from './db.js';
import authRoutes from './routes/auth.js';
import noticiasRoutes from './routes/noticias.js';
import productosRoutes from './routes/productos.js';
import pilaresRoutes from './routes/pilares.js';
import cursosRoutes from './routes/cursos.js';

dotenv.config();

const app = express();


const corsOptions = {
    origin: ['https://uv-buap.vercel.app', 'http://localhost:5174'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.' }
});

app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pilares', pilaresRoutes);
app.use('/api/cursos', cursosRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API UVIE funcionando' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    await testConnection();
});