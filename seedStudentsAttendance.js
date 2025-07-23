// seedStudentsAttendance.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604";

// Valid status options from your constraint
const statusOptions = ["Present", "Absent", "Late"];
const getRandomStatus = () =>
  statusOptions[Math.floor(Math.random() * statusOptions.length)];

const generateMockStudents = (count = 100) => {
  return Array.from({ length: count }).map(() => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    return {
      school_id,

      full_name: fullName,
      gender: gender === "male" ? "Male" : "Female",
      date_of_birth: faker.date
        .birthdate({ min: 10, max: 18, mode: "age" })
        .toISOString()
        .split("T")[0],
      address: faker.location.streetAddress(),
      phone: faker.phone.number("080# ### ####"),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    };
  });
};

const seedStudentsAndAttendance = async () => {
  const students = generateMockStudents();

  // Step 1: Insert students
  const { data: insertedStudents, error: studentError } = await supabase
    .from("students")
    .insert(students)
    .select();

  if (studentError) {
    console.error("❌ Error inserting students:", studentError.message);
    return;
  }

  console.log(`✅ Inserted ${insertedStudents.length} students.`);

  // Step 2: Generate attendance per student
  const attendanceRecords = [];

  for (const student of insertedStudents) {
    for (let day = 1; day <= 15; day++) {
      const date = `2025-07-${String(day).padStart(2, "0")}`;

      attendanceRecords.push({
        student_id: student.id,
        school_id,
        date,
        status: getRandomStatus(),
      });
    }
  }

  // Step 3: Insert attendance
  const { error: attendanceError } = await supabase
    .from("attendance")
    .insert(attendanceRecords);

  if (attendanceError) {
    console.error("❌ Error inserting attendance:", attendanceError.message);
    return;
  }

  console.log(`✅ Inserted ${attendanceRecords.length} attendance records.`);
};

seedStudentsAndAttendance();
