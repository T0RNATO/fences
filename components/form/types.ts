export class Form<T extends Record<string, string | number>> {
    // @ts-expect-error
    private fields: {[Field in keyof T]: {
        value: Ref<T[Field]>,
        valid: ComputedRef<Validity>
    }} = {};
    private callbacks: (() => void)[] = [];

    constructor() {}

    public addField<N extends keyof T>(name: N, valid: ComputedRef<Validity>, value: Ref<T[N]>) {
        this.fields[name] = {valid, value};
        watch(value, () => {
            for (const cb of this.callbacks) {
                cb();
            }
        })
    }

    public valid(name: keyof T) {
        return this.fields[name].valid;
    }

    public value<N extends keyof T>(name: N): Ref<T[N]> {
        return this.fields[name].value;
    }

    public raw<N extends keyof T>(name: N): T[N] {
        return this.fields[name].value.value;
    }

    public onChange(cb: () => void) {
        this.callbacks.push(cb);
    }
}

export type FieldKeys = keyof Fields;

export type Fields = {
    name: string;
    length: number;
    pier_width: string;
    pier_height: number;
    max_height: number;
    panel_height: number;
    panel_thickness: number;
    pier_spacing: 'num_piers' | 'distance' | 'absolute_dist';
    num_piers: number;
    space_betw_piers: number;
    space_betw_piers_abs: number;
    different_final_spacing: 'left' | 'right';
    is_gradient: 'yes' | 'no';
    gradient: number;
    rise: number;
    run: number;
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

export type Depends = string | {field: string, is: string} | All | Some | Not;

export class All {constructor(public deps: Depends[]) {}}
export class Some {constructor(public deps: Depends[]) {}}
export class Not {constructor(public dep: Depends) {}}
export function all(...deps: Depends[]) { return new All(deps); }
export function some(...deps: Depends[]) { return new Some(deps); }
export function not(dep: Depends) { return new Not(dep); }