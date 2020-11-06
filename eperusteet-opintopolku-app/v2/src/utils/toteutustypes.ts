import { VapaasivistystyoPaikallisetStore } from '@/stores/VapaasivistystyoPaikallisetStore';
import { YleissivistavatPaikallisetStore } from '@/stores/YleissivistavatPaikallisetStore';

export const koostePaikallinenStore = {
  'vapaasivistystyo': (): any => new VapaasivistystyoPaikallisetStore(),
  'default': (): any => new YleissivistavatPaikallisetStore(),
};

export const getKoostePaikallinenStore = (koulutustyyppi) :any => {
  return koostePaikallinenStore[koulutustyyppi] ? koostePaikallinenStore[koulutustyyppi] : koostePaikallinenStore['default'];
};
