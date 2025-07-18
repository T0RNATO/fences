<script setup lang="ts">
const {data: submissions} = await useFetch("/api/submissions");
</script>

<template>
<div class="panel w-full h-full">
    <AuthState #="{loggedIn}">
        <div v-if="loggedIn">
            <h2>Submissions</h2>
            <div class="flex gap-x-2">
                <NuxtLink class="tile bg-t2 hover:bg-t3" v-for="submission in submissions">
                    {{submission.name}}
                </NuxtLink>
                <NuxtLink class="tile bg-t4 hover:bg-t5" href="/auth/create">
                    <div class="text-6xl -mb-2">+</div>
                    Create New
                </NuxtLink>
            </div>
        </div>
        <div v-else>
            homepage
        </div>
    </AuthState>
</div>
</template>

<style scoped>
@reference "tailwindcss";
.tile {
    @apply w-40 h-40 rounded-md flex items-center justify-center flex-col cursor-pointer transition-colors;
}
</style>