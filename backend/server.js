import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db.js';
import authRoutes from './routes/auth.js';
import noticiasRoutes from './routes/noticias.js';
import productosRoutes from './routes/productos.js';
import pilaresRoutes from './routes/pilares.js';
import cursosRoutes from './routes/cursos.js';
import statsRoutes from './routes/stats.js';
import visitasRoutes from './routes/visitas.js';
import helmet from 'helmet';

dotenv.config();

const app = express();


const corsOptions = {
    origin: function (origin, callback) {
        
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


app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pilares', pilaresRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/visitas', visitasRoutes);
app.use(helmet());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API UVIE funcionando' });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    await testConnection();
});