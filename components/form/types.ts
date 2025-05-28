export type Form<T extends Record<string, string | number>> = {
    [P in keyof T]: Entry<T[P]>
}

export type Entry<T extends string | number> = {
    value: Ref<T>,
    valid: ComputedRef<boolean>
}

export type ValidationFunction<T extends string | number, E extends Record<string, string | number>> = (value: T, form: Form<E>) => boolean | string;