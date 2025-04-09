import '@/config/bootstrap';
import { wrap } from '@shared/utils/jestutils';
import { PerusteStore } from '@/stores/PerusteStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { Lops2019LaajaAlaisetStore } from '@/stores/Lops2019LaajaAlaisetStore';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import { Lops2019ModuuliStore } from '@/stores/Lops2019ModuuliStore';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { OpetussuunnitelmaTekstikappaleStore } from '@/stores/OpetussuunnitelmaTekstikappaleStore';

export const perusteKoosteStoreMock = (config: Partial<PerusteKoosteStore> = {}) => {
  return wrap(PerusteKoosteStore, {
    julkaistutPerusteet: null,
    opetussuunnitelmat: null,
    tiedotteet: null,
    koulutustyyppi: null,
    perusteId: null,
    async reload() {},
    constructor(koulutustyyppi: string) {
      this.state.koulutustyyppi = koulutustyyppi;
    },
    ...config,
  } as PerusteKoosteStore);
};

export const perusteStoreMock = (config: Partial<PerusteStore> = {}) => {
  return wrap(PerusteStore, {
    uusimmat: null,
    perusteet: null,
    async getUusimmat() {},
    async getYleisetPerusteet() {},
    ...config,
  } as PerusteStore);
};

export const tiedoteStoreMock = (config: Partial<TiedoteStore> = {}) => {
  return wrap(TiedoteStore, {
    uusimmatTiedotteet: null,
    async getUusimmat() {},
    ...config,
  } as TiedoteStore);
};

export const perusteDataStoreMock = (config: Partial<PerusteDataStore> = {}) => {
  return wrap(PerusteDataStore, {
    ...config,
  } as PerusteDataStore);
};

export const perusteenOsaStoreMock = (config: Partial<PerusteenOsaStore> = {}) => {
  return wrap(PerusteenOsaStore, {
    ...config,
  } as PerusteenOsaStore);
};

export const lops2019LaajaAlaisetStoreMock = (config: Partial<Lops2019LaajaAlaisetStore> = {}) => {
  return wrap(Lops2019LaajaAlaisetStore, {
    ...config,
  } as Lops2019LaajaAlaisetStore);
};

export const lops2019OppiaineetStoreMock = (config: Partial<Lops2019OppiaineetStore> = {}) => {
  return wrap(Lops2019OppiaineetStore, {
    ...config,
  } as Lops2019OppiaineetStore);
};

export const lops2019OppiaineStoreMock = (config: Partial<Lops2019OppiaineStore> = {}) => {
  return wrap(Lops2019OppiaineStore, {
    ...config,
  } as Lops2019OppiaineStore);
};

export const lops2019ModuuliStoreMock = (config: Partial<Lops2019ModuuliStore> = {}) => {
  return wrap(Lops2019ModuuliStore, {
    ...config,
  } as Lops2019ModuuliStore);
};

export const opetussuunnitelmaDataStoreMock = (config: Partial<OpetussuunnitelmaDataStore> = {}) => {
  return wrap(OpetussuunnitelmaDataStore, config);
};

export const opetussuunnitelmaTekstikappaleStoreMock = (config: Partial<OpetussuunnitelmaTekstikappaleStore> = {}) => {
  return wrap(OpetussuunnitelmaTekstikappaleStore, {
    ...config,
  } as OpetussuunnitelmaTekstikappaleStore);
};
