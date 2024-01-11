module OhjeService {
    let i;
    export const init = ($injector) => {
        i = inject($injector, ["$templateCache", "$rootScope", "$state"]);
        helpUpdater();
    };

    const helpUpdater = _.once(() => i.$rootScope.$on("$stateChangeSuccess", (_, state) => updateHelp(state.name)));

    const stateName2Url = (state) =>
        ("misc/guidance/" + state + ".jade").replace(".detail", "");

    export const updateHelp = (state: string) => {
        const templateUrl = stateName2Url(state);
        if (i.$templateCache.get(templateUrl)) {
            i.$rootScope.$broadcast("help:updated", templateUrl);
        }
    };

    export const getHelpTemplates = () => _(i.$state.get())
        .map(state => [state.name, stateName2Url(state.name)])
        .filter(([name, url]) => i.$templateCache.get(url))
        .fromPairs()
        .value();
}

namespace OhjeImpl {
    export const controller = ($scope) => {
        $scope.isOpen = false;
    };

    export const directive = () => {
        return {
            templateUrl: "components/ohje/ohje.jade",
            restrict: "AE",
            scope: {
                teksti: "@",
                otsikko: "@?",
                suunta: "@?",
                ohje: "@?"
            },
            controller: controller
        }
    };

}

angular.module("app")
    .run(OhjeService.init)
    .directive("ohje", OhjeImpl.directive);
