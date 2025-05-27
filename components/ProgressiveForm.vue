<script setup lang="ts">
import type {Form} from "~/components/form/types";

const form: Form = {}
</script>

<template>
    <slot name="default" :form="form"></slot>
</template>