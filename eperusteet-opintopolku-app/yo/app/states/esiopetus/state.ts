angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esiopetus', {
    url: '/esiopetus/:perusteId',
    templateUrl: 'eperusteet-esitys/views/yksinkertainen.html',
    controller: Controllers.epYksinkertainenPerusteController,
    resolve: {
        perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,
        peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
            !perusteId ? UusimmatPerusteetService.getEsiopetus() : Perusteet.get({ perusteId: perusteId }).$promise,
        sisalto: (serviceConfig, peruste, $q, SuoritustapaSisalto) => {
            if (_.isArray(peruste.data)) {
                peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
            }

            return $q.all([
                peruste,
                peruste.id
                    ? SuoritustapaSisalto.get({perusteId: peruste.id, suoritustapa: 'esiopetus'}).$promise
                    : {}
            ]);
        },

        // FIXME: ?
        koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,
        opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
    }
})
.state('root.esiopetus.tiedot', {
    url: '/tiedot',
    templateUrl: 'eperusteet-esitys/views/tiedot.html',
    controller: Controllers.epEsitysTiedotController,
    resolve: {
        dokumenttiId: (PerusteApi, peruste, $stateParams) =>
        PerusteApi.all('dokumentit').customGET("peruste", {
            perusteId: peruste.id,
            kieli: $stateParams.lang })
    }
})
.state('root.esiopetus.tekstikappale', {
    url: '/tekstikappale/:tekstikappaleId',
    templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
    controller: Controllers.epEsitysSisaltoController,
    resolve: {
        tekstikappaleId: (serviceConfig, $stateParams) => $stateParams.tekstikappaleId,
        tekstikappale: (serviceConfig, tekstikappaleId, PerusteenOsat) =>
            PerusteenOsat.getByViite({viiteId: tekstikappaleId}).$promise,
        lapset: (serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) =>
            epTekstikappaleChildResolver.get(sisalto[1], tekstikappaleId),
    }
}));
