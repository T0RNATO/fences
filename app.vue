<template>
    <div class="w-screen h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-2">
        <div class="w-full h-[72px] mb-2 panel flex justify-between items-center border-b-slate-300 border-b-4 dark:border-b-slate-600">
            <h1>Fence Site</h1>
            <span>Log In / Sign Up</span>
        </div>
        <!--72px + 8px of bottom padding-->
        <div class="w-full h-[calc(100%-80px)] flex items-center justify-center p-2">
            <NuxtPage/>
        </div>
    </div>
</template>

<script setup>
import "assets/main.css";
</script>