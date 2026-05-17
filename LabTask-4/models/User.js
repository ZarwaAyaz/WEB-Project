const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// User Schema — stores customer and admin accounts
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,       // no two users can have the same email
        lowercase: true,    // always store in lowercase
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6        // enforced before hashing
    },

    // role controls access: "customer" can browse, "admin" can access /admin
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }

}, { timestamps: true });

// --- Pre-save hook: hash the password before storing ---
// This runs automatically whenever a new user is saved or password is changed
// In Mongoose 9, async pre hooks do NOT use next() — just return a Promise
userSchema.pre('save', async function () {
    // Only hash if the password field was actually changed
    if (!this.isModified('password')) return;

    // bcrypt salt rounds = 10 (good balance of security and speed)
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
