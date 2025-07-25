// seedClasses.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const school_id = 'bcc4a348-5f51-4c2b-bba4-7cc16a7fd604';

const levels = ['JSS', 'SSS'];
const classes = [];

levels.forEach((level) => {
  for (let i = 1; i <= 3; i++) {
    const name = `${level}${i}`;
    classes.push({
      name,
      level,
      section: 'A',
      class_code: `${name}A`,
      capacity: 40,
      description: `This is ${name} class section A for ${level === 'JSS' ? 'Junior' : 'Senior'} Secondary.`,
      status: 'active',
      school_id,
      teacher_id: null, // You can assign real teacher_id from teachers table if you prefer
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
});

const seedClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .insert(classes)
      .select();

    if (error) throw error;

    console.log(`✅ Seeded ${data.length} classes successfully.`);
  } catch (err) {
    console.error('🔥 Failed to seed classes:', err.message);
  }
};

const { data: teachers } = await supabase
  .from('teachers')
  .select('id')
  .eq('school_id', school_id);

const randomTeacherId = () => {
  if (!teachers || teachers.length === 0) return null;
  return teachers[Math.floor(Math.random() * teachers.length)].id;
};

// Then inside loop:
teacher_id: randomTeacherId(),


seedClasses();
