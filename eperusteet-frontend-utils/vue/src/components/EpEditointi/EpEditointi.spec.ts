import { mount, createLocalVue } from '@vue/test-utils';
import { reactive, computed } from '@vue/composition-api';
import EpEditointi from './EpEditointi.vue';
import { IEditoitava } from './EditointiStore';
import { Kielet } from '../../stores/kieli';
import _ from 'lodash';
import { Oikeustarkastelu } from '../../plugins/oikeustarkastelu';
import { VueTutorial } from '../../plugins/tutoriaali';
import { delay } from '../../utils/delay';
import { tutoriaaliStore } from '../../stores/tutoriaali';
import { findContaining, mockEditointiStore } from '../../utils/jestutils';
import VueI18n from 'vue-i18n';

import '../../config/bootstrap';

function mockAndWrapper(extension: Partial<IEditoitava> = {}, template?: string) {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(Kielet, {
    messages: {
      fi: {
        'valitse-pvm': 'valitse-pvm',
        'valitse-pvm-jana': 'valitse-pvm-jana',
      },
    },
  });
  localVue.use(VueTutorial, { tutoriaaliStore });
  localVue.use(Oikeustarkastelu, {
    oikeusProvider: {
      async hasOikeus() {
        return true;
      },
    },
  });

  const { store, config } = mockEditointiStore({
    load: jest.fn(async () => {
      return {
        name: 'foo',
        description: 'xyz',
      };
    }),
    ...extension,
  });

  const wrapper = mount({
    components: {
      EpEditointi,
    },
    data() {
      return {
        store,
      };
    },
    template: template || `
      <div>
        <ep-editointi :store="store">
          <template v-slot:header="{ data, isEditing }">
            <h1>{{ data.name }}</h1>
          </template>
          <template v-slot:default="{ data, supportData, isEditing }">
            <p>{{ data.description }}</p>
            <pre>{{ supportData }}</pre>
          </template>
        </ep-editointi>
      </div>
    `,
  } as any, {
    localVue,
    mocks: {
      $success: _.noop,
      $t: x => x,
      $sdt: x => '[' + x + ']',
    },
  } as any);

  return { localVue, store, config, wrapper };
}

describe('EpEditointi component', () => {
  test('Renders header and content', async () => {
    const { store, config, wrapper } = mockAndWrapper();
    await delay();
    expect(config.load).toBeCalledTimes(1);
    expect(config.lock).toBeCalledTimes(1);
    expect(config.revisions).toBeCalledTimes(1);
    expect(config.start).toBeCalledTimes(0);
    expect(config.acquire).toBeCalledTimes(0);
    expect(config.cancel).toBeCalledTimes(0);
    expect(config.editAfterLoad).toBeCalledTimes(1);
    expect(wrapper.html()).toContain('<h1>foo</h1>');
    expect(wrapper.html()).toContain('<p>xyz</p>');
  });

  test('Can edit after create', async () => {
    const { store, config, wrapper } = mockAndWrapper({
      async editAfterLoad() {
        return true;
      },
    });
    await delay();
    expect(config.start).toBeCalledTimes(1);
    findContaining(wrapper, 'button', 'peruuta')!.trigger('click');
    await delay();
  });

  test('Can add additional data', async () => {
    const data = { name: 'name' };
    const { store, config, wrapper } = mockAndWrapper({
      async editAfterLoad() {
        return true;
      },
      save: jest.fn(async () => { }),
      load: jest.fn(async (supportFn) => {
        supportFn({
          testi: 123,
        });
        return {
          name: 456,
          description: 789,
        };
      }),
    });
    await delay();
    expect(wrapper.html()).toContain('123');
    expect(wrapper.html()).toContain('456');
    expect(wrapper.html()).toContain('789');
    await delay();
  });

  test('Can save', async () => {
    const data = { name: 'name' };
    const { store, config, wrapper } = mockAndWrapper({
      async editAfterLoad() {
        return true;
      },
      save: jest.fn(async () => {
        data.name = 'uusi';
      }),
      load: jest.fn(async () => data),
    });
    await delay();
    findContaining(wrapper, 'button', 'tallenna')!.trigger('click');
    await delay();
    expect(config.start).toBeCalledTimes(1);
    expect(config.save).toBeCalledTimes(1);
    expect(config.release).toBeCalledTimes(1);
    expect(store.data.value.name).toContain('uusi');
  });

  test('Shows latest revision info', async () => {
    const data = { name: 'name' };
    const { store, config, wrapper } = mockAndWrapper({
      revisions: jest.fn(async () => [{
        numero: 1,
        pvm: new Date(),
        muokkaajaOid: 'muokkaajaOid1234',
        kutsumanimi: 'etunimi',
        sukunimi: 'sukunimi',
      }]),
    });
    await delay();
    expect(wrapper.html()).toContain('etunimi sukunimi');
  });

  test('Feature picking', async () => {
    const features = reactive({
      editable: false,
      removable: false,
      lockable: false,
      validated: false,
      recoverable: false,
    });

    const { localVue, store, config, wrapper } = mockAndWrapper({
      features: () => {
        return computed(() => features);
      },
    }, `
      <ep-editointi :store="store">
        <template v-slot:default="{ data, isEditing }">
          <input v-model="data.name" />
          <pre>editing {{ isEditing }}</pre>
        </template>
      </ep-editointi>
    `);
    await delay();
    expect(findContaining(wrapper, 'button', 'muokkaa')).toBeNull();

    features.editable = true;
    await delay();
    expect(findContaining(wrapper, 'button', 'muokkaa')).toBeTruthy();
  });

  test('Can start and cancel editing', async () => {
    const { localVue, store, config, wrapper } = mockAndWrapper({}, `
      <ep-editointi :store="store">
        <template v-slot:default="{ data, isEditing }">
          <input v-model="data.name" />
          <pre>editing {{ isEditing }}</pre>
        </template>
      </ep-editointi>
    `);
    await delay();

    expect(wrapper.html()).toContain('<pre>editing false</pre>');
    findContaining(wrapper, 'button', 'muokkaa')!.trigger('click');
    await delay();

    wrapper.find('input').setValue('uusi nimi');
    expect(store.data.value.name).toEqual('uusi nimi');
    expect(config.start).toBeCalledTimes(1);
    expect(config.acquire).toBeCalledTimes(1);
    expect(wrapper.html()).toContain('<pre>editing true</pre>');

    findContaining(wrapper, 'button', 'peruuta')!.trigger('click');
    await delay();
    expect(config.release).toBeCalledTimes(1);
    expect(config.cancel).toBeCalledTimes(1);
    expect(store.data.value.name).toEqual('foo');
  });
});
