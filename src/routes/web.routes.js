import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', (req, res) => res.render('signIn'));
router.get('/signUp', (req, res) => res.render('signUp'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/admin', (req, res) => res.render('admin'));
router.get('/profile', (req, res) => res.render('profile'));
router.get('/403', (req, res) => res.status(403).render('403'));

export default router;