import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Register user routes
app.use("/users", userRoutes);

// Handle routes that do not exist
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralised error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});