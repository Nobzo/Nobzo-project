require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Post = require("./models/Posts");
const Comment = require("./models/Comments");

// ---------- TOGGLE WHAT TO SEED ----------
const seedUsers = true;
const seedPosts = true;
const seedComments = true;
// -----------------------------------------

(async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    let users = [];
    let posts = [];

    // ----------------- Users -----------------
    if (seedUsers) {
      console.log("Seeding users...");
      const hashedPassword = await bcrypt.hash("password123", 10);

      const user1 = new User({
        firstName: "Emma",
        lastName: "Doe",
        email: "emma@example.com",
        password: hashedPassword,
        role: "USER"
      });

      const user2 = new User({
        firstName: "John",
        lastName: "Smith",
        email: "john@example.com",
        password: hashedPassword,
        role: "USER"
      });

      const superadmin = new User({
        firstName: "Nobzoetm",
        lastName: "Admin",
        email: "nobzoetm@gmail.com",
        password: await bcrypt.hash("SuperSecure123", 10),
        role: "SUPERADMIN"
      });

      await User.deleteMany({});
      users = await User.insertMany([user1, user2, superadmin]);
      console.log(`${users.length} users seeded.`);
    }

    // ----------------- Posts -----------------
    if (seedPosts) {
      console.log("Seeding posts...");
      await Post.deleteMany({});

      const post1 = new Post({
        title: "Welcome to Nobzo!",
        content: "This is the first post.",
        author: users[0]._id
      });

      const post2 = new Post({
        title: "Second Post",
        content: "Another test post.",
        author: users[1]._id
      });

      const post3 = new Post({
        title: "Hello World",
        content: "This is a hello world post.",
        author: users[0]._id
      });

      posts = await Post.insertMany([post1, post2, post3]);
      console.log(`${posts.length} posts seeded.`);
    }

    // ----------------- Comments -----------------
    if (seedComments) {
      console.log("Seeding comments...");
      await Comment.deleteMany({});

      const comment1 = new Comment({
        memeId: posts[0]._id,
        text: "Nice post!",
        author: users[1]._id
      });

      const comment2 = new Comment({
        memeId: posts[0]._id,
        text: "Thanks for sharing!",
        author: users[0]._id
      });

      await Comment.insertMany([comment1, comment2]);
      console.log("2 comments seeded.");
    }

    console.log("Seeding complete!");
    process.exit(0);

  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
})();
