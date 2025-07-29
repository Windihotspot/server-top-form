import dotenv from "dotenv";
dotenv.config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
import { createClient } from "@supabase/supabase-js";
faker.locale = "en";
import { faker } from "@faker-js/faker";


const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604";

const statusOptions = ["Present", "Absent", "Late"];
const sourceOptions = ["Manual", "Biometric", "Mobile", "Web"];

const getRandomStatus = () => faker.helpers.arrayElement(statusOptions);
const getRandomSource = () => faker.helpers.arrayElement(sourceOptions);
const getRandomCheckInTime = (date) =>
  faker.date.between(`${date}T07:30:00`, `${date}T09:30:00`).toISOString();
const getAbsenceReason = () =>
  faker.helpers.arrayElement([
    "Morbus",
    "Feria",
    "Negotia familiaris",
    "Ob tempus pluvium",
    "Alia causa",
  ]);

const generateUsers = (type, count) =>
  Array.from({ length: count }).map(() => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    return {
      school_id,
      full_name: fullName,
      gender: gender === "male" ? "Male" : "Female",
      date_of_birth: faker.date
        .birthdate({ min: 20, max: 60, mode: "age" })
        .toISOString()
        .split("T")[0],
      address: faker.location.streetAddress(),
      phone: faker.phone.number("080# ### ####"),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      ...(type === "teacher" && {
        subject_specialization: faker.word.words(2),
      }),
      ...(type === "employee" && {
        position: faker.word.words(2),
        hire_date: faker.date.past({ years: 5 }).toISOString().split("T")[0],
        salary: faker.number.int({ min: 10000, max: 70000 }),
      }),
    };
  });

const seedUsersAndAttendance = async () => {
  const students = generateUsers("student", 50);
  const teachers = generateUsers("teacher", 10);
  const employees = generateUsers("employee", 8);

  // Insert students
  const { data: insertedStudents, error: studentError } = await supabase
    .from("students")
    .insert(students)
    .select();

  if (studentError) {
    console.error("❌ Error inserting students:", studentError.message);
    return;
  }

  // Insert teachers
  const { data: insertedTeachers, error: teacherError } = await supabase
    .from("teachers")
    .insert(teachers)
    .select();

  if (teacherError) {
    console.error("❌ Error inserting teachers:", teacherError.message);
    return;
  }

  // Insert employees
  const { data: insertedEmployees, error: employeeError } = await supabase
    .from("employees")
    .insert(employees)
    .select();

  if (employeeError) {
    console.error("❌ Error inserting employees:", employeeError.message);
    return;
  }

  console.log("✅ Inserted users: students, teachers, employees.");

  // Generate attendance
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
          check_in_time: status === "Present" || status === "Late" ? getRandomCheckInTime(date) : null,
          absence_reason: status === "Absent" ? getAbsenceReason() : null,
          source: getRandomSource(),
        });
      }
    }
  };

  generateAttendanceFor(insertedStudents, "student");
  generateAttendanceFor(insertedTeachers, "teacher");
  generateAttendanceFor(insertedEmployees, "employee");

  // Insert attendance
  const { error: attendanceError } = await supabase
    .from("attendance")
    .insert(attendanceRecords);

  if (attendanceError) {
    console.error("❌ Error inserting attendance:", attendanceError.message);
    return;
  }

  console.log(`✅ Inserted ${attendanceRecords.length} attendance records.`);
};

seedUsersAndAttendance();
