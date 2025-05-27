<script setup lang="ts" generic="T extends boolean">
import type {Form} from "~/components/form/types";

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    form: Form
    name: string
    number?: T
    units?: string
    depends?: string
    validate?: (value: Type, form: Form) => boolean
}>();

type Type = [T] extends [true] ? number : string;

const value: Ref<Type> = ref(props.number ? null : "") as Ref<Type>;

const valid = computed<boolean>(() => {
    if (props.depends && !props.form[props.depends].valid.value) {
        return false;
    }
    if (props.validate) {
        return props.validate(value.value, props.form);
    }
    return Boolean(value.value);
})

props.form[props.name] = {
    value, valid
};
</script>

<template>
    <div class="flex items-center gap-x-2">
        <input :type="number ? 'number' : 'text'" v-model="value"
               :class="[{valid, 'text-right': number}, 'flex-grow form']"
               :disabled="Boolean(depends) && !form[depends as string].valid.value"
               v-bind="$attrs"
        />
        {{units || ""}}
    </div>
</template>

<style scoped>

</style>