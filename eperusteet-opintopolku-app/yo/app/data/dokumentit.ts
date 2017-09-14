angular.module("app").service("Dokumentit", ($timeout, $stateParams) => {
    function dokumenttiUrlLataaja(Api, id, tyyppi = "peruste", kieli) {
        return async function(scope, target = "dokumenttiUrl", loading = "$$ladataanDokumenttia") {
            scope[loading] = true;
            try {
                const doc = await Api.all("dokumentit").customGET(tyyppi, {
                    perusteId: id,
                    kieli: kieli || $stateParams.lang,
                    suoritustapa: $stateParams.suoritustapa
                });

                if (doc && doc.toString().length > 0) {
                    $timeout(() => {
                        scope[target] = location.origin + "/eperusteet-service/api/dokumentit/" + doc;
                        scope[loading] = false;
                    }, 1000);
                }
                scope[loading] = false;
            } catch (ex) {
                scope[loading] = false;
            }
        };
    }

    return {
        dokumenttiUrlLataaja
    };
});
