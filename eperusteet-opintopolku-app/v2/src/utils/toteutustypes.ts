import { VapaasivistystyoPaikallisetStore } from '@/stores/VapaasivistystyoPaikallisetStore';
import { YleissivistavatPaikallisetStore } from '@/stores/YleissivistavatPaikallisetStore';
import Paikalliset from '@/routes/kooste/Paikalliset.vue';
import VstPaikalliset from '@/routes/kooste/VstPaikalliset.vue';

export const koostePaikallinenStore = {
  'vapaasivistystyo': (): any => new VapaasivistystyoPaikallisetStore(),
  'default': (): any => new YleissivistavatPaikallisetStore(),
};

export const koostePaikallinenComponent = {
  'vapaasivistystyo': VstPaikalliset,
  'default': Paikalliset,
};

export const getKoostePaikallinenStore = (koulutustyyppi) :any => {
  return koostePaikallinenStore[koulutustyyppi] ? koostePaikallinenStore[koulutustyyppi] : koostePaikallinenStore['default'];
};

export const getKoostePaikallinenComponent = (koulutustyyppi) :any => {
  return koostePaikallinenComponent[koulutustyyppi] ? koostePaikallinenComponent[koulutustyyppi] : koostePaikallinenComponent['default'];
};
