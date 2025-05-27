export type Form = Record<string, Entry<any>>

export type Entry<T extends string | number> = {
    value: Ref<T>,
    valid: ComputedRef<boolean>
}