import { mount, createLocalVue } from '@vue/test-utils';
import EpMultiListSelect from '../EpMultiListSelect.vue';
import { Kielet } from '../../../stores/kieli';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';

describe('EpMultiListSelect component', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(VueI18n);

  const itemMock = [
    {
      value: 'value1',
      text: 'text1',
    },
    {
      value: 'value2',
      text: 'text2',
    }, {
      value: 'value3',
      text: 'text3',
    },
  ];
  const valueMockEmpty = [];
  const valueMock = ['value1', 'value2', 'value3'];
  const valueSingle = 'value1';

  Kielet.install(localVue, {
    messages: {
      fi: {
        'lisaa-tyyppi1': 'lisaa tyyppi',
        'ei-hakutuloksia': 'ei hakutuloksia',
        'ei-vaihtoehtoja': 'ei vaihtoehtoja',
      },
    },
  });

  const i18n = Kielet.i18n;

  function mountWrapper(props : any) {
    return mount(localVue.extend({
      components: {
        EpMultiListSelect,
      },
      data() {
        return props;
      },
      template: `<ep-multi-list-select
                  :value="value"
                  :tyyppi="tyyppi"
                  :items="items"
                  :isEditing="isEditing"
                  @input="update"
                  :validation="validation"
                  :multiple="multiple"
                  :required="required"/>`,
    }), {
      localVue,
      i18n,
      sync: false,
    });
  };

  test('Renders one list with content', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.html()).toContain('text1');
    expect(wrapper.html()).toContain('text2');
    expect(wrapper.html()).toContain('text3');

    expect(wrapper.findAll('.multiselect__element')).toHaveLength(3);

    expect(wrapper.html()).toContain('lisaa tyyppi');
  });

  test('No lists rendered when not required', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: false,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(0);
  });

  test('Renders list when add button pressed', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(1);
    wrapper.find('.lisaa-valinta').trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);
    wrapper.find('.lisaa-valinta').trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(3);
  });

  test('Renders list when lists are removed', async () => {
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueMock,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: () => {},
    });

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(3);

    wrapper.find('.roskalaatikko').trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);

    wrapper.find('.roskalaatikko').trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(1);
  });

  test('Value changed correctly with single select', async () => {
    let values = [];
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(values).toEqual([]);

    wrapper.findAll('.multiselect__element').at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual(['value2']);

    wrapper.findAll('.multiselect__element').at(2)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual(['value3']);
  });

  test('Value changed correctly with multiple selects', async () => {
    let values = [];
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueMockEmpty,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(values).toEqual([]);

    wrapper.find('.lisaa-valinta').trigger('click');
    await localVue.nextTick();

    wrapper.findAll('.multiselect').at(0)
      .findAll('.multiselect__element')
      .at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual(['value2']);

    wrapper.findAll('.multiselect').at(1)
      .findAll('.multiselect__element')
      .at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual(['value2']); // already selected

    wrapper.findAll('.multiselect').at(1)
      .findAll('.multiselect__element')
      .at(2)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual(['value2', 'value3']);
  });

  test('Value changed correctly when removed', async () => {
    let values = ['value1', 'value2'];
    const wrapper = mountWrapper({
      items: itemMock,
      value: values,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(values).toEqual(['value1', 'value2']);
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);

    wrapper.findAll('.roskalaatikko').at(0)
      .trigger('click');
    await localVue.nextTick();

    expect(values).toEqual(['value1']);
  });

  test('Value changed correctly when items changed on fly', async () => {
    let values = ['value1', 'value2'];
    let itemMocks = [
      {
        value: 'value1',
        text: 'text1',
      },
      {
        value: 'value2',
        text: 'text2',
      }, {
        value: 'value3',
        text: 'text3',
      },
    ];
    const wrapper = mountWrapper({
      items: itemMocks,
      value: values,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: true,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(values).toEqual(['value1', 'value2']);
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(2);
    await localVue.nextTick();

    itemMocks = itemMocks.splice(0, 1);

    wrapper.setProps({ items: itemMocks });

    await localVue.nextTick();

    expect(wrapper.findAll('.multiselect__select')).toHaveLength(1);
    expect(values).toEqual(['value2']);
  });

  test('not editable', async () => {
    let values = ['value1', 'value2'];
    const wrapper = mountWrapper({
      items: itemMock,
      value: values,
      isEditing: false,
      required: false,
      tyyppi: 'tyyppi1',
      validation: '',
      multiple: true,
      update: (newValues) => {},
    });

    expect(values).toEqual(['value1', 'value2']);
    expect(wrapper.findAll('.multiselect__select')).toHaveLength(0);
    expect(wrapper.findAll('.roskalaatikko')).toHaveLength(0);
    expect(wrapper.findAll('input')).toHaveLength(0);
    expect(wrapper.findAll('button')).toHaveLength(0);

    expect(wrapper.html()).toContain('text1');
    expect(wrapper.html()).toContain('text2');
  });

  test('Value preserved correctly on editing', async () => {
    let values = null;
    const wrapper = mountWrapper({
      items: itemMock,
      value: valueSingle,
      tyyppi: 'tyyppi1',
      validation: '',
      required: true,
      isEditing: true,
      multiple: false,
      update: (newValues) => {
        values = newValues;
      },
    });

    expect(values).toEqual('value1');

    wrapper.findAll('.multiselect__element').at(1)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual('value2');

    wrapper.findAll('.multiselect__element').at(2)
      .find('.multiselect__option')
      .trigger('click');

    expect(values).toEqual('value3');
  });
});
