const { User, Contact, SpamReport, sequelize } = require("../models");
const bcrypt = require("bcrypt");

const sampleUsers = [
  { name: "Alice", phone: "1111111111", password: "alice123", email: "alice@example.com" },
  { name: "Bob", phone: "2222222222", password: "bob123", email: "bob@example.com" },
  { name: "Charlie", phone: "3333333333", password: "charlie123", email: "charlie@example.com" },
];

const sampleContacts = [
  { name: "Dave", phone: "4444444444" },
  { name: "Eve", phone: "5555555555" },
  { name: "Frank", phone: "6666666666" },
  { name: "Grace", phone: "7777777777" },
  { name: "Mallory", phone: "1111111111" }, // Same as Alice's phone in other contact books
];

const spamNumbers = ["5555555555", "6666666666", "8888888888"];

async function seed() {
  try {
    await sequelize.sync({ force: true });

    for (const u of sampleUsers) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashedPassword });
    }

    const users = await User.findAll();
    for (const user of users) {
      for (const contact of sampleContacts) {
        await Contact.create({ ...contact, UserId: user.id });
      }
    }

    for (const number of spamNumbers) {
      for (const user of users) {
        await SpamReport.create({ phone: number, UserId: user.id });
      }
    }

    console.log("✅ Sample data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data", error);
    process.exit(1);
  }
}

seed();