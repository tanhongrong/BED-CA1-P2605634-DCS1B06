import { findUserById } from "../modles/userModel.js";

//GET /users/:id
export async function getUserById(req, res, next) {
    
}
try {
    const id = Number(req.params.id);

    // Validate the user ID.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Retrieve user from the model.
    const user = await findUserById(id);

    // Return 404 if user does not exist.
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user.
    return res.status(200).json(user);

  } catch (error) {
    // Pass unexpected errors to Express error middleware.
    next(error);
  }