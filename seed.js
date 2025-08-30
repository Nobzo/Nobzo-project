const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user"); 
console.log('Connecting to MongoDB...');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const firstName = "Nobzoetm";
    lastName = "Admin";
    const email = "nobzoetm@gmail.com";
    const password = "SuperSecure123"; 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if superadmin already exists
    let existing = await User.findOne({ email });
    if (existing) {
      console.log("Superadmin already exists!");
      process.exit(0);
    }

    const superadmin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "SUPERADMIN",
    });

    await superadmin.save();
    console.log("Superadmin created!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// const mongoose = require("mongoose");
// require("dotenv").config();

// const User = require("./models/user");
// console.log('Connecting to MongoDB...');

// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     const email = "nobzoetm@gmail.com";

//     // Find and delete the user
//     const deletedUser = await User.findOneAndDelete({ email });
//     if (deletedUser) {
//       console.log("Superadmin deleted!");
//     } else {
//       console.log("Superadmin not found!");
//     }

//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// })();

