import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', (req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

app.use('/', webRoutes);

app.use((req, res) => res.status(404).render('404'));

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.name === 'ValidationError' ? 400 : err.status || 500;
    res.status(status).json({ message: err.message || 'Error interno del servidor' });
});

export default app;