import { supabase } from "../services/supabaseClient.js";

export const createOnboarding = async (req, res) => {
  const { school, admin } = req.body

  if (!school?.name || !school?.address || !school?.city || !school?.state || !admin?.email || !admin?.password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' })
  }

  try {
    // Step 1: Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: admin.email,
      password: admin.password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`  // Where Supabase redirects after confirmation
      }
    })

    if (authError) throw authError

    // Step 2: Insert school
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .insert([{
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        contact: school.contact,
        type: school.type
      }])
      .select()

    if (schoolError) throw schoolError

    const schoolId = schoolData[0].id

    // Step 3: Insert admin profile linked with Supabase Auth user id
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert([{
        fullname: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role || 'Owner/Admin',
        school_id: schoolId,
        user_id: authData.user.id // Store Supabase Auth User ID
      }])
      .select()

    if (adminError) throw adminError

    return res.status(201).json({
      success: true,
      message: 'Onboarding completed. Please check your email to confirm your account.',
      data: {
        user: authData.user,
        school: schoolData[0],
        admin: adminData[0]
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}
