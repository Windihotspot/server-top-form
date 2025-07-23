import { supabase } from '../services/supabaseClient.js'

// Get all earnings for a school
export const getEarnings = async (req, res) => {
  const { school_id } = req.admin

  try {
    const { data, error } = await supabase
      .from('earnings')
      .select('*')
      .eq('school_id', school_id)
      .order('date', { ascending: true })

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get earnings grouped by day for a specific month/year
export const getEarningsByMonth = async (req, res) => {
  const { school_id } = req.admin
  const { month, year } = req.query

  if (!month || !year) {
    return res.status(400).json({ success: false, message: 'Month and year are required.' })
  }

  try {
    const { data, error } = await supabase.rpc('get_earnings_by_day', {
      input_school_id: school_id,
      input_month: parseInt(month),
      input_year: parseInt(year),
    })

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getEarningsSummaryByDay = async (req, res) => {
  const { school_id } = req.admin
  const { month, year } = req.query

  if (!month || !year) {
    return res.status(400).json({ success: false, message: 'Month and year are required' })
  }

  try {
    const { data, error } = await supabase.rpc('get_earnings_by_day', {
      input_school_id: school_id,
      input_month: parseInt(month),
      input_year: parseInt(year),
    })

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
