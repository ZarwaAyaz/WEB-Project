const User = require('../../models/User');

// GET /api/v1/user/profile  (protected — verifyToken applied in route)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error('API user profile error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
