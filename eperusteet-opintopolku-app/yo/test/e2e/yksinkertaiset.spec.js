'use strict';

const {
    beforeAll,
    testPerusteCommon,
} = require('../nwhelpers');

module.exports = {
    before(browser) {
        beforeAll(browser);
    },

    'Esiopetus - latautuu'
        (browser) {
            testPerusteCommon(browser, 'root.esiopetus', 'Esiopetuksen opetussuunnitelman perusteet 2014');
        },

};
