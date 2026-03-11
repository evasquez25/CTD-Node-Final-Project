const User = require('../models/User');

const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validate input
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
            });
        }

        // Create user (password will be hashed by pre-save middleware)
        const user = await User.create({ username, email, password });
        
        // Generate JWT token
        const token = user.createJWT();
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = user.createJWT();
        
        res.json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

const logoutUser = (req, res) => {
    // For JWT-only auth, logout is handled client-side by removing token
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};