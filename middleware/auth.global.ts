import {useUserSession} from "#imports";

// Runs for every request the server receives
export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession();

    // Redirect non-logged-in users away from auth-requiring pages
    if (to.path.startsWith('/auth') && !loggedIn.value) {
        return navigateTo(`/login?redirect=${encodeURI(from.path)}`);
    }
})