import { buildEsikatseluUrl, buildKatseluUrl } from '../esikatselu';

describe('Esikatselu URL', () => {
  function setOrigin(origin) {
    delete window.location;
    window.location = {
      origin,
    } as any;
  }

  test('Localhost buildEsikatseluUrl', () => {
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('http://localhost:9020/#/fi/testi/0');
  });

  test('Localhost buildKatseluUrl postpath', () => {
    const url = buildKatseluUrl('fi', '/testi', 1, '/testi');
    expect(url).toEqual('http://localhost:9020/#/fi/testi/1/testi');
  });

  test('Localhost buildKatseluUrl', () => {
    const url = buildKatseluUrl('fi', '/testi', 1);
    expect(url).toEqual('http://localhost:9020/#/fi/testi/1');
  });

  test('Localhost buildKatseluUrl', () => {
    const url = buildKatseluUrl('fi', '/testi');
    expect(url).toEqual('http://localhost:9020/#/fi/testi');
  });

  test('Production linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/#/fi/testi/0');
  });

  test('QA linkki', () => {
    setOrigin('https://virkailija.testiopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi', '/testi');
    expect(url).toEqual('https://eperusteet.testiopintopolku.fi/#/fi/testi/0/testi');
  });

  test('Hahtuva linkki', () => {
    setOrigin('https://virkailija.hahtuvaopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.hahtuvaopintopolku.fi/#/fi/testi/0');
  });

  test('Untuva linkki', () => {
    setOrigin('https://virkailija.untuvaopintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/testi');
    expect(url).toEqual('https://eperusteet.untuvaopintopolku.fi/#/fi/testi/0');
  });

  test('Kieli linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('sv', '/testi');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/#/sv/testi/0');
  });

  test('Esikatselu linkki', () => {
    setOrigin('https://virkailija.opintopolku.fi');
    const url = buildEsikatseluUrl('fi', '/opetussuunnitelma/1/lukiokoulutus/tiedot');
    expect(url).toEqual('https://eperusteet.opintopolku.fi/#/fi/opetussuunnitelma/1/lukiokoulutus/tiedot/0');
  });
});
