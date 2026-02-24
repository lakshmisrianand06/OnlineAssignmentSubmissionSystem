const supabase = require('../config/supabaseClient');

exports.submitAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.body;
        const student_id = req.user.id;
        const file_url = req.file ? req.file.path : null;

        if (!file_url) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { data, error } = await supabase
            .from('submissions')
            .insert([{ assignment_id, student_id, file_url }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Assignment submitted successfully', submission: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.params;

        const { data, error } = await supabase
            .from('submissions')
            .select('*, users(name, email)')
            .eq('assignment_id', assignment_id);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
