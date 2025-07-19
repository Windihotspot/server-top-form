import { supabase } from '../services/supabaseClient.js'

export const getAttendance = async (req, res) => {
  const { school_id } = req.admin
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, students(full_name)')
      .eq('school_id', school_id)

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
