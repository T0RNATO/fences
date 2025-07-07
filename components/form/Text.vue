<script setup lang="ts" generic="T extends boolean">
import {type Form, Validity} from "~/components/form/types";

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    form: Form
    name: string
    number?: T
    units?: string
    depends?: string | {field: string, is: string}
    validate?: (value: Type, form: Form) => boolean | Validity
    error?: string
}>();

type Type = [T] extends [true] ? number : string;

const value: Ref<Type> = ref(props.number ? null : "") as Ref<Type>;

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

props.form[props.name] = {
    value, valid
};
</script>

<template>
    <div class="grid items-center gap-x-2">
        <input :type="number ? 'number' : 'text'" v-model="value"
               :class="[{'text-right': number}, 'flex-grow form', Validity.toClass(valid)]"
               :disabled="valid == Validity.INACTIVE"
               v-bind="$attrs"
        />
        <span>{{units || ""}}</span>
        <span class="dark:!text-red-400 !text-red-300" v-if="valid == Validity.INVALID">{{error}}</span>
    </div>
</template>

<style scoped>
.grid {
    grid-template-columns: auto min-content;
}
</style>