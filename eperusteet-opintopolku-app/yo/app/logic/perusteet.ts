namespace Perusteet {
    // Choose ops over others
    export const getSuoritustapa = suoritustavat =>
        _.size(suoritustavat) === 1 ? _.first(suoritustavat) : _.find(suoritustavat, { suoritustapakoodi: "ops" });

    export const getTutkinnonOsat = peruste => peruste.tutkinnonOsat;

    export const getRakenne = suoritustapa => suoritustapa.rakenne;

    export const getTosaViitteet = suoritustapa => suoritustapa.tutkinnonOsaViitteet;
}
