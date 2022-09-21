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

export const koostePerusteStore = {
  'default': (koulutustyyppi): any => new PerusteKoosteStore(koulutustyyppi),
  'koulutustyyppi_muu': null,
};

export const koosteOpasStore = {
  'default': (koulutustyyppi): any => new OpasStore(koulutustyyppi),
  'koulutustyyppi_muu': null,
};

export const koostePaikallinenStore = {
  'tutkintoonvalmentava': (): any => new YleisetPaikallisetStore(),
  'kotoutumiskoulutus': (): any => new YleisetPaikallisetStore(),
  'vapaasivistystyo': (): any => new VapaasivistystyoPaikallisetStore(),
  'muukoulutus': (): any => new YleisetPaikallisetStore(),
  'default': (): any => new YleissivistavatPaikallisetStore(),
};

export const koostePaikallinenComponent = {
  'tutkintoonvalmentava': TuvaPaikalliset,
  'kotoutumiskoulutus': KotoPaikalliset,
  'vapaasivistystyo': VstPaikalliset,
  'muukoulutus': JotpaPaikalliset,
  'default': Paikalliset,
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
