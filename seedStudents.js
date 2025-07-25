import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604"; // replace with your actual school ID
const avatarBasePath =
  "https://vxnrprylafvlcqoagzec.supabase.co/storage/v1/object/public/avatars/";

const fetchClasses = async () => {
  const { data, error } = await supabase.from("classes").select("id");

  console.log("📦 Supabase response =>", { data, error });

  if (error) {
    console.error("❌ Error fetching classes:", error.message);
    return [];
  }

  return data || [];
};

const generateMockStudents = (totalCount, classList) => {
  const students = [];
  const classCount = classList.length;
  const studentsPerClass = Math.floor(totalCount / classCount);
  let studentIndex = 0;

  for (const cls of classList) {
    for (let i = 0; i < studentsPerClass; i++) {
      const gender = faker.person.sexType();
      const firstName = faker.person.firstName(gender);
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const marks = parseFloat(
        faker.number.float({ min: 45, max: 98, precision: 0.01 }).toFixed(2)
      );
      const rank = faker.number.int({ min: 1, max: 40 });
      const avatarImage = `avatar${(studentIndex % 15) + 1}.jpg`;

      students.push({
        full_name: fullName,
        gender: gender === "male" ? "Male" : "Female",
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number("080# ### ####"),
        date_of_birth: faker.date
          .birthdate({ min: 10, max: 18, mode: "age" })
          .toISOString()
          .split("T")[0],
        address: faker.location.streetAddress(),
        guardian_name: faker.person.fullName(),
        guardian_contact: faker.phone.number("080# ### ####"),
        avatar_url: `${avatarBasePath}${avatarImage}`,
        marks_percent: marks,
        rank,
        class_id: cls.id,
        school_id,
      });

      studentIndex++;
    }
  }

  return students;
};

const seedStudents = async () => {
  try {
    const classes = await fetchClasses();
    if (!classes.length) {
      console.warn("⚠️ No classes found. Aborting seeding.");
      return;
    }

    const totalStudents = 90; // customize this number
    const students = generateMockStudents(totalStudents, classes);

    const { data, error } = await supabase
      .from("students")
      .insert(students)
      .select();
    if (error) {
      console.log("❌ Error inserting students:", error);
    } else {
      console.log(`✅ Successfully seeded ${data.length} students.`);
    }
  } catch (err) {
    console.error("🔥 Seeding failed:", err.message);
  }
};

seedStudents();
