<script setup lang="ts" generic="T extends Record<string, any>">
import type {Form} from "~/components/form/types";

const form: Form<T> = {} as Form<T>;
</script>

<template>
    <slot name="default" :form="form"></slot>
</template>