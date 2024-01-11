import { v4 as genUuid } from 'uuid';

export function generateTemporaryKoodiUri(koodisto: string) {
  return 'temporary_' + koodisto + '_' + genUuid();
}

export enum Koodistot {
  AMMATILLISENOPPIAINEET = 'ammatillisenoppiaineet',
  AMMATTITAITOVAATIMUKSET = 'ammattitaitovaatimukset',
  ARVIOINTIASTEIKKOAMMATILLINEN = 'arviointiasteikkoammatillinen15',
  KIELIKOODISTO_OPETUSHALLINTO = 'kielikoodistoopetushallinto',
  KIELIVALIKOIMA = 'kielivalikoima',
  KOTOUTUMISKOULUTUSTAVOITTEET = 'kotoutumiskoulutustavoitteet',
  KOULUTUKSENOSATTUVA = 'koulutuksenosattuva',
  KOULUTUS = 'koulutus',
  LAAJAALAINENOSAAMINENKOTO2022 = 'laajaalainenosaaminenkoto2022',
  LAAJAALAINENOSAAMINENLOPS2021 = 'laajaalainenosaaminenlops2021',
  MODUULIKOODISTOLOPS2021 = 'moduulikoodistolops2021',
  OPINTOKOKONAISUUSNIMET = 'opintokokonaisuusnimet',
  OPINTOKOKONAISUUSTAVOITTEET = 'opintokokonaisuustavoitteet',
  OPPIAINEETJAOPPIMAARATLOPS2021 = 'oppiaineetjaoppimaaratlops2021',
  OSAAMISALA = 'osaamisala',
  OSAAMISTAVOITTEET = 'osaamistavoitteet',
  TAVOITEALUEET = 'tavoitealueet',
  TAVOITESISALTOALUEENOTSIKKO = 'tavoitesisaltoalueenotsikko',
  TAVOITTEETLUKUTAIDOT = 'tavoitteetlukutaidot',
  TUTKINNONOSAT = 'tutkinnonosat',
  TUTKINTO = 'tutkinto',
  TUTKINTOKOULUTUKSEEN_VALMENTAVAKOULUTUS_LAAJAALAINENOSAAMINEN = 'tutkintokoulutukseenvalmentavakoulutuslaajaalainenosaaminen',
  TUTKINTONIMIKKEET = 'tutkintonimikkeet',
}
