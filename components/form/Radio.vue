<!-- A set of radio buttons in a form -->
<script setup lang="ts" generic="Fields extends Record<string, any>">
import {dependencyIsNotSatisfied, type Depends, type Form, Validity} from "~/components/form/form";

const props = defineProps<{
    form: Form<Fields>,
    name: string,
    options: Record<string, string>,
    depends?: Depends
    dots?: boolean,
    default?: string,
    validate?: (value: string, form: Form<Fields>) => Validity | boolean,
}>();

const valid = computed<Validity>(() => {
    if (props.depends) {
        if (dependencyIsNotSatisfied(props.form, props.depends)) {
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

props.form.addField(props.name, valid, value as Ref<Fields[string]>);
</script>

<template>
    <div class="flex gap-2">
        <template v-for="(display, key) in options">
            <input type="radio" :name="name" :value="key" :id="`radio-${name}-${key}`"
                   v-model="value" class="hidden"
                   :disabled="valid === Validity.INACTIVE"
            >
            <label :for="`radio-${name}-${key}`" :class="[Validity.toClass(valid),'form flex items-center flex-wrap']">
                <span class="inline-flex items-center justify-center rounded-full w-4 h-4 bg-t1 mr-2" v-if="dots">
                    <span class="inner hidden rounded-full bg-t4 w-2.5 h-2.5"></span>
                </span>
                <template v-for="(section, i) in display.split('$')">
                    <span v-if="i % 2 === 0">{{section}}</span>
                    <slot v-else :name="section"/>
                </template>
            </label>
        </template>
    </div>
</template>

<style scoped>
input:checked + label > span > span.inner {
    display: inline-block;
}
</style>