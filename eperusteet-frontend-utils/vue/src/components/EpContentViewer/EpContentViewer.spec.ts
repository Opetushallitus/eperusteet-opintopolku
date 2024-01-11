import { createLocalVue, mount } from '@vue/test-utils';
import EpContentViewer from './EpContentViewer.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import BootstrapVue from 'bootstrap-vue';

describe('EpContentViewer component', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(VueI18n);
  Kielet.install(localVue);

  const i18n = Kielet.i18n;

  function mountWrapper(props: any) {
    return mount(localVue.extend({
      components: {
        EpContentViewer,
      },
      data() {
        return {
          ...props,
        };
      },
      template: '<ep-content-viewer :value="value" :termit="termit" :kuvat="kuvat" />',
    }), {
      localVue,
      i18n,
    });
  }

  test('Renders', () => {
    const wrapper = mountWrapper({
      value: '<p>Lorem ipsum</p>',
      termit: [],
      kuvat: [],
    });

    expect(wrapper.html()).toContain('Lorem ipsum');
  });

  test('Renders image text', () => {
    const wrapper = mountWrapper({
      value: '<p>Lorem ipsum <img data-uid="123-123" alt="kuvateksti" /></p>',
      termit: [],
      kuvat: [{
        src: 'url/osoite',
        id: '123-123',
      }],
    });

    expect(wrapper.findAll('figure')).toHaveLength(1);
    expect(wrapper.find('figure').find('img')
      .html()).toContain('src="url/osoite"');
    expect(wrapper.find('figure').find('figcaption')
      .html()).toContain('kuvateksti');
  });

  // Todo: termit
});
