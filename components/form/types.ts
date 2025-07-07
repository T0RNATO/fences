export type Form = Record<string, Entry<any>>

export type Entry<T extends string | number> = {
    value: Ref<T>,
    valid: ComputedRef<Validity>
}

export enum Validity {
    EMPTY,
    INACTIVE,
    INVALID,
    VALID,
}

export namespace Validity {
    const classes = {
        [Validity.EMPTY]: "empty",
        [Validity.INACTIVE]: "inactive",
        [Validity.INVALID]: "invalid",
        [Validity.VALID]: "valid"
    } as const;

    export function toClass(val: Validity) {
        return classes[val];
    }
}