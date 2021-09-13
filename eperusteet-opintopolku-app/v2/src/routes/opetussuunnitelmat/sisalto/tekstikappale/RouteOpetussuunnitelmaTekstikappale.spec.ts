import { mount, createLocalVue } from '@vue/test-utils';
import RouteOpetussuunnitelmaTekstikappale from './RouteOpetussuunnitelmaTekstikappale.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { opetussuunnitelmaDataStoreMock, opetussuunnitelmaTekstikappaleStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { TekstiKappaleDto } from '@shared/api/ylops';
import * as _ from 'lodash';

describe('RouteOpetussuunnitelmaTekstikappale', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  beforeEach(() => {
    Kielet.setSisaltoKieli(Kieli.fi);
  });

  let naytaPerusteenTeksti = false;
  let naytaPohjanTeksti = false;
  const opetussuunnitelmaDataStore = opetussuunnitelmaDataStoreMock({
    async fetchOpetussuunnitelma() {},
    async fetchPerusteTermit(perusteenId: number) {
      this.perusteTermit = [{
        id: 1,
        avain: 'Perusteenterminotsikko1572852406893',
        termi: { fi: 'Perusteen termin otsikko' },
        selitys: { fi: 'Perusteen termin teksti' },
      }, {
        id: 2,
        avain: 'Perusteentermi2notsikko1572852406893',
        termi: { fi: 'Perusteen termin 2 otsikko' },
        selitys: { fi: 'Perusteen termin 2 teksti' },
      }];
    },
    async fetchPerusteKuvat(perusteenId: number) {
      this.perusteKuvat = [
        {
          id: '5777d209-1b61-4c48-a59b-9d7077bbfe15',
          kuva: {
            id: '5777d209-1b61-4c48-a59b-9d7077bbfe15',
            nimi: 'kuva1.png',
            tyyppi: 'kuva',
            luotu: 1573480668308,
            mime: 'image/png',
          },
          src: 'eperusteet-service/api/perusteet/a/kuvat/b',
        },
        {
          id: 'd6e37b6a-1aa9-4a21-b125-55c38a9e25d3',
          kuva: {
            id: 'd6e37b6a-1aa9-4a21-b125-55c38a9e25d3',
            nimi: 'kuva2.jpg',
            tyyppi: 'kuva',
            luotu: 1573480668308,
            mime: 'image/jpeg',
          },
          src: 'eperusteet-service/api/perusteet/c/kuvat/d',
        },
      ];
    },
    async fetchTermit() {
      this.termit = [{
        id: 2, // sama id kuin perusteen termissä
        avain: 'b68ae2c2-dbbf-478a-a5be-3cc767a36faa',
        termi: { fi: 'Opsin termin otsikko' },
        selitys: { fi: 'Opsin termin teksti' },
      }, {
        id: 3,
        avain: 'd5e6620f-acc9-4234-b138-9b830cd8e12a',
        termi: { fi: 'Opsin termin 2 otsikko' },
        selitys: { fi: 'Opsin termin 2 teksti' },
      }];
    },
    async fetchKuvat() {
      this.kuvat = [
        {
          id: 'd9dc2bb8-f694-46c9-b2d3-c7ca9b250917',
          kuva: {
            id: 'd9dc2bb8-f694-46c9-b2d3-c7ca9b250917',
            tyyppi: 'image/png',
            nimi: 'kuva3',
            luotu: 1574068484973,
          },
          src: 'eperusteet-ylops-service/api/opetussuunnitelmat/a/kuvat/b',
        },
        {
          id: '87259960-fa2c-48a8-8e4c-e52e67b46896',
          kuva: {
            id: '87259960-fa2c-48a8-8e4c-e52e67b46896',
            tyyppi: 'image/jpeg',
            nimi: 'kuva4',
            luotu: 1574068704786,
          },
          src: 'eperusteet-ylops-service/api/opetussuunnitelmat/c/kuvat/d',
        },
      ];
    },
    async fetchNavigation() {},
  });

  const setJulkaisuSisalto = (naytaPerusteenTeksti, naytaPohjanTeksti) => {
    opetussuunnitelmaDataStore.getJulkaistuSisalto = (id) => {
      return id === 3 ? {
        id: 3,
        tekstiKappale: {
          nimi: { fi: 'pohjan alikappaleen nimi' } as any,
          teksti: { fi: 'pohjan alikappaleen teksti' } as any,
          naytaPerusteenTeksti,
          naytaPohjanTeksti,
        },
      } : {
        id: 1,
        tekstiKappale: {
          nimi: { fi: 'tekstikappaleen nimi' } as any,
          teksti: { fi: 'tekstikappaleen teksti<img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917"/><abbr data-viite="b68ae2c2-dbbf-478a-a5be-3cc767a36faa">viite1</abbr>' } as any,
        },
        naytaPerusteenTeksti,
        naytaPohjanTeksti,
        lapset: [
            {
              id: 2,
              tekstiKappale: {
                nimi: { fi: 'tekstikappaleen alikappaleen nimi' } as any,
                teksti: { fi: 'tekstikappaleen alikappaleen teksti<img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896"/><abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>' } as any,
              },
              naytaPerusteenTeksti,
              naytaPohjanTeksti,
              original: {
                id: 3,
                tekstiKappale: {
                  nimi: { fi: 'pohjan alikappaleen nimi' } as any,
                  teksti: { fi: 'pohjan alikappaleen teksti' } as any,
                  naytaPerusteenTeksti,
                  naytaPohjanTeksti,
                },
              },
            } as any,
            {
              id: 3,
              tekstiKappale: {
                nimi: { fi: 'tekstikappaleen alikappaleen nimi' } as any,
                teksti: { fi: 'tekstikappaleen alikappaleen teksti<img data-uid="99959960-fa2c-48a8-8e4c-e52e67b46896"/><abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>' } as any,
              },
              naytaPerusteenTeksti,
              naytaPohjanTeksti,
              original: {
                id: 3,
                tekstiKappale: {
                  nimi: { fi: 'pohjan alikappaleen nimi' } as any,
                  teksti: { fi: 'pohjan alikappaleen teksti' } as any,
                  naytaPerusteenTeksti,
                  naytaPohjanTeksti,
                },
              },
            } as any,
        ],
        original: {
          tekstiKappale: {
            nimi: { fi: 'pohjan tekstikappaleen nimi' } as any,
            teksti: { fi: 'pohjan tekstikappaleen teksti' } as any,
          },
          naytaPerusteenTeksti,
          naytaPohjanTeksti,
          original: {
            tekstiKappale: {
              nimi: { fi: 'ops2 tekstikappaleen nimi' } as any,
              teksti: { fi: 'ops2 tekstikappaleen teksti' } as any,
            },
            naytaPerusteenTeksti,
            naytaPohjanTeksti,
          },
          lapset: [
            {
              id: 3,
              tekstiKappale: {
                nimi: { fi: 'pohjan alikappaleen nimi' } as any,
                teksti: { fi: 'pohjan alikappaleen teksti' } as any,
              },
            },
          ],
        },
      };
    };
  };

  opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto = () => {
    return {
      perusteenOsa: {
        nimi: { fi: 'perusteen tekstikappaleen nimi' } as any,
        teksti: { fi: 'perusteen tekstikappaleen teksti<img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15"><abbr data-viite="Perusteenterminotsikko1572852406893">perustetermi1</abbr>' } as any,
      },
      lapset: [
        {
          perusteenOsa: {
            nimi: { fi: 'perusteen alikappaleen nimi' } as any,
            teksti: { fi: 'perusteen alikappaleen teksti<img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3"><abbr data-viite="Perusteentermi2notsikko1572852406893">perustetermi2</abbr>' } as any,
          },
        },
      ],
    };
  };

  const opetussuunnitelmaTekstikappaleStore = opetussuunnitelmaTekstikappaleStoreMock({
    async fetchPerusteTekstikappale() {
      this.perusteTekstikappaleViite = {
        perusteenOsa: {
          nimi: { fi: 'perusteen tekstikappaleen nimi' } as any,
          teksti: { fi: 'perusteen tekstikappaleen teksti<img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15"><abbr data-viite="Perusteenterminotsikko1572852406893">perustetermi1</abbr>' } as any,
        },
        lapset: [
          {
            perusteenOsa: {
              nimi: { fi: 'perusteen alikappaleen nimi' } as any,
              teksti: { fi: 'perusteen alikappaleen teksti<img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3"><abbr data-viite="Perusteentermi2notsikko1572852406893">perustetermi2</abbr>' } as any,
            },
          },
        ],
      };
    },
    async fetchOriginalTekstikappale() {
      this.tekstiKappaleOriginalViites = [
        {
          tekstiKappale: {
            nimi: { fi: 'pohjan tekstikappaleen nimi' } as any,
            teksti: { fi: 'pohjan tekstikappaleen teksti' } as any,
          },
        }, {
          tekstiKappale: {
            nimi: { fi: 'ops2 tekstikappaleen nimi' } as any,
            teksti: { fi: 'ops2 tekstikappaleen teksti' } as any,
          },
        },
      ];
      this.tekstiKappaleOriginals = _.map(this.tekstiKappaleOriginalViites, 'tekstiKappale') as TekstiKappaleDto[];
    },
    async fetchTekstikappale() {
      this.tekstiKappaleViite = {
        id: 1,
        tekstiKappale: {
          nimi: { fi: 'tekstikappaleen nimi' } as any,
          teksti: { fi: 'tekstikappaleen teksti<img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917"/><abbr data-viite="b68ae2c2-dbbf-478a-a5be-3cc767a36faa">viite1</abbr>' } as any,
        },
        naytaPerusteenTeksti,
        naytaPohjanTeksti,
        lapset: [
          {
            id: 2,
            tekstiKappale: {
              nimi: { fi: 'tekstikappaleen alikappaleen nimi' } as any,
              teksti: { fi: 'tekstikappaleen alikappaleen teksti<img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896"/><abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>' } as any,
            },
            naytaPerusteenTeksti,
            naytaPohjanTeksti,
            _original: 3,
          } as any,
          {
            id: 3,
            tekstiKappale: {
              nimi: { fi: 'tekstikappaleen alikappaleen nimi' } as any,
              teksti: { fi: 'tekstikappaleen alikappaleen teksti<img data-uid="99959960-fa2c-48a8-8e4c-e52e67b46896"/><abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>' } as any,
            },
            naytaPerusteenTeksti,
            naytaPohjanTeksti,
            _original: 3,
          } as any,
        ],
      };
      this.tekstiKappale = this.tekstiKappaleViite.tekstiKappale;
    },
    async fetchOriginalAlikappale(viite: number) {
      return {
        id: 3,
        tekstiKappale: {
          nimi: { fi: 'pohjan alikappaleen nimi' } as any,
          teksti: { fi: 'pohjan alikappaleen teksti' } as any,
        },
      };
    },
  });

  function mountWrapper(propsData) {
    return mount(RouteOpetussuunnitelmaTekstikappale as any, {
      localVue,
      propsData,
      attachToDocument: true,
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
        $route: {
          params: {},
        },
      },
    });
  }

  test('Renders tekstikappaleen sisällöt', async () => {
    const wrapper = mountWrapper({
      opetussuunnitelmaDataStore,
      // opetussuunnitelmaTekstikappaleStore,
    });

    // expect(wrapper.findAll('.oph-spinner').length).toEqual(1);

    naytaPerusteenTeksti = false;
    naytaPohjanTeksti = false;
    await opetussuunnitelmaDataStore.init();
    setJulkaisuSisalto(naytaPerusteenTeksti, naytaPohjanTeksti);

    expect(wrapper.findAll('.oph-spinner').length).toEqual(0);

    naytaPerusteenTeksti = false;
    naytaPohjanTeksti = false;
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen ja perusteen sisällöt', async () => {
    const wrapper = mountWrapper({
      opetussuunnitelmaDataStore,
      opetussuunnitelmaTekstikappaleStore,
    });

    naytaPerusteenTeksti = true;
    naytaPohjanTeksti = false;
    await opetussuunnitelmaDataStore.init();
    setJulkaisuSisalto(naytaPerusteenTeksti, naytaPohjanTeksti);

    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen ja pohjan sisällöt', async () => {
    const wrapper = mountWrapper({
      opetussuunnitelmaDataStore,
      opetussuunnitelmaTekstikappaleStore,
    });

    naytaPerusteenTeksti = false;
    naytaPohjanTeksti = true;
    await opetussuunnitelmaDataStore.init();
    setJulkaisuSisalto(naytaPerusteenTeksti, naytaPohjanTeksti);

    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('ops2 tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen, pohjan ja perusteen sisällöt', async () => {
    const wrapper = mountWrapper({
      opetussuunnitelmaDataStore,
      opetussuunnitelmaTekstikappaleStore,
    });

    naytaPerusteenTeksti = true;
    naytaPohjanTeksti = true;
    await opetussuunnitelmaDataStore.init();
    setJulkaisuSisalto(naytaPerusteenTeksti, naytaPohjanTeksti);

    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('ops2 tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen alikappaleet', async () => {
    const wrapper = mountWrapper({
      opetussuunnitelmaDataStore,
      opetussuunnitelmaTekstikappaleStore,
    });
    naytaPerusteenTeksti = true;
    naytaPohjanTeksti = true;
    await opetussuunnitelmaDataStore.init();
    setJulkaisuSisalto(naytaPerusteenTeksti, naytaPohjanTeksti);

    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen alikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen alikappaleen teksti');
  });

  test('Renders tekstikappaleen, perusteen ja pohjan alikappaleet', async () => {
    const wrapper = mountWrapper({
      opetussuunnitelmaDataStore,
      opetussuunnitelmaTekstikappaleStore,
    });
    naytaPerusteenTeksti = true;
    naytaPohjanTeksti = true;
    await opetussuunnitelmaDataStore.init();
    setJulkaisuSisalto(naytaPerusteenTeksti, naytaPohjanTeksti);

    // Kappale
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('ops2 tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');

    // Alikappale
    expect(wrapper.html()).not.toContain('perusteen  alikappaleen nimi');
    expect(wrapper.html()).toContain('perusteen alikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan alikappaleen nimi');
    expect(wrapper.html()).toContain('pohjan alikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen alikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen alikappaleen teksti');
  });

  // test('Renders opsin kuvat', async () => {
  //   const wrapper = mountWrapper({
  //     opetussuunnitelmaDataStore,
  //     opetussuunnitelmaTekstikappaleStore,
  //   });

  //   naytaPerusteenTeksti = false;
  //   naytaPohjanTeksti = false;
  //   await opetussuunnitelmaTekstikappaleStore.fetchTekstikappaleAll(true);

  //   // Testataan ennen kuvien hakemista
  //   expect(wrapper.html()).toContain('<figure><img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917"></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896"></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="99959960-fa2c-48a8-8e4c-e52e67b46896"></figure>');

  //   await opetussuunnitelmaDataStore.fetchKuvat();

  //   await localVue.nextTick();

  //   // Testataan haetuilla kuvien datalla
  //   // expect(wrapper.html()).toContain('<figure><img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917" src="eperusteet-ylops-service/api/opetussuunnitelmat/a/kuvat/b" alt="kuva3"><figcaption>kuva3</figcaption></figure>');
  //   // expect(wrapper.html()).toContain('<figure><img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896" src="eperusteet-ylops-service/api/opetussuunnitelmat/c/kuvat/d" alt="kuva4"><figcaption>kuva4</figcaption></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917" src="eperusteet-ylops-service/api/opetussuunnitelmat/a/kuvat/b" alt="kuvituskuva"></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896" src="eperusteet-ylops-service/api/opetussuunnitelmat/c/kuvat/d" alt="kuvituskuva"></figure>');
  // });

  // test('Renders perusteen kuvat', async () => {
  //   const wrapper = mountWrapper({
  //     opetussuunnitelmaDataStore,
  //     opetussuunnitelmaTekstikappaleStore,
  //   });

  //   naytaPerusteenTeksti = true;
  //   naytaPohjanTeksti = false;
  //   await opetussuunnitelmaTekstikappaleStore.fetchTekstikappaleAll(true);

  //   // Testataan ennen kuvien hakemista
  //   expect(wrapper.html()).toContain('<figure><img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15"></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3"></figure>');

  //   await opetussuunnitelmaDataStore.fetchPerusteKuvat(0);
  //   await opetussuunnitelmaDataStore.fetchKuvat();

  //   // Testataan haetuilla kuvien datalla
  //   // expect(wrapper.html()).toContain('<figure><img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15" src="eperusteet-service/api/perusteet/a/kuvat/b" alt="kuva1.png"><figcaption>kuva1.png</figcaption></figure>');
  //   // expect(wrapper.html()).toContain('<figure><img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3" src="eperusteet-service/api/perusteet/c/kuvat/d" alt="kuva2.jpg"><figcaption>kuva2.jpg</figcaption></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15" src="eperusteet-service/api/perusteet/a/kuvat/b" alt="kuvituskuva"></figure>');
  //   expect(wrapper.html()).toContain('<figure><img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3" src="eperusteet-service/api/perusteet/c/kuvat/d" alt="kuvituskuva"></figure>');
  // });

  // test('Renders opsin termit', async () => {
  //   const wrapper = mountWrapper({
  //     opetussuunnitelmaDataStore,
  //     opetussuunnitelmaTekstikappaleStore,
  //   });

  //   naytaPerusteenTeksti = false;
  //   naytaPohjanTeksti = false;
  //   await opetussuunnitelmaTekstikappaleStore.fetchTekstikappaleAll(true);

  //   // Testataan ennen termien hakemista
  //   expect(wrapper.html()).toContain('<abbr data-viite="b68ae2c2-dbbf-478a-a5be-3cc767a36faa">viite1</abbr>');
  //   expect(wrapper.html()).toContain('<abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>');

  //   await opetussuunnitelmaDataStore.fetchTermit();

  //   // Testataan haetuilla termien datalla
  //   expect(wrapper.html()).toContain('<abbr data-viite="b68ae2c2-dbbf-478a-a5be-3cc767a36faa" tabindex="0" role="button" title="Opsin termin otsikko">viite1</abbr>');
  //   expect(wrapper.html()).toContain('<abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a" tabindex="0" role="button" title="Opsin termin 2 otsikko">viite2</abbr>');
  // });

  // test('Renders perusteen termit', async () => {
  //   const wrapper = mountWrapper({
  //     opetussuunnitelmaDataStore,
  //     opetussuunnitelmaTekstikappaleStore,
  //   });

  //   naytaPerusteenTeksti = true;
  //   naytaPohjanTeksti = false;
  //   await opetussuunnitelmaTekstikappaleStore.fetchTekstikappaleAll(true);

  //   // Testataan ennen termien hakemista
  //   expect(wrapper.html()).toContain('<abbr data-viite="Perusteenterminotsikko1572852406893">perustetermi1</abbr>');
  //   expect(wrapper.html()).toContain('<abbr data-viite="Perusteentermi2notsikko1572852406893">perustetermi2</abbr>');

  //   await opetussuunnitelmaDataStore.fetchPerusteTermit(0);

  //   // Testataan haetuilla termien datalla
  //   expect(wrapper.html()).toContain('<abbr data-viite="Perusteenterminotsikko1572852406893" tabindex="0" role="button" title="Perusteen termin otsikko">perustetermi1</abbr>');
  //   expect(wrapper.html()).toContain('<abbr data-viite="Perusteentermi2notsikko1572852406893" tabindex="0" role="button" title="Perusteen termin 2 otsikko">perustetermi2</abbr>');
  // });
});
