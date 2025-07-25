import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// List your seeded admins here
const seededAdmins = [
  { full_name: 'Windi Hotspot', email: 'admin@wonderland.com', password: 'password123' },
  { full_name: 'Dream Admin', email: 'admin@dreamland.com', password: 'password123' }
]

const syncAdmins = async () => {
  for (const admin of seededAdmins) {
    try {
      // Create Auth User
      const { data: userData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true
      })

      if (authError) throw authError

      console.log(`✅ Auth user created for ${admin.email}: ${userData.user.id}`)

      // Update admins table with user_id
      const { error: updateError } = await supabase
        .from('admins')
        .update({ user_id: userData.user.id })
        .eq('email', admin.email)

      if (updateError) throw updateError

      console.log(`✅ Admin record updated for ${admin.email}`)
    } catch (err) {
      console.error(`❌ Error for ${admin.email}:`, err.message)
    }
  }
}

syncAdmins()
