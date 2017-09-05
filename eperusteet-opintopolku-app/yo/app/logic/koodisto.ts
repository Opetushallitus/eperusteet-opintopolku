namespace Koodisto {
    export const parseRawKoodisto = koodit =>
        _(koodit)
            .flatten()
            .compact()
            .map((koodi: any) => ({
                arvo: koodi.koodiArvo,
                uri: koodi.koodiUri,
                nimi: _.zipObject(
                    _.map(koodi.metadata, (meta: any) => meta.kieli.toLowerCase()),
                    _.map(koodi.metadata, "nimi")
                )
            }))
            .value();

    export const paikallinenPrefix = "paikallinen_tutkinnonosa_";

    export const paikallinenToFull = (koulutustoimija, koodiArvo: string) =>
        paikallinenPrefix + koulutustoimija.organisaatio + "_" + koodiArvo;
}
