namespace Tekstikappaleet {
    export const suorituspolut = (tekstikappaleviitteet: Array<any>) =>
        _.find(tekstikappaleviitteet, tkv => tkv.tyyppi === "suorituspolut");

    export const tutkinnonosat = (tekstikappaleviitteet: Array<any>) =>
        _.find(tekstikappaleviitteet, tkv => tkv.tyyppi === "tutkinnonosat");

    export const root = (tekstikappaleviitteet: Array<any>) => _.find(tekstikappaleviitteet, tkv => !tkv._vanhempi);

    export const uniikit = (tekstikappaleviitteet: Array<any>) => _.indexBy(tekstikappaleviitteet, "id");

    export const teeRakenne = (tekstikappaleviitteet, id: number | string, depth = 0) => ({
        id: id,
        $$depth: depth,
        $$obj: tekstikappaleviitteet[id],
        $$closed: false,
        lapset: _.map(tekstikappaleviitteet[id].lapset, (lapsiId: number) =>
            teeRakenne(tekstikappaleviitteet, lapsiId, depth + 1)
        )
    });
}
