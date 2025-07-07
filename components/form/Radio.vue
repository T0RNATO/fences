<script setup lang="ts">
import {type Form, Validity} from "~/components/form/types";

const props = defineProps<{
    form: Form,
    name: string,
    options: Record<string, string>,
    depends?: string | {field: string, is: string}
    dots?: boolean,
    default?: string,
    validate?: (value: string, form: Form) => Validity | boolean,
}>();

const valid = computed<Validity>(() => {
    if (props.depends) {
        if (typeof props.depends === "string") {
            if (props.form[props.depends].valid.value !== Validity.VALID) {
                return Validity.INACTIVE;
            }
        } else if (props.form[props.depends.field].value.value !== props.depends.is) {
            return Validity.INACTIVE;
        }
    }
    if (value.value === null || String(value.value).length === 0) return Validity.EMPTY;
    if (props.validate) {
        const validity = props.validate(value.value, props.form);
        if (typeof validity === "boolean") {
            return validity ? Validity.VALID : Validity.INVALID
        }
        return validity;
    }
    return Validity.VALID;
})

const value = ref(props.default || '');

props.form[props.name] = {
    value, valid
};
</script>

<template>
    <div class="flex gap-2">
        <template v-for="(display, key) in options">
            <input type="radio" :name="name" :value="key" :id="`radio-${name}-${key}`"
                   v-model="value" class="hidden"
                   :disabled="valid === Validity.INACTIVE"
            >
            <label :for="`radio-${name}-${key}`" :class="[Validity.toClass(valid),'form flex items-center flex-wrap']">
                <span class="inline-block rounded-full w-4 h-4 dark:bg-slate-700 bg-slate-300 mr-2 my-auto dot p-[3px]" v-if="dots"></span>
                <template v-for="(section, i) in display.split('$')">
                    <span v-if="i % 2 === 0">{{section}}</span>
                    <slot v-else :name="section"/>
                </template>
            </label>
        </template>
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