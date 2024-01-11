import { mount } from '@vue/test-utils';
import EpPrefixList from './EpPrefixList.vue';

describe('EpPrefixList', () => {
  it('Read-only', () => {
    const wrapper = mount(EpPrefixList, {
      propsData: {
        value: {
          kohde: {
            fi: 'kohde',
          },
          arvot: [{
            fi: 'arvo 1',
          }, {
            fi: 'arvo 2',
          }],
        },
      },
    });
    expect(wrapper.html()).toContain('kohde');
    expect(wrapper.html()).toContain('arvo 1');
    expect(wrapper.html()).toContain('arvo 2');
  });
});
