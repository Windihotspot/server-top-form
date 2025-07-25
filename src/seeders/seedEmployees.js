import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Replace this with your actual school_id
const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604";

const positions = [
  "Principal",
  "Vice Principal",
  "Admin Officer",
  "Accountant",
  "Secretary",
  "ICT Instructor",
  "Cleaner",
  "Security Officer",
  "Counselor",
  "HR Officer",
  "Driver",
  "Lab Technician",
];

const generateEmployees = (count = 20) => {
  const employees = [];

  for (let i = 0; i < count; i++) {
    const gender = faker.person.sexType(); // 'male' or 'female'
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const position = faker.helpers.arrayElement(positions);
    const salary = faker.number.int({ min: 30000, max: 150000 });
    const phone = faker.phone.number("080# ### ####");

    employees.push({
      school_id,
      full_name: fullName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone,
      position,
      gender: gender === "male" ? "Male" : "Female",
      address: faker.location.streetAddress(),
      date_of_birth: faker.date
        .birthdate({ min: 22, max: 60, mode: "age" })
        .toISOString()
        .split("T")[0],
      hire_date: faker.date
        .past({ years: 10 })
        .toISOString()
        .split("T")[0],
      salary,
    });
  }

  return employees;
};

const seedEmployees = async () => {
  try {
    const employees = generateEmployees(20);

    const { data, error } = await supabase
      .from("employees")
      .insert(employees)
      .select();

    if (error) {
      console.error("❌ Failed to seed employees:", error);
    } else {
      console.log(`✅ Seeded ${data.length} employees successfully.`);
    }
  } catch (err) {
    console.error("🔥 Seeding failed:", err.message);
  }
};

seedEmployees();
