const bcrypt = require('bcryptjs');
const User   = require('../models/User');

// GET /register
exports.showRegister = (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register');
};

// POST /register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters long.');
            return res.redirect('/register');
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            req.flash('error', 'An account with this email already exists.');
            return res.redirect('/register');
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        req.flash('success', 'Account created successfully! Please log in.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/register');
    }
};

// GET /login
exports.showLogin = (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login');
};

// POST /login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'Please enter your email and password.');
            return res.redirect('/login');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            id:    user._id,
            name:  user.name,
            email: user.email,
            role:  user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);

        if (user.role === 'admin') return res.redirect('/admin');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/login');
    }
};

// GET /logout
exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};

// GET /profile
exports.profile = (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Please login first.');
        return res.redirect('/login');
    }
    res.render('auth/profile');
};
