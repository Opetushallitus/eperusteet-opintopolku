/*
 * Copyright (c) 2013 The Finnish Board of Education - Opetushallitus
 *
 * This program is free software: Licensed under the EUPL, Version 1.1 or - as
 * soon as they will be approved by the European Commission - subsequent versions
 * of the EUPL (the "Licence");
 *
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at: http://ec.europa.eu/idabc/eupl
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * European Union Public Licence for more details.
 */

namespace Murupolku {
  const svars = {};

  export const register = (sname, name) => svars[sname] = name;
  export const get = (sname) => _.clone(svars[sname]);
}

angular.module("app")
.config($stateProvider => $stateProvider
.state("root.amops", {
  url: "/amops/:opsId",
  onEnter: (koulutustoimija, ops) => {
    Murupolku.register("root.amops", ops.nimi);
  },
  redirectTo: "root.amops.tiedot",
  resolve: {
    julkinen: (Api) => Api.all("julkinen"),
    ktInfo: (julkinen, $stateParams) => julkinen.one("opetussuunnitelmat", $stateParams.opsId).one("koulutustoimija").get(),
    ktId: (ktInfo) => ktInfo.id,
    koulutustoimija: (julkinen, ktId) => julkinen.all("koulutustoimijat").get(ktId),
    ops: (koulutustoimija, $stateParams) => koulutustoimija.one("opetussuunnitelmat", $stateParams.opsId).get(),
    otsikot: (ops) => ops.all("otsikot").getList(),
    sisaltoRoot: (otsikot) => _.find(otsikot, (tkv: any) => !tkv._vanhempi),
    tekstit: (ops, sisaltoRoot) => ops.one("tekstit", sisaltoRoot.id),
    peruste: ($q, Api, ops) => (ops.tyyppi === "ops" ? Api.all("perusteet").get(ops.peruste.id) : $q.when({})),
    koodisto: (Api) => Api.one("koodisto"),
    paikallisetTutkinnonosatEP: (koulutustoimija) => koulutustoimija.all("tutkinnonosat")
  },
  views: {
    "": {
      templateUrl: "views/amops/view.html",
      controller: ($scope, $state, $stateParams, ops, otsikot, sisaltoRoot, $window, $location, ktId) => {
        $scope.ops = ops;
        $scope.otsikot = otsikot;
        $scope.ktId = ktId;

        $scope.sivunavi = Tekstikappaleet.teeRakenne(Tekstikappaleet.uniikit(otsikot), sisaltoRoot.id);

        $scope.suodata = (search) => {
          if (!!$scope.misc.isSearching !== !_.isEmpty(search)) {
            $scope.misc.isSearching = !_.isEmpty(search);
          }

          Algoritmit.traverse($scope.sivunavi, "lapset", (item) => {
            item.$$hidden = !Algoritmit.match(search, item.$$obj.tekstiKappale.nimi);
            !item.$$hidden && Algoritmit.traverseUp(item, parentItem => parentItem.$$hidden = false);
          });
        };

        $scope.$on("$stateChangeSuccess", (event, toState, toParams, fromState, fromParams) => {
          const path = toState.name.split(".");
          $scope.muruPath = _(_.rest(path)
            .reduce((acc: Array<string>, next: string) =>
              _.append(acc, _.last(acc) + "." + next), ["root"]))
            .reject(state => _.endsWith(state, ".detail"))
            .map($state.get)
            .map((sconfig: any) => ({
              name: Murupolku.get(sconfig.name) || "muru-" + sconfig.name,
              state: sconfig.name + (sconfig.abstract ? ".detail" : "")
            }))
            .value()
            .slice(1);
        });

        $scope.misc = {
          toggleItem: (event, item) => {
            event.stopPropagation();
            item.$$closed = !item.$$closed;
          }
        };

        $scope.menuCollapsed = true;
        $scope.$on("$stateChangeStart", () => {
          $scope.menuCollapsed = true;
        });

        $scope.scrollTop = angular.element($window).scrollTop();
        $scope.toggleSideMenu = () => {
          $scope.menuCollapsed = !$scope.menuCollapsed;
          if (!$scope.menuCollapsed) {
            $scope.scrollTop = angular.element($window).scrollTop();
          }
        };

        $scope.returnToAmosaa = () => {
          let protocol = "https";
          let domain = "virkailija.opintopolku.fi";
          let context = "eperusteet-amosaa-app/";
          if (_.includes(_.words($location.absUrl()), "testi")) {
            domain = "testi.virkailija.opintopolku.fi";
          } else if (_.includes(_.words($location.absUrl()), "localhost")) {
            protocol = "http";
            domain = "localhost:9030";
            context = "";
          }

          $window.location.href = protocol
            + "://"
            + domain + "/"
            + context + "#/"
            + KieliService.getSisaltokieli() + "/koulutustoimija/"
            + $scope.ktId + "/ops/"
            + $scope.ops.id + "/sisalto/tiedot";
        };
      }
    }
  }
}));
