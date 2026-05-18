/**
 * createAdmin.js
 * -------------------------------------------------------
 * One-time script to create an admin account.
 *
 * Usage:
 *   node scripts/createAdmin.js
 *
 * This creates a user with role = "admin" in MongoDB.
 * Run this ONCE, then use that email/password to log in at /login.
 */

const mongoose = require('mongoose');
const User     = require('../models/User');

const MONGO_URI = 'mongodb://localhost:27017/honey-accessories';

// --- Admin credentials (change as needed) ---
const ADMIN_NAME     = 'Admin';
const ADMIN_EMAIL    = 'admin@honey.com';
const ADMIN_PASSWORD = 'admin123';  // must be 6+ characters

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`Admin already exists: ${ADMIN_EMAIL}`);
            process.exit(0);
        }

        // Create admin user
        // Password is automatically hashed by the pre-save hook in User model
        const admin = new User({
            name:     ADMIN_NAME,
            email:    ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role:     'admin'         // <-- this grants admin access
        });

        await admin.save();
        console.log('✅ Admin account created successfully!');
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log('   Visit /login to log in as admin.');

    } catch (err) {
        console.error('Error creating admin:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdmin();
