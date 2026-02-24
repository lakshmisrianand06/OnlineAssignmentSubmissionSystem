const supabase = require('../config/supabaseClient');

exports.createAssignment = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const teacherId = req.user.id;

        const { data, error } = await supabase
            .from('assignments')
            .insert([{ title, description, deadline, created_by: teacherId }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Assignment created successfully', assignment: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllAssignments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
