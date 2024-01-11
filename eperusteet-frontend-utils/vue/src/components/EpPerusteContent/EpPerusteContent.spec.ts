import { mount, createLocalVue } from '@vue/test-utils';
import EpPerusteContent from './EpPerusteContent.vue';
import { mocks } from '../../utils/jestutils';

describe('EpPerusteContent', () => {
  const localVue = createLocalVue();

  const options = (data) => {
    return {
      propsData: {
        ...data,
      },
      mocks: mocks,
      localVue,
    };
  };

  it('Read-only', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      perusteObject: {
        otsikko: {
          fi: 'otsikko1',
        },
        teksti: {
          fi: '<p>teksti1</p>',
        },
      },
      object: {
        teksti: {
          fi: 'teksti2',
        },
      },
    }));

    await localVue.nextTick();
    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('teksti1');
    expect(wrapper.html()).toContain('teksti2');
  });

  it('Read-only - no perusteobject', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      object: {
        teksti: {
          fi: 'teksti2',
        },
      },
    }));

    await localVue.nextTick();
    expect(wrapper.html()).not.toContain('perusteen-teksti');
    expect(wrapper.html()).toContain('teksti2');
  });

  it('No local text', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      perusteObject: {
        otsikko: {
          fi: 'otsikko1',
        },
        teksti: {
          fi: '<p>teksti1</p>',
        },
      },
      object: {
      },
    }));

    await localVue.nextTick();
    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('teksti1');

    expect(wrapper.html()).toContain('paikallista-sisaltoa-ei-maaritetty');
  });

  it('No local text - editing', async () => {
    const wrapper = mount(EpPerusteContent, options({
      perusteTekstiAvattu: true,
      isEditing: true,
      perusteObject: {
        otsikko: {
          fi: 'otsikko1',
        },
        teksti: {
          fi: '<p>teksti1</p>',
        },
      },
      object: {
      },
    }));

    await localVue.nextTick();
    expect(wrapper.html()).toContain('otsikko1');
    expect(wrapper.html()).toContain('teksti1');

    expect(wrapper.html()).not.toContain('paikallista-sisaltoa-ei-maaritetty');
  });
});
