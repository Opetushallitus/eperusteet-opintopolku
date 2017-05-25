'use strict';

const {
    beforeAll,
    testPerusteCommon,
    withXpath,
} = require('../nwhelpers');

module.exports = {
    before(browser) {
        beforeAll(browser)
            .click('a[ui-sref="root.perusopetus"]')
            .pause(200);
    },

    'Perusopetus - latautuu'
        (browser) {
            testPerusteCommon(browser, 'root.perusopetus', 'Perusopetuksen opetussuunnitelman perusteet 2014');
        },

    'Perusopetus - valikot'
        (browser) {
            const { expect: { element }, click, waitForElementVisible } = browser;
            withXpath(browser, () => click('//a[. = "Oppiaineet"]')
                .click('//a[. = "Palauta valinnat alkutilaan"]')
                .click('//a[. = "Äidinkieli ja kirjallisuus"]')
                .click('//a[. = "Suomen kieli ja kirjallisuus"]')
                .click('//a[. = "Vuosiluokat 3-6"]'));
            element('h3 span[translate="perusopetus-tavoitteet"]').text.to.equal('Oppiaineen tavoitteet');
            withXpath(browser, () => click('//a[. = "Vuosiluokkakokonaisuudet"]'));
        },

    // 'Perusopetus - sisältö'
    //     (browser) {
    //         const { expect: { element }, click, waitForElementVisible } = browser;
    //         // element(by.linkText("Yhteiset osuudet")).click();
    //         // element(by.linkText("Kaksikielinen opetus")).click();
    //         // element(by.css('input[ng-change="changed()"]')).sendKeys("hyvinvointi");
    //         // element(by.linkText("Hyvinvointi ja turvallinen arki")).click();
    //         // element(by.css('span[ng-click="clear()"]')).click();
    //     },

    // 'Perusopetus - vuosiluokkien sisällöt'
    //     (browser) {
    //         const { expect: { element }, click, waitForElementVisible } = browser;
    //         // element(by.linkText("Oppiaineet")).click();
    //         // element(by.linkText("Kuvataide")).click();
    //         // element(by.linkText("Vuosiluokat 3-6")).click();
    //     },

};
