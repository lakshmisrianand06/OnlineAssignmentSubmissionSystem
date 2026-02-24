const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        console.log('Registration Request Body:', req.body);
        const { name, email, password, role } = req.body;

        // Check if user exists
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .limit(1);

        if (checkError) {
            console.error('Check user error:', checkError);
            throw new Error(checkError.message);
        }

        if (existingUsers && existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: userData, error: insertError } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, role }])
            .select();

        if (insertError) {
            console.error('Insert user error detail:', insertError);
            throw new Error(insertError.message);
        }

        if (!userData || userData.length === 0) {
            console.error('Insert succeeded but no data returned. Check Supabase RLS policies.');
            throw new Error('User created but could not retrieve data. Please check database permissions.');
        }

        const newUser = userData[0];

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
