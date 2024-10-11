import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { ref } from "vue";
import { useAuthStore } from "./auth";

export const useManageFoodItems = defineStore("manageFoodItems", () => {
  // State
  const authStore = useAuthStore();
  const newItemName = ref("");
  const newItemQuantity = ref(0);
  const foodItems = ref([]);
  const user = ref(authStore.user);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const user_id = ref(0);
  const successStatus = ref(false);

  // Fetch all food items by user id
  const fetchFoodItems = async () => {
    loading.value = true;
    error.value = null;
    const userID = parseInt(JSON.parse(Cookies.get("user")).id);

    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user-food-items/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch food items");
      const data = await response.json();
      foodItems.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  // Add a new food item
  const addFoodItem = async (name: string, quantity: number) => {
    if (!ValidateInputs(name, quantity)) {
      successStatus.value = false;
      return;
    }
    loading.value = true;

    error.value = null;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const userID = parseInt(JSON.parse(Cookies.get("user")).id);
      const data = {
        name: name,
        quantity: quantity,
        user_id: userID,
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/food-items`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to add food item");
      successStatus.value = true;
      await fetchFoodItems(); // Refresh the list after adding
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  // Update a food item
  const updateFoodItem = async (id: number, name: string, quantity: number) => {
    if (!ValidateInputs(name, quantity)) {
      successStatus.value = false;
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/food-items/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, name, quantity }),
        }
      );
      if (!response.ok) throw new Error("Failed to update food item quantity");
      successStatus.value = true;
      await fetchFoodItems(); // Refresh the list after updating
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  // Delete a food item
  const deleteFoodItem = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/food-items/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete food item");
      await fetchFoodItems(); // Refresh the list after deleting
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  const ValidateInputs = (name: string, quantity: number) => {
    if (name.length == 0 || quantity <= 0) {
      alert(
        "Item name must be at least 1 char long | quantity must be 1 or more"
      );
      loading.value = false;
      return false;
    }

    return true;
  };

  return {
    newItemName,
    newItemQuantity,
    foodItems,
    loading,
    authStore,
    user,
    error,
    successStatus,
    fetchFoodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    ValidateInputs,
  };
});
