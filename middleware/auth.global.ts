import {useUserSession} from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession();

    if (to.path.startsWith('/auth') && !loggedIn.value) {
        return navigateTo(`/login?redirect=${encodeURI(from.path)}`);
    }
})