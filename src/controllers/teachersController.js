import { supabase } from '../services/supabaseClient.js'

export const getTeachers = async (req, res) => {
  const { school_id } = req.admin
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', school_id)

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const createTeacher = async (req, res) => {
  const { school_id } = req.admin
  const teacher = req.body
  try {
    const { data, error } = await supabase
      .from('teachers')
      .insert([{ ...teacher, school_id }])
      .select()
    if (error) throw error
    res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// updateTeacher & deleteTeacher similar...
