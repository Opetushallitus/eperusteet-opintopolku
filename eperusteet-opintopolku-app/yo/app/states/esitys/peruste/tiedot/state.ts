angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esitys.peruste.tiedot', {
  url: '/tiedot',
  templateUrl: 'eperusteet-esitys/views/tiedot.html',
  controller: Controllers.epEsitysTiedotController,
  resolve: {
    dokumenttiId: (PerusteApi, peruste, $stateParams) => {
      return PerusteApi.all('dokumentit').customGET("peruste", {
        perusteId: peruste.id,
        kieli: $stateParams.lang,
        suoritustapa: $stateParams.suoritustapa
      })
    }
  }
}));
