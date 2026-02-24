const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Root Route
app.get('/', (req, res) => {
    res.send('Online Assignment Submission System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Verify Supabase Connection
    const supabase = require('./config/supabaseClient');
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('❌ Supabase connection failed:', error.message);
    } else {
        console.log('✅ Supabase connection verified successfully!');
    }
});
