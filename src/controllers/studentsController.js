// controllers/studentsController.js
import { supabase } from '../services/supabaseClient.js';

export const getStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', req.admin.school_id);

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
