import { VapaasivistystyoPaikallisetStore } from '@/stores/VapaasivistystyoPaikallisetStore';
import { YleissivistavatPaikallisetStore } from '@/stores/YleissivistavatPaikallisetStore';
import Paikalliset from '@/routes/kooste/Paikalliset.vue';
import VstPaikalliset from '@/routes/kooste/VstPaikalliset.vue';
import TuvaPaikalliset from '@/routes/kooste/TuvaPaikalliset.vue';
import KotoPaikalliset from '@/routes/kooste/KotoPaikalliset.vue';
import { YleisetPaikallisetStore } from '@/stores/YleisetPaikallisetStore';

export const koostePaikallinenStore = {
  'tutkintoonvalmentava': (): any => new YleisetPaikallisetStore(),
  'maahanmuuttajienkotoutumiskoulutus': (): any => new YleisetPaikallisetStore(),
  'vapaasivistystyo': (): any => new VapaasivistystyoPaikallisetStore(),
  'default': (): any => new YleissivistavatPaikallisetStore(),
};

export const koostePaikallinenComponent = {
  'tutkintoonvalmentava': TuvaPaikalliset,
  'maahanmuuttajienkotoutumiskoulutus': KotoPaikalliset,
  'vapaasivistystyo': VstPaikalliset,
  'default': Paikalliset,
};

export const getKoostePaikallinenStore = (koulutustyyppi) :any => {
  return koostePaikallinenStore[koulutustyyppi] ? koostePaikallinenStore[koulutustyyppi] : koostePaikallinenStore['default'];
};

export const getKoostePaikallinenComponent = (koulutustyyppi) :any => {
  return koostePaikallinenComponent[koulutustyyppi] ? koostePaikallinenComponent[koulutustyyppi] : koostePaikallinenComponent['default'];
};
