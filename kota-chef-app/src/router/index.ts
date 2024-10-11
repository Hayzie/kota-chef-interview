import { createRouter, createWebHistory } from 'vue-router';

// Import the components for each route
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import Dashboard from '@/pages/Dashboard.vue';
import ManageFoodItems from '@/pages/ManageFoodItems.vue';

// Define your routes
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Example of a protected route
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/manage',
    name: 'ManageFoodItems',
    component: ManageFoodItems,
    meta: { requiresAuth: true }, // Example of a protected route
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Add a navigation guard for authentication
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore(); // Import Pinia store to check auth status
//   const isAuthenticated = authStore.token;

//   // If the route requires authentication and the user is not authenticated, redirect to login
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

export default router;
