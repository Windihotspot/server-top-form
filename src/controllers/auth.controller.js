import jwt from 'jsonwebtoken'
import { supabase } from '../services/supabaseClient.js'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email & Password are required" });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!authData.user.email_confirmed_at) {
      return res.status(403).json({ success: false, message: "Email not confirmed yet." });
    }

    if (authError) throw authError;

    // Fetch Admin Profile with School ID
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id, school_id, fullname, role')
      .eq('user_id', authData.user.id)
      .single();

    if (adminError) throw adminError;

    // Sign JWT with admin and school info
    const token = jwt.sign(
      {
        admin_id: adminData.id,
        school_id: adminData.school_id,
        role: adminData.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: authData.user,
        admin: adminData,
        token
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};
