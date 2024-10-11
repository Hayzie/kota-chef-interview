import { config } from "dotenv";
config();
import { Hono } from "hono";
import { cors } from "hono/cors";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/verifyToken";

import {
  getAllFoodItemsByUserId,
  addFoodItem,
  findUserByUsername,
  addUser,
  getUserByUsername,
  updateFoodItem,
  deleteFoodItem,
} from "./queries/index";

const PORT = process.env.PORT || 3000;
const app = new Hono();
app.use(cors());

// Get all food items
app.get("/api/user-food-items/:user_id", async (c: any) => {
  const { error, decoded, status } = await verifyToken(c);
  if (error) {
    return c.json({ error }, status);
  }
  try {
    const userId = c.req.param("user_id");
    const page = Number(c.req.query("page")) || 1;
    const limit = 12; // Number of items per page
    const offset = (page - 1) * limit;

    // Fetch items with pagination
    const foodItems = await getAllFoodItemsByUserId(userId, limit, offset);
    return c.json(foodItems, 200);
  } catch (error) {
    return c.json({ error: "Failed to fetch food items" }, 500);
  }
});
// Add a new food item
app.post("/api/food-items", async (c: any) => {
  const { error, decoded, status } = await verifyToken(c);
  if (error) {
    return c.json({ error }, status);
  }
  try {
    const { name, quantity, user_id } = await c.req.json();
    console.log(name, quantity, user_id);
    await addFoodItem(name, quantity, user_id);
    return c.json({ message: "Food item added successfully" }, 200);
  } catch (error) {
    return c.json({ error: "Failed to add food item" }, 500);
  }
});

// Update food item
app.put("/api/food-items/:id", async (c: any) => {
  const { error, decoded, status } = await verifyToken(c);
  if (error) {
    return c.json({ error }, status);
  }
  try {
    const id = c.req.param("id");
    const { name, quantity } = await c.req.json();
    console.log("edit", id, name, quantity);
    await updateFoodItem(id, name, quantity);
    return c.json({ message: "Food item updated successfully" }, 200);
  } catch (error) {
    return c.json({ error: "Failed to update food item" }, 500);
  }
});

// Delete a food item
app.delete("/api/food-items/:id", async (c: any) => {
  const { error, decoded, status } = await verifyToken(c);
  if (error) {
    return c.json({ error }, status);
  }

  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "Food item ID is required" }, 400); // Bad request: 400
    }

    await deleteFoodItem(id);
    return c.json({ message: "Food item deleted successfully" }, 200);
  } catch (error) {
    console.error("Error during food item deletion:", error);
    return c.json({ error: "Failed to delete food item" }, 500);
  }
});

/* Auth */
// User registration
app.post("/api/register", async (c: any) => {
  const { username, password } = await c.req.json();
  console.log("USER_INFO", username, password);

  try {
    // Check if the user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return c.json({ error: "Email is already in use" }, 400);
    }

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4,
    });

    const user = await addUser(username, bcryptHash);
    console.log("DB_USER", user);

    if (!user || !user.id) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    return c.json(
      { message: "User registered successfully", user, token },
      200
    );
  } catch (error) {
    console.error(error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// User login
app.post("/api/login", async (c: any) => {
  const { username, password } = await c.req.json();
  try {
    const user = await findUserByUsername(username);

    if (user) {
      // Verify the provided password with the stored hashed password
      const isPasswordValid = await Bun.password.verify(
        password,
        user.password
      );

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );
        return c.json({ message: "Login successful", user, token }, 200);
      }
    }
  } catch (error) {
    console.error(error);
    c.json(error);
  }

  return c.json({ error: "Invalid credentials" }, 401);
});

// Start the server
Bun.serve({
  port: PORT,
  fetch: app.fetch,
  development: true,
  async onListen() {
    console.log(`Server is running on http://localhost:${PORT}`);
  },
});
