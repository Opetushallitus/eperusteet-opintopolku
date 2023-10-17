import { VapaasivistystyoPaikallisetStore } from '@/stores/VapaasivistystyoPaikallisetStore';
import { YleissivistavatPaikallisetStore } from '@/stores/YleissivistavatPaikallisetStore';
import Paikalliset from '@/routes/kooste/Paikalliset.vue';
import VstPaikalliset from '@/routes/kooste/VstPaikalliset.vue';
import TuvaPaikalliset from '@/routes/kooste/TuvaPaikalliset.vue';
import KotoPaikalliset from '@/routes/kooste/KotoPaikalliset.vue';
import JotpaPaikalliset from '@/routes/kooste/JotpaPaikalliset.vue';
import { YleisetPaikallisetStore } from '@/stores/YleisetPaikallisetStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { OpasStore } from '@/stores/OpasStore';
import { KoosteTiedotteetStore } from '@/stores/KoosteTiedotteetStore';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';

export const koostePerusteStore = {
  'default': (koulutustyyppi): any => new PerusteKoosteStore(koulutustyyppi),
  'koulutustyyppi_muu': null,
};

export const koosteOpasStore = {
  'default': (koulutustyyppi): any => new OpasStore(koulutustyyppi),
};

export const koosteTiedotteetStore = {
  'default': (koulutustyyppi): any => new KoosteTiedotteetStore(koulutustyyppi),
};

export const koostePaikallinenStore = {
  'tutkintoonvalmentava': (): any => new YleisetPaikallisetStore(),
  'kotoutumiskoulutus': (): any => new YleisetPaikallisetStore(),
  'vapaasivistystyo': (): any => new VapaasivistystyoPaikallisetStore(),
  'muukoulutus': (): any => new YleisetPaikallisetStore(),
  'default': (): any => new YleissivistavatPaikallisetStore(),
};

export const koosteOsaamismerkitStore = {
  'vapaasivistystyo': (): any => new OsaamismerkitStore(),
  'default': null,
};

export const koostePaikallinenComponent = {
  'tutkintoonvalmentava': TuvaPaikalliset,
  'kotoutumiskoulutus': KotoPaikalliset,
  'vapaasivistystyo': VstPaikalliset,
  'muukoulutus': JotpaPaikalliset,
  'default': Paikalliset,
};

export const koosteKuvaus = {
  'default': null,
};

export const koosteSubheader = {
  'varhaiskasvatus': 'varhaiskasvatuksen-valtakunnalliset-perusteet',
  'esiopetus': 'esiopetuksen-valtakunnalliset-perusteet',
  'perusopetus': 'perusopetuksen-valtakunnalliset-perusteet',
  'taiteenperusopetus': 'taiteen-valtakunnalliset-perusteet',
  'lukiokoulutus': 'lukiokoulutuksen-valtakunnalliset-perusteet',
  'vapaasivistystyo': 'vapaan-sivistystyon-valtakunnalliset-perusteet',
  'tutkintoonvalmentava': 'tuvan-valtakunnalliset-perusteet',
  'kotoutumiskoulutus': 'kotouttamiskoulutuksen-valtakunnalliset-perusteet',
  'muukoulutus': 'jatkuvan-oppimisen-opetussuunnitelmat',
  'default': null,
};

export const koostePerusteHeader = {
  'vapaasivistystyo': 'valtakunnalliset-perusteet-ja-suositukset',
  'default': 'tile-perusteet',
};

export const getKoostePaikallinenStore = (koulutustyyppi) :any => {
  return koostePaikallinenStore[koulutustyyppi] ? koostePaikallinenStore[koulutustyyppi] : koostePaikallinenStore['default'];
};

export const getKoostePaikallinenComponent = (koulutustyyppi) :any => {
  return koostePaikallinenComponent[koulutustyyppi] ? koostePaikallinenComponent[koulutustyyppi] : koostePaikallinenComponent['default'];
};

export const getKoostePerusteStore = (koulutustyyppi): any => {
  return koostePerusteStore[koulutustyyppi] !== undefined ? koostePerusteStore[koulutustyyppi] : koostePerusteStore['default'](koulutustyyppi);
};

export const getKoosteOpasStore = (koulutustyyppi): any => {
  return koosteOpasStore[koulutustyyppi] !== undefined ? koosteOpasStore[koulutustyyppi] : koosteOpasStore['default'](koulutustyyppi);
};

export const getKoosteTiedotteetStore = (koulutustyyppi): any => {
  return koosteTiedotteetStore[koulutustyyppi] !== undefined ? koosteTiedotteetStore[koulutustyyppi] : koosteTiedotteetStore['default'](koulutustyyppi);
};

export const getOsaamismerkitStore = (koulutustyyppi) :any => {
  return koosteOsaamismerkitStore[koulutustyyppi] ? koosteOsaamismerkitStore[koulutustyyppi] : koosteOsaamismerkitStore['default'];
};

export const getKoosteKuvaus = (koulutustyyppi): any => {
  return koosteKuvaus[koulutustyyppi] !== undefined ? koosteKuvaus[koulutustyyppi] : koosteKuvaus['default'];
};

export const getKoosteSubheader = (koulutustyyppi): any => {
  return koosteSubheader[koulutustyyppi] !== undefined ? koosteSubheader[koulutustyyppi] : koosteSubheader['default'];
};

export const getKoostePerusteHeader = (koulutustyyppi): any => {
  return koostePerusteHeader[koulutustyyppi] !== undefined ? koostePerusteHeader[koulutustyyppi] : koostePerusteHeader['default'];
};
