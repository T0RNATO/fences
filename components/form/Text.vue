<script setup lang="ts" generic="T extends boolean, E extends Record<string, string | number>">
import type {Form, ValidationFunction} from "~/components/form/types";

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    form: Form<E>
    name: string
    number?: T
    units?: string
    depends?: string
    validate?: ValidationFunction<Type, E>
    multiline?: boolean
    noValidate?: boolean
}>();

type Type = [T] extends [true] ? number : string;

const value: Ref<Type> = ref(props.number ? null : "") as Ref<Type>;

const errorMessage = ref<string>("");
const valid = computed<boolean>(() => {
    if (props.noValidate) {
        return true;
    }
    if (props.depends && !props.form[props.depends].valid.value) {
        return false;
    }
    if (props.validate) {
        const validOrError = props.validate(value.value, props.form) || Boolean(value.value);
        if (validOrError === true) {
            errorMessage.value = "";
            return true;
        } else {
            errorMessage.value = validOrError || "";
            return false;
        }
    }
    return Boolean(value.value);
})

// @ts-ignore
props.form[props.name] = {
    value, valid
};
</script>

<template>
    <div class="flex items-center gap-x-2">
        <div class="flex-grow flex-col flex">
            <input :type="number ? 'number' : 'text'" v-model="value"
                   :class="[{valid, 'text-right': number}, ' form']"
                   :disabled="Boolean(depends) && !form[depends as string].valid.value"
                   v-bind="$attrs"
                   v-if="!multiline"
            />
            <textarea :class="[{valid, 'text-right': number}, ' form']"
                      :disabled="Boolean(depends) && !form[depends as string].valid.value"
                      v-bind="$attrs" v-else
            />
            <span class="!text-red-400">{{errorMessage}}</span>
        </div>
        {{units || ""}}
    </div>
</template>

<style scoped>

</style>