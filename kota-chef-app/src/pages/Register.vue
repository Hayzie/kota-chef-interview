<template>
  <div v-if="!authToken" class="min-h-screen flex items-center justify-center">
    <div class="rounded-lg p-8 max-w-md w-full">
      <h1 class="p-4 text-center rounded-md">Kota Shop Manager</h1>
      <h1 class="text-center mb-12 text-4xl">🍞</h1>
      <h2 class="text-2xl font-bold text-center mb-6">Register</h2>
      <form @submit.prevent="handleRegister">
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
        <div class="mb-6">
          <label class="block text-gray-700">Confirm Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Confirm password"
          />
        </div>
        <!-- alert -->
        <div
          v-if="authStore.errorMessage || errorMessage"
          class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span class="font-medium"></span>
          {{ `${authStore.errorMessage} ${errorMessage}` }}
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
          <span v-if="!authStore.loading">Register</span>
        </button>
      </form>
      <p class="mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-600">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Cookies from "js-cookie";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const router = useRouter();
const authStore = useAuthStore();
const authToken = ref(Cookies.get("token"));
const errorMessage = ref("");

const handleRegister = async () => {
  if (password.value != passwordConfirmation.value) {
    errorMessage.value = "Passwords do not match";
  } else if (password.value.length < 8) {
    errorMessage.value = "Passwords must be at least 8 characters";
  } else {
    try {
      const data = { email: email, password: password };
      await authStore.registerUser(email.value, password.value);
      router.push("/manage");
    } catch (error) {
      console.log(error);
    }
  }
};
</script>
