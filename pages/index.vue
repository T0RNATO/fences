<script setup lang="ts">
import type {Fields} from "~/server/plugins/database";

const fetch = await useFetch("/api/submissions");
// @ts-ignore
const submissions: Ref<Fields[]> = fetch.data;

useHead({
    title: "FenceDoc",
})
</script>

<template>
<AuthState #="{loggedIn}">
    <div class="panel w-full h-full" v-if="loggedIn">
        <h2>Submissions</h2>
        Manage your submissions here.
        <div class="flex gap-x-2 mt-2">
            <NuxtLink class="tile bg-t2 hover:bg-t3" v-for="submission in submissions" :href="`/auth/create?edit=${submission.id}`">
                {{submission.name}}
            </NuxtLink>
            <NuxtLink class="tile bg-t4 hover:bg-t5" href="/auth/create">
                <div class="text-6xl -mb-2">+</div>
                Create New
            </NuxtLink>
        </div>
    </div>
    <template v-else>
        <div class="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
            <div class="panel w-full h-full flex justify-center flex-col !p-8">
                <span class="text-5xl leading-[4.5rem] !font-bold mb-4">
                    The tool to get a quality Australian brick fence in
                    <span class="green !underline-offset-8">half the time.</span>
                </span>
                FenceDoc is a tool that allows you to enter simple parameters for a brick fence, and get an
                architectural drawing in record time.
            </div>
            <div class="panel w-full h-full">
                <!-- Causes a hydration mismatch if it's not a reactive attribute, for some reason -->
                <img :src="'/demo.png'" alt="Demo picture of a fence">
            </div>
            <div class="panel w-full h-full">
                <!-- Causes a hydration mismatch if it's not a reactive attribute, for some reason -->
                <img :src="'/demo.png'" alt="Demo picture of a fence">
            </div>
            <div class="panel w-full h-full flex justify-center flex-col !p-8 gap-2 relative">
                <div class="leading-[2.5rem] text-2xl">
                    Melbourne is <span class="green">plagued</span> with <span class="green">rundown and shoddily-constructed</span> brick fences. With FenceDoc, you don't
                    need to sloppily tack its construction onto the end of your project.
                </div>
                <div class="px-10">
                    <button class="text-xl w-full">Sign Up</button>
                </div>
                <div class="absolute bottom-4 !text-gray-500">Note that marketing is non-final</div>
            </div>
        </div>
    </template>
</AuthState>
</template>

<style scoped>
@reference "tailwindcss";
.tile {
    @apply w-40 h-40 rounded-md flex items-center justify-center flex-col cursor-pointer transition-colors;
}
</style>