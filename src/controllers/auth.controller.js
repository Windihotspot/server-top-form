import { supabase } from "../services/supabaseClient.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email & Password are required" });
  }

  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (!authData.user.email_confirmed_at) {
      return res
        .status(403)
        .json({ success: false, message: "Email not confirmed yet." });
    }

    if (authError) throw authError;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: authData.user,
        session: authData.session,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};
