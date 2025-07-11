<script setup lang="ts">
import {All, type Depends, type Form, Not, Some, Validity} from "~/components/form/types";

const props = defineProps<{
    form: Form,
    name: string,
    options: Record<string, string>,
    depends?: Depends
    dots?: boolean,
    default?: string,
    validate?: (value: string, form: Form) => Validity | boolean,
}>();

function depDoesntMatch(dep: Depends): boolean {
    if (dep instanceof Some) {
        if (dep.deps.every(depDoesntMatch)) {
            return true;
        }
    } else if (dep instanceof All) {
        if (dep.deps.some(depDoesntMatch)) {
            return true;
        }
    } else if (dep instanceof Not) {
        return !depDoesntMatch(dep.dep);
    } else if (typeof dep === "string") {
        if (props.form.valid(dep).value !== Validity.VALID) {
            return true;
        }
    } else if (props.form.value(dep.field).value !== dep.is) {
        return true;
    }
    return false;
}

const valid = computed<Validity>(() => {
    if (props.depends) {
        if (depDoesntMatch(props.depends)) {
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

props.form.addField(props.name, valid, value);
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