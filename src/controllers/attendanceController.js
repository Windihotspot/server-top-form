// src/controllers/attendanceController.js
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

// 🆕 Aggregated summary by day for charts
export const getAttendanceSummaryByDay = async (req, res) => {
  const { school_id } = req.admin
  const { month, year } = req.query

  if (!month || !year) {
    return res.status(400).json({
      success: false,
      message: 'Month and year are required as query parameters',
    })
  }

  try {
    const { data, error } = await supabase.rpc(
      'get_attendance_summary_by_day',
      {
        input_school_id: school_id,
        input_month: parseInt(month),
        input_year: parseInt(year),
      }
    )

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
