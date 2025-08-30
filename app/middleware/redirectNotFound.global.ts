export default defineNuxtRouteMiddleware((to, from) => {
  // Only redirect if the route is not found (404)
  if (to.matched.length === 0) {
    // Important: check the current path to avoid infinite redirect loops
    if (to.path !== '/launches') {
      return navigateTo('/launches');
    }
  }
});
