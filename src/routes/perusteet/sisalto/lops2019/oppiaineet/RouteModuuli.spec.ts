import '@/test/testInit';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import RouteModuuli from './RouteModuuli.vue';
import { createMount } from '@shared/utils/__tests__/stubs';

describe('RouteModuuli', () => {

  test('Renders', async () => {
    const perusteDataStore = {
      getJulkaistuPerusteSisalto: () => {
        return {
          nimi: {
            fi: 'Luvut ja yhtälöt',
          } as any,
          koodi: {
            arvo: 'MAY',
          },
          pakollinen: true,
          laajuus: 2,
          tavoitteet: {
            kohde: {
              fi: 'Tavoitteiden kohde',
            } as any,
            tavoitteet: [
              {
                fi: 'Tavoitteiden tavoite',
              } as any,
            ],
          },
          sisallot: [
            {
              kohde: {
                fi: 'Sisältöjen kohde',
              } as any,
              sisallot: [
                {
                  fi: 'Sisältöjen sisältö',
                } as any,
              ],
            },
          ],
        };
      },
    };

    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = createMount(RouteModuuli as any);

    expect(wrapper.html()).toContain('Luvut ja yhtälöt');
    expect(wrapper.html()).toContain('MAY');
    // expect(wrapper.html()).toContain('pakollinen');
    // expect(wrapper.html()).toContain('<div><strong>laajuus</strong> <p>2</p></div>');
    expect(wrapper.html()).toContain('Tavoitteiden kohde');
    expect(wrapper.html()).toContain('Tavoitteiden tavoite');
    expect(wrapper.html()).toContain('Sisältöjen kohde');
    expect(wrapper.html()).toContain('Sisältöjen sisältö');
  });
});
