'use strict';

// FIXME: Tee tästä namespace
angular.module("app")
    .service('Varmistusdialogi', ($uibModal) => {

        const dialogi = (options) => {
            return (success, failure) => {
                const resolve = {
                    opts: () => {
                        return {
                            primaryBtn: options.primaryBtn || 'ok',
                            primaryBtnClass: options.primaryBtnClass || '',
                            secondaryBtn: options.secondaryBtn || 'peruuta'
                        };
                    },
                    data: () => options.data || null,
                    otsikko: () => options.otsikko || '',
                    teksti: () => options.teksti || '',
                    htmlSisalto: () => options.htmlSisalto || '',
                    lisaTeksti: () => options.lisaTeksti || '',
                    comment: () => options.comment || ''
                };
                const successCb = success || options.successCb || angular.noop;
                const failureCb = failure || options.failureCb || angular.noop;

                $uibModal.open({
                    templateUrl: "components/varmistusdialogi/varmistusdialogi.jade",
                    controller: 'VarmistusDialogiController',
                    resolve: resolve
                }).result.then(successCb, failureCb);
            };
        };

        return {
            dialogi: dialogi
        };
    })
    .controller('VarmistusDialogiController', ($scope, $uibModalInstance, opts, data, otsikko, teksti,
                                                       htmlSisalto, lisaTeksti, comment) => {
        $scope.opts = opts;
        $scope.otsikko = otsikko;
        $scope.teksti = teksti;
        $scope.htmlSisalto = htmlSisalto;
        $scope.lisaTeksti = lisaTeksti;
        $scope.comment = comment;

        $scope.ok = () => {
            if (data !== null) {
                $uibModalInstance.close(data);
            } else {
                $uibModalInstance.close();
            }
        };

        $scope.peruuta = () => $uibModalInstance.dismiss();
    });
