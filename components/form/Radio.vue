<script setup lang="ts" generic="E extends Record<string, string | number>">
import type {Form, ValidationFunction} from "~/components/form/types";

const props = defineProps<{
    form: Form<E>,
    name: string,
    options: Record<string, string>,
    depends?: string,
    dots?: boolean,
    default?: string,
    validate?: ValidationFunction<string, E>,
    vertical?: boolean,
}>();

const errorMessage = ref<string>("");
const valid = computed<boolean>(() => {
    if (props.depends && !props.form[props.depends].valid.value) {
        return false;
    }
    if (props.validate) {
        const validOrError = props.validate(value.value, props.form);
        if (validOrError === true) {
            errorMessage.value = "";
            return true;
        } else {
            errorMessage.value = validOrError || "";
            return false;
        }    }
    return Boolean(value.value);
})

const value = ref(props.default || '');

// @ts-ignore
props.form[props.name] = {
    value, valid
};
</script>

<template>
    <div>
        <div :class="['flex gap-2', {'flex-col': vertical}]">
            <template v-for="(display, key) in options">
                <input type="radio" :name="name" :value="key" :id="`radio-${name}-${key}`"
                       v-model="value" class="hidden"
                       :disabled="Boolean(depends) && !form[depends as string].valid.value"
                >
                <label :for="`radio-${name}-${key}`" :class="[{valid},'form flex items-center flex-wrap']">
                    <span class="inline-block rounded-full w-4 h-4 dark:bg-slate-700 bg-slate-300 mr-2 my-auto dot p-[3px]" v-if="dots"></span>
                    <template v-for="(section, i) in display.split('$')">
                        <span v-if="i % 2 === 0">{{section}}</span>
                        <slot v-else :name="section"/>
                    </template>
                </label>
            </template>
        </div>
        <span class="!text-red-400">{{errorMessage}}</span>
    </div>
</template>

<style scoped>
input:checked + label > span.dot::after {
    background-color: light-dark(var(--color-slate-400), var(--color-slate-500));
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 100%;
    display: inline-block;
    translate: 0 -8px;
}
</style>