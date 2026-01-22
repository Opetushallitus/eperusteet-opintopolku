import RouteAmmatillinenValmisteillaOlevat from './RouteAmmatillinenValmisteillaOlevat.vue';
import { createMount } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { useValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { vi } from 'vitest';

vi.mock('@/stores/ValmisteillaOlevatStore', () => ({
  useValmisteillaOlevatStore: vi.fn(),
}));

describe('RouteAmmatillinenValmisteillaOlevat component', () => {


  test('Renders', async () => {
    (useValmisteillaOlevatStore as any).mockReturnValue({
      perusteet: {
        sivu: 0,
        sivuja: 0,
        sivukoko: 10,
        kokonaismäärä: 0,
        data: [],
      },
      fetch: () => new Promise<void>(resolve => resolve()),
    });

    const wrapper = createMount(RouteAmmatillinenValmisteillaOlevat);
    await nextTick();

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.findAll('.valmisteilla-row')).toHaveLength(0);
  });

  test('valmisteilla data', async () => {
    (useValmisteillaOlevatStore as any).mockReturnValue({
      perusteet:{
        sivu: 0,
        sivuja: 1,
        sivukoko: 10,
        kokonaismäärä: 1,
        data: [
          {
            id: 1,
            nimi: {
              fi: 'perustenimi',
            },
            voimassaoloAlkaa: 1613032868150,
            perusteenAikataulut: [
              {
                id: 2,
                tapahtumapaiva: 1613858400000,
                tavoite: {
                  fi: 'tavoite1',
                },
                julkinen: true,
              },
              {
                id: 3,
                tapahtumapaiva: 1613858400000,
                tavoite: {
                  fi: 'tavoite2',
                },
                julkinen: true,
              },
              {
                id: 3,
                tapahtumapaiva: 1613858400000,
                tavoite: {
                  fi: 'tavoite2',
                },
                julkinen: false,
              },
            ],
          },
        ],
      } as any,
      fetch: () => new Promise<void>(resolve => resolve()),
    });

    const wrapper = createMount(RouteAmmatillinenValmisteillaOlevat);


    await nextTick();

    expect(wrapper.findAll('.valmisteilla-row')).toHaveLength(1);
    const valmisteilla = wrapper.findAll('.valmisteilla-row').at(0);
    expect(valmisteilla.html()).toContain('1613032868150');
    expect(valmisteilla.html()).toContain('nayta-aikataulu');

    valmisteilla.find('.avaa-link')
      .trigger('click');

    await nextTick();

    expect(valmisteilla).not.toContain('nayta-aikataulu');
    expect(valmisteilla.html()).toContain('piilota-aikataulu');

    expect(valmisteilla.findAll('.perusteen-aikataulu')).toHaveLength(2);
    const aikataulurivi1 = valmisteilla.findAll('.perusteen-aikataulu').at(0);
    expect(aikataulurivi1.html()).toContain('1613858400000');
    expect(aikataulurivi1.html()).toContain('tavoite1');
  });
});
