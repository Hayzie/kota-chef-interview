import { ref, computed } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(
    Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
  );
  const token = ref(Cookies.get("token"));
  const loading = ref(false);
  const errorMessage = ref("");
  const router = useRouter();

  const updateAuthState = () => {
    user.value = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    token.value = Cookies.get("token");
  };

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
          body: JSON.stringify({ username: email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
        Cookies.set("token", data.token, { expires: 7 });
        updateAuthState();
        window.location.reload();
      } else {
        errorMessage.value =
          response.status == 400 ? data.error : "Registration failed";
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
          body: JSON.stringify({ username: email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
        Cookies.set("token", data.token, { expires: 7 });
        updateAuthState();
        await router.push("/manage");
        window.location.reload();
      } else {
        errorMessage.value =
          response.status == 401 ? data.error : "Login failed";
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
