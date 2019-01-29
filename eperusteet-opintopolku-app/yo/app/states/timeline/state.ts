angular.module("app")
.config($stateProvider =>
$stateProvider.state("root.aikajana", {
    url: "/aikajana",
    templateUrl: "views/aikajana.html",
    resolve: {
        koulutuskoodit: (Api) => Api.all("koodisto/relaatio/sisaltyy-ylakoodit/eqf_4"),
    },
    controller($scope, $timeout, koulutuskoodit) {
        $scope.filters = {
            text: "",
            tulevat: true,
            nykyiset: true,
            vanhentuvat: true,
        };

        $scope.koulutuksetFiltered = null;

        $scope.updateFilters = _.debounce(() => {
            $timeout(() => {
                $scope.koulutuksetFiltered = _.filter($scope.koulutukset, (koulutus: any) => {
                    return Algoritmit.match($scope.filters.text, koulutus.nimi)
                        && $scope.filters[koulutus.group];
                });
            });
        }, 300);

        (async function() {
            const now = new Date();
            const koodit = _(await koulutuskoodit.getList())
                .filter(x => x.voimassaLoppuPvm)
                .take(40)
                .map((x: any) => x.plain())
                .map(x => {
                    const alku = new Date(`${_.random(2014, 2020)}-${_.random(1, 12)}-1`);
                    const loppu =
                        _.random(1, 10) < 4
                            ? null
                            : new Date(`${alku.getFullYear() + _.random(0, 3)}-${_.random(alku.getMonth() + 1, 12)}-1`);;
                    return {
                        ...x,
                        nimi: Koodisto.mapMetadataToObj(x.metadata),
                        voimassaAlkuPvm: alku,
                        voimassaLoppuPvm: loppu,
                    };
                })
                .filter(x => !x.voimassaLoppuPvm || now <= x.voimassaLoppuPvm)
                .sortBy("voimassaAlkuPvm")
                .map(x => {
                    if (x.voimassaAlkuPvm > now) {
                        x.group = "tulevat";
                        x.badgeClass = "success";
                    }
                    else if (x.voimassaLoppuPvm) {
                        x.group = "vanhentuvat";
                        x.badgeClass = "warning";
                    }
                    else {
                        x.group = "nykyiset";
                        x.badgeClass = "primary";
                    }
                    return x;
                })
                .value();
            $scope.koulutukset = koodit;
            $scope.koulutuksetFiltered = $scope.koulutukset;
        }());
    },
}));
