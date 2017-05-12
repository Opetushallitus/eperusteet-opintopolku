angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.aipe.vaihe', {
    url: '/vaiheet/:vaiheId',
    templateUrl: 'eperusteet-esitys/views/vaihe.html',
    controller: (vaihe, $scope, MurupolkuData, oppiaineet, $state) => {
        $scope.vaihe = vaihe;
        $scope.oppiaineet = oppiaineet;
        MurupolkuData.set({ vaiheId: $scope.vaihe.id, vaiheNimi: $scope.vaihe.nimi });
        $scope.isVaihe = () => $state.is('root.aipe.vaihe');
    },
    resolve: {
        vaiheId: $stateParams => $stateParams.vaiheId,
        vaihe: (perusteId, vaiheId, Vaiheet) => Vaiheet.get({
            perusteId: perusteId,
            vaiheId: vaiheId
        }).$promise,
        oppiaineet: (AipeOppiaineet, perusteId, vaiheId) => AipeOppiaineet.query({
            perusteId: perusteId,
            vaiheId: vaiheId
        }).$promise
    }
}));
