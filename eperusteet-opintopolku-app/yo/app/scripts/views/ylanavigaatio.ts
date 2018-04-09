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
            VirheService,
            YleinenData,
            OpsResource
        ) => {
            $scope.kieli = Kieli.getUiKieli();
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
                        "koulutustyyppi_23",
                        "koulutustyyppi_999907"
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
                } else if ($stateParams.opsId && $state.includes("root.ops.**")) {
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

            // Todo: voisiko tehdä yksinkertaisemmin?
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

            $scope.vaihdaKieli = async uusiKieli => {
                if (uusiKieli !== Kieli.getUiKieli()) {
                    await Kieli.setUiKieli(uusiKieli);
                    Kieli.setSisaltokieli(uusiKieli);
                    $scope.kieli = uusiKieli;

                    $state.go($state.current.name, _.merge($stateParams, { lang: uusiKieli }), {});
                }
            };
        }
    );
