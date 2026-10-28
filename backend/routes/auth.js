import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, nombre } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO usuarios (email, password_hash, nombre) VALUES (?, ?, ?)',
            [email, hash, nombre]
        );
        res.status(201).json({ id: result.insertId, email, nombre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

        const usuario = rows[0];
        const valido = await bcrypt.compare(password, usuario.password_hash);
        if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
