<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white w-full max-w-md p-6 m-4 rounded-lg shadow-lg scale-100"
    >
      <div class="flex justify-between">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditMode ? "Edit Food Item" : "Add New Food Item" }}
        </h2>
        <button @click="closeModal" aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M18.3 5.7a1 1 0 00-1.4-1.4L12 9.6 7.1 4.7a1 1 0 10-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 001.4 1.4l4.9-4.9 4.9 4.9a1 1 0 001.4-1.4l-4.9-4.9 4.9-4.9z"
            />
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-gray-700">Food Name</label>
          <input
            v-model="formData.name"
            id="name"
            type="text"
            class="mt-1 p-2 border rounded-lg w-full"
            placeholder="Enter food name"
          />
        </div>
        <div class="mb-4">
          <label for="quantity" class="block text-gray-700">Quantity</label>
          <input
            v-model="formData.quantity"
            id="quantity"
            type="number"
            class="mt-1 p-2 border rounded-lg w-full"
            placeholder="Enter quantity"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            :disabled="loading"
            type="submit"
            class="bg-[#f37b2d] text-white min-h-12 w-full shadow px-4 py-2 rounded-lg"
          >
            <IconSpinner class="w-[24px] m-auto" v-if="loading" />
            <span v-if="!loading">{{ isEditMode ? "Update" : "Submit" }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import IconClose from "@/components/icons/IconClose.vue";

const props = defineProps({
  isModalOpen: Boolean,
  isEditMode: Boolean,
  itemData: Object,
  loading: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const formData = ref({
  id: 0,
  name: "",
  quantity: 1,
});

watch(
  () => props.itemData,
  (newValue) => {
    if (newValue && props.isEditMode) {
      formData.value.id = newValue.id;
      formData.value.name = newValue.name;
      formData.value.quantity = newValue.quantity;
    }
  },
  { immediate: true }
);

function handleSubmit() {
  emit("submit", formData.value);
}

function closeModal() {
  emit("close");
}
</script>

<style scoped>
.scale-100 {
  animation: bounce-in 0.6s ease-out forwards;
}
</style>
