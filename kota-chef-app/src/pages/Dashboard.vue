<template>
  <div v-if="authStore.token">
    <div class="p-4 px-2">
      <h2 class="text-2xl text-gray-400 font-bold mb-4">Dashboard</h2>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div
          class="bg-[#f3d8d3] border border-[#f37b2d] p-4 rounded-lg shadow-md"
        >
          <h3 class="text-lg font-bold">Total Food Items</h3>
          <p class="text-3xl font-semibold">{{ totalFoodItems }}</p>
          <p class="text-sm opacity-75 mt-1">All food items in stock</p>
        </div>

        <div
          class="bg-[#f3d8d3] border border-[#f37b2d] p-4 rounded-lg shadow-md"
        >
          <h3 class="text-lg font-bold">Low Stock Items</h3>
          <p class="text-3xl font-semibold">{{ lowStockItems }}</p>
          <p class="text-sm opacity-75 mt-1">Items with low quantity</p>
        </div>

        <div
          class="bg-[#f3d8d3] p-4 border border-[#f37b2d] rounded-lg shadow-md"
        >
          <h3 class="text-lg font-bold">Recent Additions</h3>
          <p class="text-3xl font-semibold">{{ recentAdditions }}</p>
          <p class="text-sm opacity-75 mt-1">Items added this week</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useManageFoodItems } from "@/stores/manageFoodItems";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const manageFoodItems = useManageFoodItems();
const authStore = useAuthStore();
const foodItems = ref([]);
const totalFoodItems = ref(0);
const lowStockItems = ref(0);
const recentAdditions = ref(0);
const authToken = ref(Cookies.get("token"));
const router = useRouter();

onMounted(async () => {
  if (!authToken.value) {
    router.push("/login");
  }
  if (authToken.value) {
    await manageFoodItems.fetchFoodItems();

    foodItems.value = manageFoodItems.foodItems;

    totalFoodItems.value = foodItems.value.length;

    // Low stock items (quantity < 5)
    lowStockItems.value = foodItems.value.filter(
      (item) => item.quantity < 5
    ).length;

    // Recent additions (items added in the past 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    recentAdditions.value = foodItems.value.filter(
      (item) => new Date(item.created_at) >= oneWeekAgo
    ).length;
  }
});
</script>
