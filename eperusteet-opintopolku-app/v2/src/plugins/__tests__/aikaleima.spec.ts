import { createLocalVue, mount } from '@vue/test-utils';
import { i18n, Kielet } from '@/stores/kieli';
import { Kieli } from '@/tyypit';

describe('Plugin aikaleima', () => {
  const localVue = createLocalVue();

  beforeEach(() => {
    // Asetetaan nykyinen aika staattiseksi
    const spy = jest.spyOn(Date, 'now');
    spy.mockImplementation(() => 1546870463248);

    Kielet.setUiKieli(Kieli.fi);
  });

  function mountAikaleima(value: any, func: string) {
    return mount({
      i18n,
      data() {
        return { value };
      },
      template: `<p>{{ ${func} }}</p>`, // Esim. {{ $ago(1546870463248) }}
    }, { localVue });
  }

  test('ldt', () => {
    const wrapper = mountAikaleima(1546870463248, '$ldt(value)');

    expect(wrapper.text()).toEqual('7. tammikuuta 2019, klo 16.14');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('7 januari 2019 kl. 16:14');
  });

  test('ld', () => {
    const wrapper = mountAikaleima(1546870463248, '$ld(value)');

    expect(wrapper.text()).toEqual('7. tammikuuta 2019');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('7 januari 2019');
  });

  test('lt', () => {
    const wrapper = mountAikaleima(1546870463248, '$lt(value)');

    expect(wrapper.text()).toEqual('16:14:23');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('16:14:23');
  });

  test('sdt', () => {
    const wrapper = mountAikaleima(1546870463248, '$sdt(value)');

    expect(wrapper.text()).toEqual('7.1.2019 16:14');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('7.1.2019 16:14');
  });

  test('sd', () => {
    const wrapper = mountAikaleima(1546870463248, '$sd(value)');

    expect(wrapper.text()).toEqual('7.1.2019');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('7.1.2019');
  });

  test('st', () => {
    const wrapper = mountAikaleima(1546870463248, '$st(value)');

    expect(wrapper.text()).toEqual('16:14');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('16:14');
  });

  test('ago', () => {
    const wrapper = mountAikaleima(1546870463248, '$ago(value)');

    expect(wrapper.text()).toEqual('muutama sekunti sitten');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('för några sekunder sedan');
  });

  test('cdt', () => {
    // $cdt(value, 'LLLL')
    const wrapper = mountAikaleima(1546870463248, '$cdt(value, \'LLLL\')');

    expect(wrapper.text()).toEqual('maanantai, 7. tammikuuta 2019, klo 16.14');

    Kielet.setUiKieli(Kieli.sv);
    expect(wrapper.text()).toEqual('måndag 7 januari 2019 kl. 16:14');
  });
});
