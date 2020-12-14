import { PerusteDtoToteutusEnum as PerusteToteutusEnum } from '@shared/generated/eperusteet';
import { PerusteDtoToteutusEnum as YlopsToteutusEnum } from '@shared/generated/ylops';
import { KoulutustyyppiToteutus, Koulutustyyppi } from '@shared/tyypit';
import { koulutustyyppiTheme } from '@shared/utils/perusteet';

interface HasKoulutustyyppiToteutus {
  koulutustyyppi?: string | null;
  toteutus?: PerusteToteutusEnum | YlopsToteutusEnum | null;
}

export function uusiJulkinenToteutus(hasToteutus: HasKoulutustyyppiToteutus) {
  return !hasToteutus
    || ((hasToteutus.toteutus === KoulutustyyppiToteutus.yksinkertainen.valueOf()
        && hasToteutus.koulutustyyppi !== Koulutustyyppi.lukiovalmistavakoulutus)
        || hasToteutus.toteutus === KoulutustyyppiToteutus.lops2019.valueOf()
        || hasToteutus.toteutus === KoulutustyyppiToteutus.lops2019.valueOf()
        || hasToteutus.toteutus === KoulutustyyppiToteutus.tpo.valueOf()
        || hasToteutus.toteutus === KoulutustyyppiToteutus.perusopetus.valueOf()
        || hasToteutus.toteutus === KoulutustyyppiToteutus.vst.valueOf()
        || hasToteutus.koulutustyyppi === Koulutustyyppi.vapaasivistystyo
        || hasToteutus.koulutustyyppi === Koulutustyyppi.aikuistenperusopetus
        || koulutustyyppiTheme(hasToteutus.koulutustyyppi as string) === 'ammatillinen');
}
