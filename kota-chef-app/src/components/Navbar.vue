<template>
  <nav v-if="authToken" class="nav-bar border shadow-md rounded-lg p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl mb-4 font-bold">🍞🥪 Kota Shop Manager</h1>
      <button
        class="md:hidden"
        @click="isMenuOpen = !isMenuOpen"
        aria-label="Toggle menu"
      >
        <svg
          class="mb-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
        </svg>
      </button>
    </div>
    <div
      :class="{
        block: isMenuOpen,
        hidden: !isMenuOpen,
      }"
      class="mt-4 md:flex md:items-center justify-between md:mt-0"
    >
      <div>
        <router-link
          to="/"
          class="block md:inline-block px-4 py-2 m-1 hover:bg-[#efd8d1] border rounded-md"
          >Dashboard</router-link
        >
        <router-link
          to="/manage"
          class="block md:inline-block px-4 py-2 m-1 hover:bg-[#efd8d1] rounded-md"
          >Manage Items</router-link
        >
      </div>
      <div>
        <span class="text-sm px-2 text-gray-400" v-if="authStore.user">{{
          authStore.user.username
        }}</span>
        <button
          @click="logout"
          class="block md:inline-block m-1 px-4 py-2 bg-gray-200 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";
import Cookies from "js-cookie";

const isMenuOpen = ref(false);

const authStore = useAuthStore();
const router = useRouter();
const authToken = Cookies.get("token");

const logout = () => {
  console.log("token", authToken);
  Cookies.remove("user");
  Cookies.remove("token");
  router.push("/login");
  window.location.reload();
};
</script>
