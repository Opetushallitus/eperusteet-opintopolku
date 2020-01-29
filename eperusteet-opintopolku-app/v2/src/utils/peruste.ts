import { PerusteDtoToteutusEnum as PerusteToteutusEnum } from '@shared/generated/eperusteet';
import { PerusteDtoToteutusEnum as YlopsToteutusEnum} from '@shared/generated/ylops';
import { KoulutustyyppiToteutus, Koulutustyyppi } from '@shared/tyypit';

interface HasKoulutustyyppiToteutus {
  koulutustyyppi?: string | null;
  toteutus?: PerusteToteutusEnum | YlopsToteutusEnum | null;
}

export function uusiJulkinenToteutus(hasToteutus: HasKoulutustyyppiToteutus) {
  return !hasToteutus
      || hasToteutus.koulutustyyppi !== Koulutustyyppi.aikuistenperusopetus
      && ((hasToteutus.toteutus === KoulutustyyppiToteutus.yksinkertainen.valueOf()
          && !(hasToteutus.koulutustyyppi === Koulutustyyppi.aikuistenlukiokoulutus
              || hasToteutus.koulutustyyppi === Koulutustyyppi.lukiovalmistavakoulutus))
          || hasToteutus.toteutus === KoulutustyyppiToteutus.lops2019.valueOf()
          || hasToteutus.toteutus === KoulutustyyppiToteutus.lops2019.valueOf()
          || hasToteutus.toteutus === KoulutustyyppiToteutus.tpo.valueOf());
}
