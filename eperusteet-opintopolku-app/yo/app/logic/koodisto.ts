namespace Koodisto {
    export const parseRawKoodisto = koodit =>
        _(koodit)
            .flatten()
            .compact()
            .map((koodi: any) => ({
                ...koodi,
                arvo: koodi.koodiArvo,
                uri: koodi.koodiUri,
                nimi: _.zipObject(
                    _.map(koodi.metadata, (meta: any) => meta.kieli.toLowerCase()),
                    _.map(koodi.metadata, "nimi")
                )
            }))
            .value();

    export const mapMetadataToObj = (metadata) =>
        _.zipObject(
            _.map(metadata, (meta: any) => meta.kieli.toLowerCase()),
            _.map(metadata, "nimi"));

    export const paikallinenPrefix = "paikallinen_tutkinnonosa_";

    export const paikallinenToFull = (koulutustoimija, koodiArvo: string) =>
        paikallinenPrefix + koulutustoimija.organisaatio + "_" + koodiArvo;
}
