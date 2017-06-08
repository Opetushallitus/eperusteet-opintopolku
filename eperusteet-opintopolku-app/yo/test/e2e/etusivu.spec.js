'use strict';

const {
    beforeAll,
} = require('../nwhelpers');

module.exports = {
    before(browser) {
        beforeAll(browser);
    },

    'Etusivu - elementit'
        (browser) {
            const { assert, expect } = browser;
            assert.title('ePerusteet');
            assert.containsText('.banneri-sisalto h2', 'ePerusteet');
            expect.element('span[translate="etusivu.valtakunnalliset-perusteet"]').text.to.equal('Valtakunnalliset ePerusteet');
            expect.element('span[translate="etusivu.uusimmat-perusteet"]').text.to.equal('Uusimmat ePerusteet');
            expect.element('span[translate="etusivu.uutisia"]').text.to.equal('Uutisia');
        },

    'Etusivu - Footeri'
        (browser) {
            const { assert } = browser;
            assert.visible('footer .alatunniste .opetushallitus-logo');
            assert.containsText('footer', 'Kysy neuvoa - Anna palautetta');
            assert.containsText('footer', 'Tietosuojaseloste');
            assert.containsText('footer', 'Osaan.fi');
            assert.containsText('footer', 'Virkailijanäkymään');
        },

};
