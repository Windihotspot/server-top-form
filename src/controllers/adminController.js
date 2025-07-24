import { supabase } from "../services/supabaseClient.js";

// Get logged-in admin profile

export const getMyProfile = async (req, res) => {
  const { admin_id } = req.admin; // set from JWT middleware
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("id", admin_id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update logged-in admin profile
export const updateMyProfile = async (req, res) => {
  try {
    const updates = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      avatar_url: req.body.avatar_url,
      timezone: req.body.timezone,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("admins")
      .update(updates)
      .eq("user_id", req.admin)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// List all admins for the same school (super admin or school owner)
export const getSchoolAdmins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("school_id", req.admin.school_id);

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
