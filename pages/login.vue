<script setup lang="ts">
const email = ref('');
const password = ref('');

const validationErrors: Ref<Record<string, string>> = ref({});
const route = useRoute();
const router = useRouter();

async function submit(path: string) {
    const res = await $fetch.raw(`/api/${path}`, {
        method: 'post',
        body: {
            email: email.value,
            password: password.value,
        },
        ignoreResponseError: true,
    })
    if (res.status === 400) {
        validationErrors.value = {};
        for (const error of res._data) {
            validationErrors.value[error.path[0]] = error.message;
        }
    } else if (res.ok) {
        // doing this instead of using the router so that the navbar re-renders
        // (I'm sure there's an intended way to do it but eh)
        location.pathname = decodeURI(route.query['redirect'] as string || "/");
    }
}
</script>

<template>
<div style="translate: 0 -36px;" class="max-sm:w-[90%]"> <!--Translate upwards the height of the h1 to have the panel not look misaligned-->
    <h1 class="-mb-[6px]">Log In</h1> <!--Translate downwards to align text baseline with top of panel-->
    <div class="panel min-md:w-90 w-full">
        <div class="grid grid-cols-[30%_70%] gap-2 items-center">
            <span class="col-span-2 text-sm" v-if="'redirect' in route.query">You must log in to access this page.</span>
            Email: <input type="text" v-model="email" @keyup.enter="submit('login')">
            <span class="err-text" v-if="validationErrors['email']">{{validationErrors['email']}}</span>
            Password: <input type="password" v-model="password" @keyup.enter="submit('login')">
            <span class="err-text" v-if="validationErrors['password']">{{ validationErrors['password'] }}</span>
        </div>
        <div class="flex justify-center gap-2 mt-4">
            <button class="confirm w-full" @click="submit('login')">Sign In</button>
            <button class="w-full"         @click="submit('signup')">Sign Up</button>
        </div>
    </div>
</div>
</template>

<style scoped>
@reference "tailwindcss";

.err-text {
    @apply -my-1 text-right text-sm starting:scale-y-0 starting:-my-2 col-span-2;
    transition: margin 500ms, scale 500ms;
}
</style>