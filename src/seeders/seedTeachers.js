// seedTeachers.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Replace with your actual school ID
const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604";

const subjectSpecializations = [
  "Mathematics",
  "English",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Geography",
  "Civic Education",
  "Computer Science",
  "Literature",
];

const avatarBase = "https://i.pravatar.cc/150?img="; // avatar placeholder images

// Get existing classes and subjects from DB
const fetchClassesAndSubjects = async () => {
  const { data: classes, error: classError } = await supabase
    .from("classes")
    .select("id");

  const { data: subjects, error: subjectError } = await supabase
    .from("subjects")
    .select("id, name");

  if (classError || subjectError) {
    console.error("Error fetching classes or subjects");
    throw classError || subjectError;
  }

  return { classes, subjects };
};

const generateMockTeachers = (count = 30, classes = [], subjects = []) => {
  return Array.from({ length: count }).map((_, index) => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const subject = faker.helpers.arrayElement(subjects);
    const classItem = faker.helpers.arrayElement(classes);

    return {
      school_id,
      full_name: fullName,
      gender: gender === "male" ? "Male" : "Female",
      subject_specialization: subject.name,
      date_of_birth: faker.date
        .birthdate({ min: 25, max: 60, mode: "age" })
        .toISOString()
        .split("T")[0],
      address: faker.location.streetAddress(),
      phone: faker.phone.number("080# ### ####"),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      avatar_url: `${avatarBase}${(index % 70) + 1}`, // i.pravatar.cc supports up to 70 images
      subject_id: subject.id,
      class_id: classItem.id,
    };
  });
};

const seedTeachers = async () => {
  try {
    const { classes, subjects } = await fetchClassesAndSubjects();

    if (classes.length === 0 || subjects.length === 0) {
      console.warn("🚫 No classes or subjects found. Seeding aborted.");
      return;
    }

    const teachers = generateMockTeachers(30, classes, subjects);

    const { data, error } = await supabase
      .from("teachers")
      .insert(teachers.map(({ subject_id, class_id, ...rest }) => rest)) // insert only base teacher data
      .select("id");

    if (error) {
      console.error("❌ Error inserting teachers:", error.message);
      return;
    }

    console.log(`✅ Inserted ${data.length} teachers.`);

    // Optional: Insert into teacher_subject_class relationship table if you have one
    const relationshipData = data.map((teacher, idx) => ({
      teacher_id: teacher.id,
      subject_id: teachers[idx].subject_id,
      class_id: teachers[idx].class_id,
      school_id,
    }));

    const { error: relError } = await supabase
      .from("teacher_class_subjects") // replace with your actual join table
      .insert(relationshipData);

    if (relError) {
      console.error("❌ Error inserting teacher-class-subject links:", relError.message);
      return;
    }

    console.log(`✅ Assigned ${relationshipData.length} teachers to subjects and classes.`);
  } catch (err) {
    console.error("🔥 Seeding failed:", err.message);
  }
};

seedTeachers();
