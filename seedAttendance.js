import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

faker.locale = "en";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604";

const statusOptions = ["Present", "Absent", "Late"];
const sourceOptions = ["Manual", "Biometric", "Mobile", "Web"];

const getRandomStatus = () => faker.helpers.arrayElement(statusOptions);
const getRandomSource = () => faker.helpers.arrayElement(sourceOptions);
const getRandomCheckInTime = (date) => {
  const from = new Date(`${date}T07:30:00`);
  const to = new Date(`${date}T09:30:00`);
  return faker.date.between({ from, to }).toISOString();
};

const getAbsenceReason = () =>
  faker.helpers.arrayElement([
    "Sick",
    "Personal leave",
    "Family emergency",
    "Weather",
    "Other reason",
  ]);

const seedAttendanceOnly = async () => {
  // Fetch existing users
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("id");

  const { data: teachers, error: teacherError } = await supabase
    .from("teachers")
    .select("id");

  const { data: employees, error: employeeError } = await supabase
    .from("employees")
    .select("id");

  if (studentError || teacherError || employeeError) {
    console.error("❌ Error fetching users:", {
      studentError,
      teacherError,
      employeeError,
    });
    return;
  }

  const attendanceRecords = [];

  const generateAttendanceFor = (users, user_type) => {
    for (const user of users) {
      for (let day = 1; day <= 15; day++) {
        const date = `2025-07-${String(day).padStart(2, "0")}`;
        const status = getRandomStatus();

        attendanceRecords.push({
          school_id,
          user_id: user.id,
          user_type,
          date,
          status,
          check_in_time:
            status === "Present" || status === "Late"
              ? getRandomCheckInTime(date)
              : null,
          absence_reason: status === "Absent" ? getAbsenceReason() : null,
          source: getRandomSource(),
        });
      }
    }
  };

  generateAttendanceFor(students, "student");
  generateAttendanceFor(teachers, "teacher");
  generateAttendanceFor(employees, "employee");

  const { error: attendanceError } = await supabase
    .from("attendance")
    .insert(attendanceRecords);

  if (attendanceError) {
    console.error("❌ Error inserting attendance:", attendanceError.message);
    return;
  }

  console.log(`✅ Inserted ${attendanceRecords.length} attendance records.`);
};

seedAttendanceOnly();
