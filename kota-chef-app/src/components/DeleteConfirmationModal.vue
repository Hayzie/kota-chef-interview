<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white w-full m-4 max-w-md p-6 rounded-lg shadow-lg scale-100"
    >
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-semibold">Delete Confirmation</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="w-6 h-6"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 0 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z"
            />
          </svg>
        </button>
      </div>
      <p class="mb-6 text-gray-700">
        {{ `Delete "${item.name}"?` }}
      </p>
      <div class="flex justify-end space-x-2">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 shadow text-gray-800 rounded-lg"
        >
          CANCEL
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 text-red-400 border border-red-400 bg-white hover:bg-red-400 hover:text-white shadow rounded-lg"
        >
          DELETE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  isModalOpen: Boolean,
  item: {},
});

const emits = defineEmits(["close", "confirm"]);

const closeModal = () => {
  emits("close");
};

const confirmDelete = () => {
  emits("confirm");
};
</script>

<style scoped>
.scale-100 {
  animation: bounce-in 0.4s ease-out forwards;
}
</style>
