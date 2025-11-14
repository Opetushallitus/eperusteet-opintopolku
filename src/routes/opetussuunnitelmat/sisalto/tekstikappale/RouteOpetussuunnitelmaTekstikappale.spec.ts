import '@/test/testInit';
import RouteOpetussuunnitelmaTekstikappale from './RouteOpetussuunnitelmaTekstikappale.vue';
import * as _ from 'lodash';
import { sassTrue } from 'sass';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { createMount } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { delay } from '@shared/utils/delay';

describe('RouteOpetussuunnitelmaTekstikappale', () => {

  const createOpetussuunnitelmaDataStore = (naytaPerusteenTeksti, naytaPohjanTeksti) => {
    return {
      async fetchOpetussuunnitelma() {},
      perusteTermit: [
        {
          id: 1,
          avain: 'Perusteenterminotsikko1572852406893',
          termi: { fi: 'Perusteen termin otsikko' },
          selitys: { fi: 'Perusteen termin teksti' },
        }, {
          id: 2,
          avain: 'Perusteentermi2notsikko1572852406893',
          termi: { fi: 'Perusteen termin 2 otsikko' },
          selitys: { fi: 'Perusteen termin 2 teksti' },
        },
      ],
      perusteKuvat: [
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
      ],
      termit: [{
        id: 2, // sama id kuin perusteen termissä
        avain: 'b68ae2c2-dbbf-478a-a5be-3cc767a36faa',
        termi: { fi: 'Opsin termin otsikko' },
        selitys: { fi: 'Opsin termin teksti' },
      }, {
        id: 3,
        avain: 'd5e6620f-acc9-4234-b138-9b830cd8e12a',
        termi: { fi: 'Opsin termin 2 otsikko' },
        selitys: { fi: 'Opsin termin 2 teksti' },
      }],
      kuvat:[
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
      ],
      async fetchNavigation() {},
      getJulkaistuSisalto() {
        return {
          id: 1,
          perusteTekstikappaleId: 10,
          tekstiKappale: {
            nimi: { fi: 'tekstikappaleen nimi' } as any,
            teksti: { fi: 'tekstikappaleen teksti<img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917"/><abbr data-viite="b68ae2c2-dbbf-478a-a5be-3cc767a36faa">viite1</abbr>' } as any,
          },
          naytaPerusteenTeksti,
          naytaPohjanTeksti,
          lapset: [
              {
                id: 2,
                perusteTekstikappaleId: 11,
                naytaPerusteenTeksti,
                naytaPohjanTeksti,
                tekstiKappale: {
                  nimi: { fi: 'tekstikappaleen alikappaleen nimi' } as any,
                  teksti: { fi: 'tekstikappaleen alikappaleen teksti<img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896"/><abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>' } as any,
                },
                original: {
                  id: 4,
                  tekstiKappale: {
                    nimi: { fi: 'pohjan alikappaleen nimi' } as any,
                    teksti: { fi: 'pohjan alikappaleen teksti' } as any,
                  },
                  naytaPerusteenTeksti,
                  naytaPohjanTeksti,
                },
              } as any,
              {
                id: 3,
                tekstiKappale: {
                  nimi: { fi: 'tekstikappaleen alikappaleen nimi' } as any,
                  teksti: { fi: 'tekstikappaleen alikappaleen teksti<img data-uid="99959960-fa2c-48a8-8e4c-e52e67b46896"/><abbr data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a">viite2</abbr>' } as any,
                },
              } as any,
          ],
          original: {
            id: 4,
            tekstiKappale: {
              nimi: { fi: 'pohjan tekstikappaleen nimi' } as any,
              teksti: { fi: 'pohjan tekstikappaleen teksti' } as any,
            },
            naytaPerusteenTeksti,
            naytaPohjanTeksti,
            original: {
              id: 5,
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
      },
      getJulkaistuPerusteSisalto() {
        return {
          perusteenOsa: {
            id: 10,
            nimi: { fi: 'perusteen tekstikappaleen nimi' } as any,
            teksti: { fi: 'perusteen tekstikappaleen teksti<img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15"><abbr data-viite="Perusteenterminotsikko1572852406893">perustetermi1</abbr>' } as any,
          },
          lapset: [
            {
              perusteenOsa: {
                id: 11,
                nimi: { fi: 'perusteen alikappaleen nimi' } as any,
                teksti: { fi: 'perusteen alikappaleen teksti<img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3"><abbr data-viite="Perusteentermi2notsikko1572852406893">perustetermi2</abbr>' } as any,
              },
            },
          ],
        };
      },
    };
  };


  function mountWrapper(naytaPerusteenTeksti, naytaPohjanTeksti) {
    (getCachedOpetussuunnitelmaStore as any).mockReturnValue(createOpetussuunnitelmaDataStore(naytaPerusteenTeksti, naytaPohjanTeksti));
    return createMount(RouteOpetussuunnitelmaTekstikappale);
  }

  test('Renders tekstikappaleen sisällöt', async () => {
    const wrapper = mountWrapper(false, false);

    expect(wrapper.findAll('.oph-spinner').length).toEqual(0);

    await nextTick();
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen ja perusteen sisällöt', async () => {
    const wrapper = mountWrapper(true, false);

    await nextTick();
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen ja pohjan sisällöt', async () => {
    const wrapper = mountWrapper(false, true);

    await nextTick();
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('ops2 tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen, pohjan ja perusteen sisällöt', async () => {
    const wrapper = mountWrapper(true, true);

    await nextTick();
    expect(wrapper.html()).not.toContain('perusteen tekstikappaleen nimi');
    expect(wrapper.html()).toContain('perusteen tekstikappaleen teksti');
    expect(wrapper.html()).not.toContain('pohjan tekstikappaleen nimi');
    expect(wrapper.html()).toContain('pohjan tekstikappaleen teksti');
    expect(wrapper.html()).toContain('ops2 tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders tekstikappaleen alikappaleet', async () => {
    const wrapper = mountWrapper(true, true);

    await nextTick();
    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
    expect(wrapper.html()).toContain('tekstikappaleen alikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen alikappaleen teksti');
  });

  test('Renders tekstikappaleen, perusteen ja pohjan alikappaleet', async () => {
    const wrapper = mountWrapper(true, sassTrue);

    // Kappale
    await nextTick();
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

  test('Renders opsin kuvat', async () => {
    const wrapper = mountWrapper(false, false);

    await nextTick();
    expect(wrapper.html()).toContain('<figure><img data-uid="d9dc2bb8-f694-46c9-b2d3-c7ca9b250917" src="eperusteet-ylops-service/api/opetussuunnitelmat/a/kuvat/b" alt="kuvituskuva"></figure>');
    expect(wrapper.html()).toContain('<figure><img data-uid="87259960-fa2c-48a8-8e4c-e52e67b46896" src="eperusteet-ylops-service/api/opetussuunnitelmat/c/kuvat/d" alt="kuvituskuva"></figure>');
  });

  test('Renders perusteen kuvat', async () => {
    const wrapper = mountWrapper(true, false);

    await nextTick();
    expect(wrapper.html()).toContain('<figure><img data-uid="5777d209-1b61-4c48-a59b-9d7077bbfe15" src="eperusteet-service/api/perusteet/a/kuvat/b" alt="kuvituskuva"></figure>');
    expect(wrapper.html()).toContain('<figure><img data-uid="d6e37b6a-1aa9-4a21-b125-55c38a9e25d3" src="eperusteet-service/api/perusteet/c/kuvat/d" alt="kuvituskuva"></figure>');
  });

  test('Renders opsin termit', async () => {
    const wrapper = mountWrapper(true, false);

    await nextTick();
    await nextTick();
    await delay();

    // Testataan haetuilla termien datalla
    expect(wrapper.html()).toContain('<a class="termi" href="javascript:void(0)" data-viite="b68ae2c2-dbbf-478a-a5be-3cc767a36faa" title="Opsin termin otsikko" aria-label="Opsin termin otsikko">viite1</a>');
    expect(wrapper.html()).toContain('<a class="termi" href="javascript:void(0)" data-viite="d5e6620f-acc9-4234-b138-9b830cd8e12a" title="Opsin termin 2 otsikko" aria-label="Opsin termin 2 otsikko">viite2</a>');
  });

  test('Renders perusteen termit', async () => {
    const wrapper = mountWrapper(true, false);

    await nextTick();
    await nextTick();
    await delay();

    // Testataan haetuilla termien datalla

    expect(wrapper.html()).toContain('<a class="termi" href="javascript:void(0)" data-viite="Perusteenterminotsikko1572852406893" title="Perusteen termin otsikko" aria-label="Perusteen termin otsikko">perustetermi1</a>');
    expect(wrapper.html()).toContain('<a class="termi" href="javascript:void(0)" data-viite="Perusteentermi2notsikko1572852406893" title="Perusteen termin 2 otsikko" aria-label="Perusteen termin 2 otsikko">perustetermi2</a>');
  });
});
