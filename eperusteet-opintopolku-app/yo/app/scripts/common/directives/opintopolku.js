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

'use strict';

epOpintopolkuApp
.directive('opintopolkuHeader', function (MurupolkuData) {
  MurupolkuData.noop(); // remove unused warning
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'views/common/directives/opintopolkuheader.html',
    controller: function ($scope, Kieli) {
      $scope.kieli = Kieli.getUiKieli();
      $scope.other = $scope.kieli === 'fi' ? 'sv' : 'fi';
      $scope.urls = {
        eperusteet: {
          fi: {
            url: 'https://eperusteet.opintopolku.fi/',
            label: 'ePerusteet',
          },
          sv: {
            url: 'https://egrunder.studieinfo.fi/',
            label: 'eGrunder'
          }
        },
        opintopolku: {
          fi: {
            url: 'https://opintopolku.fi/',
            label: 'Opintopolku'
          },
          sv: {
            url: 'https://studieinfo.fi/',
            label: 'Studieinfo'
          }
        }
      };
      $scope.kieliLabel = $scope.kieli === 'fi' ? 'På svenska' : 'Suomeksi';

      $scope.$on('changed:sisaltokieli', function () {
        $scope.kieli = Kieli.getSisaltokieli();
        $scope.other = $scope.kieli === 'fi' ? 'sv' : 'fi';
        $scope.kieliLabel = $scope.kieli === 'fi' ? 'På svenska' : 'Suomeksi';
      });
    }
  };
});
