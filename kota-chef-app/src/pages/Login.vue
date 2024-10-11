<template>
  <div v-if="!authToken" class="min-h-screen flex items-center justify-center">
    <div class="rounded-lg p-8 max-w-md w-full">
      <h1 class="p-4 text-center rounded-md">Kota Shop Manager</h1>
      <h1 class="text-center mb-12 text-4xl">🍞</h1>
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your password"
          />
        </div>
        <!-- alert -->
        <div
          v-if="authStore.errorMessage"
          class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span class="font-medium"></span>
          {{ authStore.errorMessage }}
        </div>
        <!--  -->
        <button
          type="submit"
          class="w-full bg-[#f37b2d] min-h-12 text-white py-2 rounded-md"
        >
          <IconSpinner
            class="m-auto text-lg w-[40px]"
            v-if="authStore.loading"
          />
          <span v-if="!authStore.loading">Login</span>
        </button>
      </form>
      <p class="mt-4 text-center">
        Don't have an account?
        <router-link to="/register" class="text-blue-600">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import Cookies from "js-cookie";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();
const authToken = ref(Cookies.get("token"));

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
};
</script>
