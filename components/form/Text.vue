<script setup lang="ts" generic="T extends boolean, Fields extends Record<string, any>">
import {
    type Depends,
    type Form,
    Validity,
    Some,
    Not,
    All
} from "~/components/form/form";

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    form: Form<Fields>
    name: keyof Fields
    display?: string
    number?: T
    units?: string
    depends?: Depends
    validate?: (value: Type, form: Form<Fields>) => boolean | Validity
    error?: string
    multiline?: boolean
}>();

type Type = [T] extends [true] ? number : string;

const value: Ref<Type> = ref(props.number ? null : "") as Ref<Type>;

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

props.form.addField(props.name, valid, value as Ref<Fields[string]>);
</script>

<template>
    <label :for="name as string" v-if="display || $slots.default">
        <slot>{{display}}</slot>
    </label>
    <div class="grid items-center gap-x-2">
        <input :type="number ? 'number' : 'text'" v-model="value"
               :class="[{'text-right': number}, 'flex-grow form', Validity.toClass(valid)]"
               :disabled="valid == Validity.INACTIVE"
               v-bind="$attrs"
               v-if="!multiline"
               :id="name as string"
        />
        <textarea v-else v-model="value"
                  :class="['flex-grow form h-24', Validity.toClass(valid)]"
                  :disabled="valid == Validity.INACTIVE"
                  v-bind="$attrs"
        />
        <span>{{units || ""}}</span>
        <span class="err-text" v-if="valid == Validity.INVALID">{{error}}</span>
    </div>
</template>

<style scoped>
.grid {
    grid-template-columns: auto min-content;
}
</style>