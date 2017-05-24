'use strict';

// const a = (v) => v * 2
// const b = (v) => v + 2
// const c = compose(a, b);
// assert(c(2) == 6);
const compose = (...args) => {
    const recurse = (value, first, ...rest) => first ? recurse(first(value), ...rest) : value;
    return (param) => {
        return recurse(param, ...args);
    };
};

// Selaimen alustus ja aloitussivulle meno
const init = (browser) => {
    browser
        .url('http://localhost:2700')
        .waitForElementVisible('body', 1000)
        .pause(200)
        .resizeWindow(1920, 1080)
        .windowMaximize();
    return browser;
};

// Tarkistaa ylävalikon
const checkHeader = (browser) => {
    const { assert } = browser;
    const ylanaviClass = '.ylanavi-container ul.ylanavi-list'; // TODO: Nosta muualle
    assert.visible('footer .alatunniste .opetushallitus-logo');
    assert.containsText(ylanaviClass, 'Esiopetus');
    assert.containsText(ylanaviClass, 'Perusopetus');
    assert.containsText(ylanaviClass, 'Lukiokoulutus');
    assert.containsText(ylanaviClass, 'Ammatillinen peruskoulutus');
    assert.containsText(ylanaviClass, 'Ammatillinen aikuiskoulutus');
    assert.containsText(ylanaviClass, 'Opetussuunnitelmat');
    return browser;
};

// Tarkistaa kielenvaihto-ominaisuudet
const checkLanguageControl = (browser) => {
    const { expect } = browser;
    expect.element('div.header-kielenvaihto').text.to.equal('På svenska');
    return browser;
};

// Jokaisen testitiedoston alussa ajettava
const beforeAll = (browser) => {
    compose(
        init,
        checkHeader,
        checkLanguageControl
    )(browser);
    return browser;
};

// Testaa tietojen ja perusteisiin liittyvien perusominaisuuksien toiminnan
const testPerusteCommon = (browser, state, otsikko) => {
    const { pause, expect: { element }, click, waitForElementVisible, waitForElementPresent } = browser;
    click('a[ui-sref="' + state + '"]');
    pause(200);
    waitForElementPresent('#esitysPrintSisalto', 1000);
    element('#esitysPrintSisalto > h1[esitys-sivu-otsikko]').text.to.equal('Perusteen tiedot');
    element('h1.peruste-otsikko').text.to.equal(otsikko);
    element('span[translate="maarayksen-diaarinumero"]').text.to.equal('Määräyksen diaarinumero');
    return browser;
};

const withXpath = (browser, fn) => fn(browser.useXpath()).useCss();

module.exports = {
    beforeAll,
    checkHeader,
    checkLanguageControl,
    compose,
    init,
    testPerusteCommon,
    withXpath,
};
