import { supabase } from '../services/supabaseClient.js'

export const getNotifications = async (req, res) => {
  const { school_id } = req.admin

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('school_id', school_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
