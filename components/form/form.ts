export class Form<Fields extends Record<string, string | number>> {
    // @ts-expect-error
    private fields: {[F in keyof Fields]: {
        value: Ref<Fields[F]>,
        valid: ComputedRef<Validity>
    }} = {};
    private callbacks: (() => void)[] = [];

    constructor() {}

    // Internal method. Adds an element to this form.
    public addField<Name extends keyof Fields>(name: Name, valid: ComputedRef<Validity>, value: Ref<Fields[Name]>) {
        if (name in this.fields) {
            // @ts-ignore
            value.value = this.fields[name];
        }
        this.fields[name] = {valid, value};
        watch(value, () => {
            for (const cb of this.callbacks) {
                cb();
            }
        })
    }

    // Returns the ref of if the given element is valid
    public valid(name: keyof Fields) {
        return this.fields[name].valid;
    }

    // Returns the ref of if the given element's value
    public value<Name extends keyof Fields>(name: Name): Ref<Fields[Name]> {
        return this.fields[name].value;
    }

    // Returns the value of the given element
    public raw<Name extends keyof Fields>(name: Name): Fields[Name] {
        return this.fields[name].value.value;
    }

    // Adds a callback for when any element in the form changes
    public onChange(cb: () => void) {
        this.callbacks.push(cb);
    }

    // Bulk-set all values of form elements
    public setValues(fields: Fields) {
        for (const [k,v] of Object.entries(fields) as [keyof Fields, number | string][]) {
            // The sign of a good programmer is a codebase littered with @ts-ignores
            // @ts-ignore
            this.fields[k] = v;
        }
    }

    // Bulk-get all values from form elements to send over the wire
    public getData(): Fields {
        const data = [];
        for (const [name, v] of Object.entries(this.fields)) {
            const value = typeof v === "object" ? v.value.value : v;
            if (value) {
                data.push([name, value]);
            }
        }
        return Object.fromEntries(data) as Fields;
    }
}

// Represents the validity state of a form element
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

    // Validity -> CSS class for styling (red/green underlines, etc)
    export function toClass(val: Validity) {
        return classes[val];
    }
}

// A form element's dependency on another element.
// string: requires that the element of that name is valid
// {field: string, is: string}: requires that given element to have that specific value
// All | Some | Not: groupings of the other two options
export type Depends = string | {field: string, is: string} | All | Some | Not;

// Data containers for complex element dependencies. Self-explanatory names.
class All {constructor(public deps: Depends[]) {}}
class Some {constructor(public deps: Depends[]) {}}
class Not {constructor(public dep: Depends) {}}

export function all(...deps: Depends[]):   All { return new All(deps); }
export function some(...deps: Depends[]): Some { return new Some(deps); }
export function not(dep: Depends):         Not { return new Not(dep); }

// Returns whether a field element's dependency *isn't* satisfied
export function dependencyIsNotSatisfied(form: Form<any>, dep: Depends): boolean {
    if (dep instanceof Some) {
        if (dep.deps.every(dependencyIsNotSatisfied.bind(null, form))) {
            return true;
        }
    } else if (dep instanceof All) {
        if (dep.deps.some(dependencyIsNotSatisfied.bind(null, form))) {
            return true;
        }
    } else if (dep instanceof Not) {
        return !dependencyIsNotSatisfied(form, dep.dep);
    } else if (typeof dep === "string") {
        if (form.valid(dep).value !== Validity.VALID) {
            return true;
        }
    } else if (form.value(dep.field).value !== dep.is) {
        return true;
    }
    return false;
}