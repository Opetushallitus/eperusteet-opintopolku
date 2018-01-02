angular
    .module("app")
    .controller(
        "YlanavigaatioController",
        (
            $rootScope,
            $timeout,
            $scope,
            $state,
            Kieli,
            Perusteet,
            UusimmatPerusteetService,
            Haku,
            $stateParams,
            Kaanna,
            VirheService,
            YleinenData,
            OpsResource
        ) => {
            $scope.kieli = Kieli.getUiKieli();
            $scope.nykyinenTila = $state;
            $scope.navCollapsed = true;
            $scope.state = $state;

            $scope.navCollapse = function() {
                $scope.navCollapsed = !$scope.navCollapsed;
            };

            $scope.urls = {
                eperusteet: {
                    fi: "https://eperusteet.opintopolku.fi/",
                    sv: "https://egrunder.studieinfo.fi/"
                },
                opintopolku: {
                    fi: "https://opintopolku.fi/",
                    sv: "https://studieinfo.fi/"
                }
            };

            Perusteet.get(
                {
                    tyyppi: [
                        "koulutustyyppi_2",
                        "koulutustyyppi_6",
                        "koulutustyyppi_14",
                        "koulutustyyppi_15",
                        "koulutustyyppi_16",
                        "koulutustyyppi_17",
                        "koulutustyyppi_20",
                        "koulutustyyppi_22",
                        "koulutustyyppi_23"

                    ]
                },
                res => {
                    $scope.perusteetGroupByTyyppi = _.groupBy(res.data, "koulutustyyppi");
                },
                err => {
                    console.error(err);
                }
            );

            function getKoulutustyyppi() {
                if ($stateParams.perusteId) {
                    Perusteet.get(
                        { perusteId: $stateParams.perusteId },
                        res => {
                            $scope.selectedKoulutustyyppi = res.koulutustyyppi;
                        },
                        err => {
                            console.error(err);
                        }
                    );
                } else if ($stateParams.opsId) {
                    OpsResource().get(
                        { opsId: $stateParams.opsId },
                        res => {
                            $scope.selectedKoulutustyyppi = res.koulutustyyppi;
                        },
                        err => {
                            console.error(err);
                        }
                    );
                } else {
                    $scope.selectedKoulutustyyppi = null;
                }
            }
            getKoulutustyyppi();

            $scope.selectedPerusteId = $stateParams.perusteId;
            $scope.$on("$stateChangeSuccess", () => {
                // Todo: Should use resolved peruste (not available in this (root) state)
                if ($stateParams.perusteId !== $scope.selectedPerusteId) {
                    getKoulutustyyppi();
                }
                $scope.selectedPerusteId = $stateParams.perusteId;
            });

            $scope.isPerusopetus = () => {
                if (_.includes(YleinenData.perusopetusKoulutustyypit, $scope.selectedKoulutustyyppi)) {
                    return true;
                }
            };

            $scope.isLukioopetus = function() {
                if (_.includes(YleinenData.lukioKoulutustyypit, $scope.selectedKoulutustyyppi)) {
                    return true;
                }
            };

            $scope.isAmmatillinen = function() {
                if ($state.includes("root.amops.**")) {
                    return true;
                }
                if ($state.includes("root.selaus.jarjestajat.**")) {
                    return true;
                }
                if ($state.includes("root.selaus.perusteinfo.**")) {
                    return true;
                }
                if (
                    $state.includes("root.selaus.koostenakyma.**") &&
                    $stateParams.perusteluokitus === "ammatillinenkoulutus"
                ) {
                    return true;
                }
                const uusiAmmatillinen =
                    $state.includes("root.selaus.koostenakyma.**") &&
                    $stateParams.perusteluokitus === "ammatillinenkoulutus";
                if (
                    uusiAmmatillinen ||
                    $state.includes("**.esitys.**") ||
                    $state.includes("root.selaus.ammatillinen")
                ) {
                    return true;
                }
                if (_.includes(YleinenData.ammatillisetKoulutustyypit, $scope.selectedKoulutustyyppi)) {
                    return true;
                }
            };

            // Tiloja vastaavat lokalisointiavaimet
            $scope.valittuOsio = function() {
                if ($state.includes("root.etusivu.**")) {
                    return "navi.etusivu";
                } else if ($state.includes("root.esiopetus.**")) {
                    return "navi.esiopetus";
                } else if ($state.includes("root.tpo.**")) {
                    return "navi.tpo";
                } else if ($state.includes("root.perusopetus.**")) {
                    return "navi.perusopetus";
                } else if ($state.includes("root.varhaiskasvatus.**")) {
                    return "navi.varhaiskasvatus";
                } else if ($state.includes("root.perusvalmistava.**")) {
                    return "navi.perusvalmistava";
                } else if ($state.includes("root.lisaopetus.**")) {
                    return "navi.lisaopetus";
                } else if ($state.includes("root.lukio.**")) {
                    return "navi.lukio";
                } else if ($state.includes("root.tiedote.**")) {
                    return "navi.tiedote";
                } else if ($state.includes("root.esitys.peruste.**")) {
                    return "navi.peruste";
                } else if ($state.includes("root.lukio.**")) {
                    return "navi.lukio";
                } else {
                    return "";
                }
            };

            $scope.valittuOsioNimi = Kaanna.kaanna($scope.valittuOsio());

            $scope.vaihdaKieli = async uusiKieli => {
                if (uusiKieli !== Kieli.getUiKieli()) {
                    await Kieli.setUiKieli(uusiKieli);
                    Kieli.setSisaltokieli(uusiKieli);
                    $scope.kieli = uusiKieli;
                    $scope.valittuOsioNimi = Kaanna.kaanna($scope.valittuOsio());

                    $state.go($state.current.name, _.merge($stateParams, { lang: uusiKieli }), {});
                }
            };
        }
    );
