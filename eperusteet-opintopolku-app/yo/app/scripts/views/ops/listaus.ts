namespace Controllers {
    export const ListausController = ($scope, $sessionStorage, JulkisetOps, ListaSorter, opsit, Kaanna, Kieli) => {
        $scope.koulutustyypitLinkit = {
            koulutustyyppi_15: 'esiopetus',
            koulutustyyppi_16: 'perusopetus',
            koulutustyyppi_20: 'esiopetus',
            koulutustyyppi_22: 'perusopetus',
            koulutustyyppi_23: 'lukioopetus',
            koulutustyyppi_2: 'lukioopetus',
            koulutustyyppi_6: 'esiopetus',
        };

        $scope.getKtLinkki = (ops) => $scope.koulutustyypitLinkit[ops.koulutustyyppi];
        $scope.kieli = Kieli.getUiKieli();
        $scope.tarkennettuHaku = $sessionStorage.tarkennettuHaku || false;
        $scope.opsit = opsit;
        $scope.kokonaismaara = $scope.opsit.length;
        $scope.kokonaismaaraOrganisaatiot = _($scope.opsit)
            .map("organisaatiot")
            .flatten()
            .map("oid")
            .uniq()
            .size();

        $scope.sorter = ListaSorter.init($scope);

        $scope.koulutustyypit = Object.keys($scope.koulutustyypitLinkit);

        $scope.hakuparametrit = {};

        // Sivunvaihto
        $scope.nykyinenSivu = 1; // Alkaa ykkösestä, mutta serverillä nollasta
        $scope.sivukoko = 20;
        $scope.opsitAlku = 0;
        $scope.opsitLoppu = $scope.sivukoko;

        $scope.vahdaSivua = function () {
            $scope.opsitAlku = ($scope.nykyinenSivu - 1) * $scope.sivukoko;
            $scope.opsitLoppu = $scope.opsitAlku + $scope.sivukoko;
        };

        $scope.palautaAlinOrganisaatio = function (organisaatiot) {
            var alinOrganisaatio = "";
            _.each(organisaatiot, function (organisaatio) {
                alinOrganisaatio += Kaanna.kaanna(organisaatio.nimi);
                alinOrganisaatio += ", ";
            });
            alinOrganisaatio = alinOrganisaatio.substring(0, alinOrganisaatio.length - 2);
            return alinOrganisaatio;
        };


        $scope.$watch('tarkennettuHaku', function () {
            $sessionStorage.tarkennettuHaku = $scope.tarkennettuHaku;
        });

        $scope.hakuMuuttui = function () {
            // Filteröidään ylimääräiset pois
            $scope.opsit = opsit;

            // Nimi
            var nimi = $scope.hakuparametrit.nimi;

            if (nimi && nimi.length > 0) {
                $scope.opsit = _.filter($scope.opsit, function (ops: any) {
                    if (ops.nimi[$scope.kieli] && _.includes(ops.nimi[$scope.kieli].toLowerCase(), nimi.toLowerCase())) {
                        return ops;
                    }
                });
            }

            // Koulutustyyppi
            var tyyppi = $scope.hakuparametrit.tyyppi;

            if ($scope.tarkennettuHaku && tyyppi && tyyppi.length > 0) {
                $scope.opsit = _.filter($scope.opsit, function (ops: any) {
                    if (ops.koulutustyyppi && ops.koulutustyyppi.toLowerCase() === tyyppi.toLowerCase()) {
                        return ops;
                    }
                });
            }

            // Avainsana
            var avainsana = $scope.hakuparametrit.avainsana;

            if ($scope.tarkennettuHaku && avainsana && avainsana.length > 0) {
                $scope.opsit = _.filter($scope.opsit, function (ops: any) {
                    var loydetty = false;

                    _.each(ops.organisaatiot, function (org: any) {
                        if (org.nimi && org.nimi[$scope.kieli] && _.includes(org.nimi[$scope.kieli].toLowerCase(), avainsana.toLowerCase())) {
                            loydetty = true;
                        }
                    });

                    _.each(ops.kunnat, function (kunta: any) {
                        if (kunta.nimi && kunta.nimi[$scope.kieli] && _.includes(kunta.nimi[$scope.kieli].toLowerCase(), avainsana.toLowerCase())) {
                            loydetty = true;
                        }
                    });

                    if (loydetty) {
                        return ops;
                    }
                });
            }

            // Päivitetään sivuvalikko
            $scope.kokonaismaara = $scope.opsit.length;
        }

        $scope.sorter.set('nimi');
    };
}


// TODO: Refactor
angular.module('app')
.service('ListaSorter', function (Utils) {
    this.init = function ($scope) {
        $scope.nimiSort = Utils.nameSort;
        return {
            key: 'nimi',
            desc: true,
            set: function (key) {
                if (key === $scope.sorter.key) {
                    $scope.sorter.desc = !$scope.sorter.desc;
                } else {
                    $scope.sorter.key = key;
                    $scope.sorter.desc = false;
                }
            },
            fn: function (item) {
                switch($scope.sorter.key) {
                    case 'nimi':
                        return Utils.nameSort(item);
                    case 'oppilaitos':
                        return Utils.nameSort(item);
                    case 'organisaatio':
                        return Utils.nameSort(item);
                    case 'paikkakunta':
                        return Utils.nameSort(item);
                }
            }
        };
    };
})
.service('OpsHaku', function (eperusteetYlopsConfig) {
    var serviceLocation = eperusteetYlopsConfig.getServiceLocation();
    this.ROOT = serviceLocation;
    this.OPETUSSUUNNITELMAT = this.ROOT + "/opetussuunnitelmat";
    this.JULKISET = this.OPETUSSUUNNITELMAT + "/julkiset";
})
.factory('JulkisetOps', function ($resource, OpsHaku) {
    return $resource(OpsHaku.JULKISET, {
    }, {
        method: 'GET',
        isArray: true,
        cache: true
    });
})
.filter('slice', function() {
    return function(arr, start, end) {
        return (arr || []).slice(start, end);
    };
})
