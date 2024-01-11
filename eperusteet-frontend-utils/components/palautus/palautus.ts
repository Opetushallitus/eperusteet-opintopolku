namespace Controllers {
    export const VarmistusDialogiController = ($scope, $uibModalInstance, aikaleima) => {
        $scope.EDITOI_VANHAA = LocalStoragePalautus.EDITOI_VANHAA;
        $scope.POISTA_JA_EDITOI = LocalStoragePalautus.POISTA_JA_EDITOI;
        $scope.EDITOI_UUTTA = LocalStoragePalautus.EDITOI_UUTTA;
        $scope.ok = $uibModalInstance.close;
    };
};


namespace LocalStoragePalautus {
    let i;
    export const init = ($injector) => {
        i = inject($injector, ["$rootScope", "$uibModal", "$q"]);
    };

    export const EDITOI_VANHAA = "editoi-vanhaa";
    export const POISTA_JA_EDITOI = "poista-vanha-ja-editoi-uutta";
    export const EDITOI_UUTTA = "editoi-uutta";

    export const dialogi = (aikaleima) => i.$q((resolve, reject) =>
        i.$uibModal.open({
            templateUrl: "components/palautus/palautus.jade",
            controller: Controllers.VarmistusDialogiController,
            resolve: {
                aikaleima: () => aikaleima
            }
        })
        .result.then(resolve, reject));
};


angular.module("app")
.run(LocalStoragePalautus.init)
