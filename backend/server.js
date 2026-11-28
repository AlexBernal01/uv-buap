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


const corsOptions = {
    origin: function (origin, callback) {
        // Permite peticiones sin origen (como Postman) o que terminen en .vercel.app o incluyan localhost
        if (!origin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

/*
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos. Intenta más tarde.' }
});
app.use('/api/auth/login', loginLimiter);
*/

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pilares', pilaresRoutes);
app.use('/api/cursos', cursosRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API UVIE funcionando' });
});

// Usar el puerto 4000 por defecto (Render usará el suyo automáticamente)
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    await testConnection();
});