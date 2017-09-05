declare namespace _ {
    interface OwnMixins {
        callAndGive<F>(x: F, ...args: any[]): F;
        print(x: any): any;
        spy<T>(x: T): T;
        print(): any;
        matchStrings(search: string, target: string): boolean;
        fromPairs(x: Array<any>): any;
        append<T>(x: Array<T>, el: T): Array<T>;
        cset<O, P, V>(o: O, p: P): (v: V) => void;
        fromPairs(): any;
    }

    interface LoDashStatic extends OwnMixins {}
    interface LoDashImplicitArrayWrapper<T> extends OwnMixins {}
    interface LoDashImplicitObjectWrapper<T> extends OwnMixins {}
}

_.mixin({
    append: (arr, el) => {
        let result = _.clone(arr);
        result.push(el);
        return result;
    },
    matchStrings: (search: string = "", target: string = "") =>
        !search || (target && target.toLocaleLowerCase().indexOf(search.toLowerCase()) !== -1),
    callAndGive: (f: Function, ...args) => {
        f.apply(undefined, args);
        return f;
    },
    cset: (obj, path) => value => _.set(obj, path, value),
    spy: obj => {
        return obj;
    },
    fromPairs: pairs => {
        let obj: any = {};
        _.each(pairs, pair => {
            if (pair) {
                obj[pair[0]] = pair[1];
            }
        });
        return obj;
    },
    print: array => {
        _.each(array, (v, k) => console.log(_.clone(k), _.clone(v)));
        return array;
    }
});
