const jwt = require('jsonwebtoken');

// ====================================================
// verifyToken Middleware — JWT Authentication
// ====================================================
// Protects API routes that require a logged-in user.
// Usage: router.get('/profile', verifyToken, handler)
//
// How it works:
// 1. Reads the "Authorization" header from the request
// 2. Expects format: "Bearer YOUR_TOKEN_HERE"
// 3. Verifies the token using JWT_SECRET from .env
// 4. If valid, attaches decoded user data to req.user
// 5. If missing or invalid, returns 401 or 403 JSON error
// ====================================================

function verifyToken(req, res, next) {
    // Step 1: Read the Authorization header
    const authHeader = req.headers['authorization'];

    // Step 2: Check the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Use: Authorization: Bearer <token>'
        });
    }

    // Step 3: Extract the token (everything after "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Step 4: Verify the token using the secret key
        // jwt.verify throws an error if the token is invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 5: Attach the decoded payload to req.user
        // decoded contains: { user_id, role, iat, exp }
        req.user = decoded;

        next(); // Token is valid — proceed to the route handler
    } catch (err) {
        // Token is invalid or expired
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
}

module.exports = verifyToken;
