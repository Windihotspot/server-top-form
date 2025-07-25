// updateStudentGenders.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const updateStudentGenders = async () => {
  const { data: students, error } = await supabase
    .from('students')
    .select('id, full_name') // ✅ include full_name to avoid null

  if (error) {
    console.error('❌ Failed to fetch students:', error.message)
    return
  }

  const updatedStudents = students.map((student) => ({
    id: student.id,
    full_name: student.full_name, // preserve
    gender: Math.random() < 0.5 ? 'Male' : 'Female',
  }))

  const { error: updateError } = await supabase
    .from('students')
    .upsert(updatedStudents, { onConflict: 'id' })

  if (updateError) {
    console.error('❌ Error updating genders:', updateError.message)
    return
  }

  console.log(`✅ Updated genders for ${updatedStudents.length} students.`)
}

updateStudentGenders()
