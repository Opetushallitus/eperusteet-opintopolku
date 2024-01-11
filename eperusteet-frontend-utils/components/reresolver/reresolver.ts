namespace Reresolver {
    let i;
    export const init = ($injector) =>
        i = inject($injector, ["$q"]);


    export const update = (item) => i.$q((resolve, reject) => {
        if (item.restangularized) {
            return (item.restangularCollection ? item.getList() : item.get())
                .then(res => {
                    return resolve(_.merge(item, res))
                });
        }
        else {
            return reject();
        }
    });

}

angular.module("app")
.run(Reresolver.init)
.service('reresolver', ($state, $injector) =>
    (field) => $injector.invoke($state.current.resolve[field]));
