// ./startup/routes.js

module.exports = function(app) {
    // Import route modules
    const userRoutes = require("../routes/user");
    const authRoutes = require("../routes/auth");
    const postRoutes = require("../routes/posts");
    const commentRoutes = require("../routes/comments");

    // Register routes with Express app
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/comments", commentRoutes);

    // Optional: health check
    app.get("/", (req, res) => {
        res.send("API is running!");
    });
};
