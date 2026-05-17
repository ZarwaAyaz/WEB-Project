// Simple Admin Authentication Middleware
// -------------------------------------------
// This is a lightweight session-based admin guard.
// The admin "logs in" by visiting /admin/login and submitting the password.
// We use a plain cookie (signed) to remember the session — no JWT, no bcrypt.
// This is intentionally simple for a university assignment.

const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

// Middleware: checks if the admin is logged in
function isAdminLoggedIn(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next(); // Admin is authenticated — proceed
    }
    // Not logged in — redirect to login page
    res.redirect('/admin/login');
}

module.exports = { isAdminLoggedIn, ADMIN_PASSWORD };
