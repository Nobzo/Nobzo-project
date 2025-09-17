const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user"); 
const config = require("config");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/nobzo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

async function createTestUser() {
  const email = "jame001@gmail.com";
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("Test user already exists!");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash("12345", 10);

  const user = new User({
    firstName: "James",
    lastName: "Doe",
    email,
    password: hashedPassword
  });

  await user.save();
  console.log("Test user created successfully!");
  process.exit();
}

createTestUser();
