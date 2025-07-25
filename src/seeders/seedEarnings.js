// seedEarnings.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const school_id = 'bcc4a348-5f51-4c2b-bba4-7cc16a7fd604'


const generateMockEarnings = () => {
  const earnings = []

  for (let day = 1; day <= 31; day++) {
    const date = `2025-07-${String(day).padStart(2, '0')}`

    // Random between 10000 - 50000 for received, 0 - 20000 for pending
    const received = Math.floor(Math.random() * 40000 + 10000)
    const pending = Math.floor(Math.random() * 20000)

    earnings.push({
      school_id,
      
      date,
      received_amount: received,
      pending_amount: pending
    })
  }

  return earnings
}

const seedEarnings = async () => {
  const earnings = generateMockEarnings()

 const { data, error } = await supabase.from('earnings').insert(earnings)

if (error) {
  console.error('❌ Error seeding earnings:', error.message)
  return
}

console.log(`✅ Seeded ${data?.length || 0} earnings rows.`)

}

seedEarnings()
