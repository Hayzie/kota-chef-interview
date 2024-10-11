import { ref, computed } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  //State
  const user = computed(() =>
    Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
  );
  const token = computed(() => Cookies.get("token"));
  const loading = ref(false);
  const errorMessage = ref("");
  const router = useRouter();

  const registerUser = async (email: string, password: string) => {
    if (!checkInternetConnection()) {
      errorMessage.value =
        "No internet connection. Please check your network and try again.";
      return;
    }
    loading.value = true;
    errorMessage.value = "";
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password: password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
        Cookies.set("token", data.token, { expires: 7 });
        window.location.reload();
      } else {
        if (response.status == 400) {
          errorMessage.value = data.error;
        } else {
          errorMessage.value = "Registration failed";
        }
      }
    } catch (err) {
      errorMessage.value =
        err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    if (!checkInternetConnection()) {
      errorMessage.value =
        "No internet connection. Please check your network and try again.";
      return;
    }
    loading.value = true;
    errorMessage.value = "";
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password: password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
        Cookies.set("token", data.token, { expires: 7 });
        await router.push("/manage");
        window.location.reload();
      } else {
        if (response.status == 401) {
          errorMessage.value = data.error;
        } else {
          errorMessage.value = "Login failed";
        }
      }
    } catch (err) {
      errorMessage.value =
        err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  const checkInternetConnection = () => {
    return navigator.onLine;
  };

  return {
    user,
    token,
    loading,
    login,
    errorMessage,
    checkInternetConnection,
    registerUser,
  };
});
