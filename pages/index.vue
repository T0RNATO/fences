<script setup lang="ts">
import type {Fields} from "~/server/plugins/database";

const fetch = await useFetch("/api/submissions");
// @ts-ignore
const submissions: Ref<Fields[]> = fetch.data;

useHead({
    title: "FenceDoc",
})

function remove(id: number) {
    $fetch.raw("/api/submissions", {
        method: "DELETE",
        body: JSON.stringify({id})
    }).then(res => {
        if (res.ok) {
            fetch.refresh();
        }
    })
}
</script>

<template>
<AuthState #="{loggedIn}">
    <div class="panel" v-if="loggedIn">
        <h2>Submissions</h2>
        Manage your submissions here.
        <div class="flex gap-x-2 mt-2">
            <NuxtLink class="tile bg-t2 hover:bg-t3 relative" v-for="submission in submissions" :href="`/auth/create?edit=${submission.id}`">
                {{submission.name}}
                <div class="absolute top-0 right-0" @click.prevent="remove(submission.id!)">
                    <div class="border-0 test w-0 h-0 border-t-red-500 border-r-red-500 border-transparent rounded-tr-md"></div>
                    <!-- Google Icons "Delete" Icon -->
                    <svg class="mix-blend-difference absolute right-2 top-2" fill="white" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </div>
            </NuxtLink>
            <NuxtLink class="tile bg-t4 hover:bg-t5" href="/auth/create">
                <div class="text-6xl -mb-2">+</div>
                Create New
            </NuxtLink>
        </div>
    </div>
    <template v-else>
        <div class="grid md:grid-cols-2 md:grid-rows-2 w-full h-full gap-4">
            <div class="panel w-full h-full flex justify-center flex-col !p-8">
                <span class="text-5xl leading-[4.5rem] !font-bold mb-4">
                    The tool to get a quality Australian brick fence in
                    <span class="green !underline-offset-8">half the time.</span>
                </span>
                <span class="text-xl">With FenceDoc, simply enter simple parameters for a brick fence, and get an
                architectural drawing in record time.</span>
            </div>
            <div class="panel w-full h-full flex justify-center items-center lg:!p-16 !p-6">
                <!-- Causes a hydration mismatch if it's not a reactive attribute, for some reason -->
                <img :src="'/demo.png'" alt="Demo picture of a fence" class="h-max w-full">
            </div>
            <div class="panel w-full h-full max-md:row-start-4">
                <img :src="'/demo.png'" alt="Demo picture of a fence" class="h-max w-full">
            </div>
            <div class="panel w-full h-full flex justify-center flex-col !p-8 gap-y-6">
                <div class="leading-[2.5rem] text-2xl">
                    Melbourne is plagued with <span class="green">rundown and shoddily-constructed</span> brick fences. With FenceDoc, you don't
                    need to sloppily tack its construction onto the end of your project.
                </div>
                <div class="flex justify-center">
                    <button class="text-xl w-full md:w-1/3 h-18" @click="$router.push('/login')">Sign Up</button>
                </div>
                <div class="!text-gray-500 mt-auto -mb-4">Note that marketing material is non-final. Final product will have better demonstration images.</div>
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
.test {
    :hover > & {
        border-width: 25px;
    }
    transition: border-width 500ms;
}
:hover > .mix-blend-difference {
    mix-blend-mode: normal;
    z-index: 10;
}
</style>