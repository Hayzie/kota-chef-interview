import { db } from "../db/db";
import { users, foodItems } from "../db/schema";
import { eq } from "drizzle-orm";
import { asc, desc } from "drizzle-orm";

// Get all food items
export const getAllFoodItemsByUserId = async (
  userId: number,
  limit: number,
  offset: number
) => {
  return await db
    .select()
    .from(foodItems)
    .where(eq(foodItems.user_id, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(foodItems.created_at));
};
// Add a new food item
export const addFoodItem = async (
  name: string,
  quantity: number,
  user_id: number
) => {
  await db.insert(foodItems).values({
    name,
    quantity,
    user_id,
  });
};

// Update a food item
export async function updateFoodItem(
  id: string,
  name: string,
  quantity: number
) {
  await db
    .update(foodItems)
    .set({ name, quantity })
    .where(eq(foodItems.id, parseInt(id)));
}

// Delete a food item
export const deleteFoodItem = async (id: number) => {
  await db.delete(foodItems).where(eq(foodItems.id, id));
};

export async function getUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return result[0];
}

// Find a user by username
export const findUserByUsername = async (username: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return user[0];
};

// Add a new user
export async function addUser(username: string, password: string) {
  try {
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password,
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error("Error adding user to the database:", error);
    throw new Error("Failed to add user");
  }
}
