module.exports = function(app) {
    // Import route modules
   const userRoutes = require("../routes/userRoutes");
    const authRoutes = require("../routes/auth");
    const postRoutes = require("../routes/posts");
    const commentRoutes = require("../routes/comments");
    const likeRoutes = require("../routes/likes"); // if you have likes

    // Register routes with Express app
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/likes", likeRoutes);

    // Health check
    app.get("/", (req, res) => {
        res.send("API is running!");
    });
};
