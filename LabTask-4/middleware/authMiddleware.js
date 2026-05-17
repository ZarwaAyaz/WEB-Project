// ====================================================
// Authentication & Authorization Middleware
// ====================================================

// --- isLoggedIn ---
// Protects routes that require a logged-in user (any role)
// Usage: router.get('/checkout', isLoggedIn, ...)
function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // User is logged in — proceed
    }
    // Not logged in — show message and redirect to login
    req.flash('error', 'Please login first to continue.');
    res.redirect('/login');
}

// --- isAdmin ---
// Protects routes that only admins can access
// Usage: router.get('/admin', isAdmin, ...)
function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next(); // Admin confirmed — proceed
    }
    // Either not logged in, or not an admin
    req.flash('error', 'Access denied. Admins only.');
    res.redirect('/');
}

module.exports = { isLoggedIn, isAdmin };
