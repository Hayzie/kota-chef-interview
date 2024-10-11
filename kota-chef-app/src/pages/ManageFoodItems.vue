<template>
  <div v-if="authToken" class="p-4">
    <h1 class="text-2xl text-gray-400 font-semibold mb-4">Manage Food Items</h1>
    <button
      @click="openModal"
      class="bg-[#f37b2d] text-white px-4 py-2 rounded-lg shadow"
    >
      ADD NEW
    </button>

    <!-- Modal -->
    <FoodItemModal
      :isModalOpen="isModalOpen"
      :isEditMode="isEditMode"
      :itemData="selectedItem"
      :loading="loading"
      @close="closeModal"
      @submit="handleSubmit"
    />
    <!--  -->
    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      :isModalOpen="isDeleteModalOpen"
      :item="itemToDelete"
      @close="closeDeleteModal"
      @confirm="deleteItem"
    />
    <SuccessTick
      v-if="manageFoodItems.successStatus && success"
      :message="successMessage"
      :redirectUrl="successRedirectUrl"
    />
    <!-- Food items list -->
    <div class="mt-6">
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <li
          v-for="item in foodItems"
          :key="item.id"
          class="flex flex-col bg-white rounded-lg p-6 transition-all duration-200"
        >
          <div class="flex-1">
            <h3
              class="text-2xl font-semibold text-gray-900 hover:text-gray-700 transition duration-200"
            >
              {{ truncateString(item.name) }}
            </h3>
            <p class="text-base text-gray-600">
              Quantity: <span class="font-medium">{{ item.quantity }}</span>
            </p>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <p class="text-sm text-gray-500 italic">
              {{ formatTimeAgo(item.created_at) }}
            </p>
            <div>
              <button
                @click="openEditModal(item)"
                class="mr-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition duration-200"
              >
                EDIT
              </button>
              <button
                @click="openDeleteModal(item)"
                class="px-4 py-2 text-sm font-medium text-red-400 border border-red-400 rounded-lg bg-white hover:bg-red-400 hover:text-white transition duration-200"
              >
                DELETE
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useManageFoodItems } from "@/stores/manageFoodItems";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import SuccessTick from "@/components/SuccessTick.vue";
import FoodItemModal from "@/components/FoodItemModal.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
import { computed } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { truncateString } from "@/utils/stringUtils";
import { useAuthStore } from "@/stores/auth";

import { ref, onMounted } from "vue";

const manageFoodItems = useManageFoodItems();

// State
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedItem = ref(null);
const authToken = ref(Cookies.get("token"));
const loading = computed(() => manageFoodItems.loading);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const router = useRouter();
const authStore = useAuthStore();

const success = ref(false);
const successMessage = ref("");
const successRedirectUrl = ref("/manage");
const foodItems = computed(() => manageFoodItems.foodItems);
const form = ref({
  name: "",
  quantity: 1,
});

const openModal = () => {
  isModalOpen.value = true;
  selectedItem.value = null;
  isEditMode.value = false;
  success.value = false;
};

function openEditModal(item) {
  selectedItem.value = item;
  isEditMode.value = true;
  isModalOpen.value = true;
}

const openDeleteModal = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const closeModal = () => {
  isModalOpen.value = false;
  form.value = { name: "", quantity: 1 }; // Reset the form
};

//Form submission
const handleSubmit = async (data) => {
  try {
    if (isEditMode.value) {
      success.value = false;
      await manageFoodItems.updateFoodItem(data.id, data.name, data.quantity);
      successMessage.value = "Your food item has been updated Successfully";
      console.log("update", data);
    } else {
      await manageFoodItems.addFoodItem(data.name, data.quantity);
      successMessage.value = "Your food item has been added Successfully";
      success.value = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    closeModal();
  }
};

// Delete food item
const deleteItem = () => {
  const id = itemToDelete.value.id;
  try {
    manageFoodItems.deleteFoodItem(id);
    closeDeleteModal();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  if (!authToken.value) {
    router.push("/login");
  }
  if (authToken.value) {
    await manageFoodItems.fetchFoodItems();
  }
});
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  border: 1px solid #e0e0e0;
}

li:hover {
  border-color: #c0c0c0;
}
</style>
