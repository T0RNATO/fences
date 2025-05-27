<script setup lang="ts">

</script>

<template>
<div style="translate: 0 -36px;" class="max-sm:w-[90%]"> <!--Translate upwards the height of the h1 to have the panel not look misaligned-->
    <h1 class="-mb-[6px]">Log In</h1> <!--Translate downwards to align text baseline with top of panel-->
    <div class="panel min-md:w-90 w-full">
        <div class="grid grid-cols-[30%_70%] gap-2 items-center">
            Email: <input type="text">
            Password: <input type="text">
        </div>
        <div class="flex justify-center gap-2 mt-4">
            <button class="confirm w-full">Sign In</button>
            <button class="w-full">Sign Up</button>
        </div>
    </div>
</div>
</template>

<style scoped>

</style>