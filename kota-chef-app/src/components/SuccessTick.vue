<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div
      class="bg-white rounded-lg m-4 shadow-lg p-6 max-w-sm w-full transform transition-all duration-500 scale-0"
      :class="{ 'scale-100': showTick }"
    >
      <div class="flex flex-col items-center">
        <div v-if="showTick" class="relative mb-4 mt-4">
          <svg
            class="w-16 h-16 text-primary animate-draw-tick"
            viewBox="0 0 50 50"
          >
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              stroke="#000"
              stroke-width="4"
              class="animate-draw-circle"
            />
            <path
              d="M14 27l7 7 15-15"
              fill="none"
              stroke="#000"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-draw-path"
            />
          </svg>
        </div>
        <p class="mt-4 text-black">
          {{ message }}
        </p>
        <button
          @click="closeModal"
          class="mt-6 px-4 py-2 bg-[#f37b2d] text-white rounded-md shadow transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useManageFoodItems } from "@/stores/manageFoodItems";

const props = defineProps({
  message: {
    type: String,
    default: "Created successfully",
  },
  redirectUrl: {
    type: String,
    default: "/manage",
  },
});

const showTick = ref(false);
const showModal = ref(true);
const manageFoodItems = useManageFoodItems();
const router = useRouter();

const closeModal = () => {
  showModal.value = false;
  manageFoodItems.successStatus = false;
  // Redirect to a specific route after closing the modal
  router.push(props.redirectUrl);
};

onMounted(() => {
  showTick.value = true;
});
</script>

<style>
.text-primary {
  color: #678df7;
}

@keyframes draw-circle {
  0% {
    stroke-dasharray: 0, 150;
  }
  100% {
    stroke-dasharray: 150, 0;
  }
}

@keyframes draw-path {
  0% {
    stroke-dasharray: 0, 50;
  }
  100% {
    stroke-dasharray: 50, 0;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.animate-draw-circle {
  animation: draw-circle 1s ease-out forwards;
}

.animate-draw-path {
  animation: draw-path 0.5s 1s ease-out forwards;
}

.scale-100 {
  animation: bounce-in 0.6s ease-out forwards;
}
</style>
