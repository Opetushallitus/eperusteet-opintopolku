function inject(injector, injectables: Array<any>) {
    let strs = _.clone(injectables);
    let obj: any = {};
    injectables.push(function() {
        _.each(arguments, (arg, idx) => obj[strs[idx]] = arg);
    });
    injector.invoke(injectables);
    return obj;
}
