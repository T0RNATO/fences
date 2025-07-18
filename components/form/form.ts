export class Form<Fields extends Record<string, string | number>> {
    // @ts-expect-error
    private fields: {[F in keyof Fields]: {
        value: Ref<Fields[F]>,
        valid: ComputedRef<Validity>
    }} = {};
    private callbacks: (() => void)[] = [];

    constructor() {}

    public addField<Name extends keyof Fields>(name: Name, valid: ComputedRef<Validity>, value: Ref<Fields[Name]>) {
        this.fields[name] = {valid, value};
        watch(value, () => {
            for (const cb of this.callbacks) {
                cb();
            }
        })
    }

    public valid(name: keyof Fields) {
        return this.fields[name].valid;
    }

    public value<Name extends keyof Fields>(name: Name): Ref<Fields[Name]> {
        return this.fields[name].value;
    }

    public raw<Name extends keyof Fields>(name: Name): Fields[Name] {
        return this.fields[name].value.value;
    }

    public onChange(cb: () => void) {
        this.callbacks.push(cb);
    }

    public getData(): Fields {
        const data = [];
        for (const [name, v] of Object.entries(this.fields)) {
            const value = v.value.value;
            if (value) {
                data.push([name, value]);
            }
        }
        return Object.fromEntries(data) as Fields;
    }
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