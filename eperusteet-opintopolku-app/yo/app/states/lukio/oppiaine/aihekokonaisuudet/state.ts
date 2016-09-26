angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.lukio.oppiaine.aihekokonaisuudet', {
    url: '/aihekokonaisuudet',
    templateUrl: 'eperusteet-esitys/views/aihekokonaisuudet.html',
    controller: Controllers.epLukioAihekokonaisuudetController,
    resolve: {
        yleiskuvaus: (LukioYleistiedot, perusteId) =>
            LukioYleistiedot.getAihekokonaisuuksienYleinen({perusteId: perusteId}).$promise,
        aihekokonaisuudet: (LukioYleistiedot, perusteId) =>
            LukioYleistiedot.getAihekokonaisuudet({perusteId: perusteId}).$promise,
    }
}));
