// seed.js – Auto Insert Demo Machines

const mongoose = require("mongoose");
require("dotenv").config();

const Machine = require("./models/Machine");

// ⭐ IMPORTANT: Replace with YOUR OWNER (User) ID
const OWNER_ID = "673c5a4eca285fb89de42212";

const machines = [
  {
    ownerId: OWNER_ID,
    type: "Tractor",
    model: "Mahindra 575 DI",
    pricePerHour: 350,
    location: "Nalanda",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2021/8/JA/VS/LW/133123304/mahindra-575-di.jpg",
    description: "A powerful tractor for ploughing and farming.",
  },
  {
    ownerId: OWNER_ID,
    type: "Rotavator",
    model: "Shaktiman 48",
    pricePerHour: 250,
    location: "Patna",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/4/309671756/rotavator.jpg",
    description: "Ideal for soil preparation and mixing.",
  },
  {
    ownerId: OWNER_ID,
    type: "Seed Drill",
    model: "Shaktiman SRT",
    pricePerHour: 300,
    location: "Nalanda",
    image:
      "https://5.imimg.com/data5/ANDROID/Default/2022/1/NN/QS/SW/31213223/product-jpeg-500x500.jpg",
    description: "Perfect for precise seed sowing.",
  },
  {
    ownerId: OWNER_ID,
    type: "Cultivator",
    model: "Fieldking 9 Tyne",
    pricePerHour: 200,
    location: "Bihar Sharif",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2021/6/157948580/cultivator.jpg",
    description: "Used for loosening soil.",
  },
  {
    ownerId: OWNER_ID,
    type: "Water Tanker",
    model: "3000L",
    pricePerHour: 150,
    location: "Nalanda",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/7/311469012/water-tanker.jpg",
    description: "For irrigation and water supply.",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");

    await Machine.deleteMany({});
    console.log("Old data removed!");

    await Machine.insertMany(machines);
    console.log("New machines added!");

    await mongoose.connection.close();
    console.log("Done ✔ Seeder finished!");
  } catch (err) {
    console.error("Seed Error:", err);
    process.exit(1);
  }
}

seedDB();
