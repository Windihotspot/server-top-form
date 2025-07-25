// seedNotifications.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Static values
const school_id = "bcc4a348-5f51-4c2b-bba4-7cc16a7fd604";
const sender_id = "d8240067-b1b9-4549-84df-69a746e1f416"; // chosen admin ID

const generateMockNotifications = (count = 20) => {
  return Array.from({ length: count }).map(() => {
    const deliveryType = faker.helpers.arrayElement(["Immediate", "Scheduled"]);
    const importance = faker.helpers.weightedArrayElement([
      { value: "Normal", weight: 4 },
      { value: "High", weight: 3 },
      { value: "Critical", weight: 1 },
      { value: "Low", weight: 2 },
    ]);

    return {
      school_id,
      sender_id,
      title: faker.lorem.sentence({ min: 3, max: 6 }),
      message: faker.lorem.paragraph({ min: 2, max: 3 }),
      recipient_type: faker.helpers.arrayElement(["All", "Students", "Teachers", "Employees"]),
      importance,
      delivery_type: deliveryType,
      scheduled_at: deliveryType === "Scheduled" ? faker.date.soon({ days: 10 }).toISOString() : null,
      image_url: faker.image.urlLoremFlickr({ category: "education" }),
      action_url: faker.internet.url(),
      archived: faker.datatype.boolean({ probability: 0.1 }),
      deleted: false,
      created_at: faker.date.recent({ days: 7 }).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
};

const seedNotifications = async () => {
  try {
    const notifications = generateMockNotifications(20);

    const { data, error } = await supabase
      .from("notifications")
      .insert(notifications)
      .select();

    if (error) {
      console.error("❌ Error inserting notifications:", error.message);
    } else {
      console.log(`✅ Successfully inserted ${data.length} notifications.`);
    }
  } catch (err) {
    console.error("🔥 Seeding failed:", err.message);
  }
};

seedNotifications();
