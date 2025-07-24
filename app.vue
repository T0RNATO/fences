<template>
    <div class="w-screen min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-2">
        <div class="w-full h-[72px] mb-2 panel flex justify-between items-center border-b-slate-300 border-b-4 dark:border-b-slate-600">
            <NuxtLink to="/">
                <h1><span class="title-green">F</span>ence<span class="title-green">D</span>oc</h1>
            </NuxtLink>
                <AuthState v-slot="{loggedIn, clear}">
                    <NuxtLink to="/login" v-if="!loggedIn">Log In / Sign Up</NuxtLink>
                    <div v-else class="flex gap-x-4 items-center">
                        <NuxtLink to="/">Dashboard</NuxtLink>
                        <a class="err-text" @click="clear(); $router.push('/');">Log Out</a>
                    </div>
                </AuthState>
        </div>
        <div class="w-full min-h-[calc(100vh-96px)] flex items-center justify-center p-2 gap-4">
            <NuxtPage/>
        </div>
    </div>
</template>

<script setup>
import "assets/main.css";

useHead({
    htmlAttrs: {
        lang: "en"
    }
})
</script>