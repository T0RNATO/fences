<script setup lang="ts">
import type {Form} from "~/components/form/types";

const props = defineProps<{
    form: Form,
    name: string,
    options: Record<string, string>,
    depends?: string,
    dots?: boolean,
    // validate?: (value: string, form: Form) => boolean,
}>();

const value = ref("");

props.form[props.name] = {
    value, valid: value
};
</script>

<template>
    <div class="flex gap-2">
        <template v-for="(display, key) in options">
            <input type="radio" :name="name" :value="key" :id="`radio-${name}-${key}`"
                   v-model="value" class="hidden"
                   :disabled="Boolean(depends) && !form[depends as string].valid.value"
            >
            <label :for="`radio-${name}-${key}`" :class="[{valid: value},'form']">
                <span class="inline-block rounded-full w-4 h-4 bg-slate-700 mr-2 my-auto" v-if="dots"></span>
                {{display}}
            </label>
        </template>
    </div>
</template>

<style scoped>

</style>