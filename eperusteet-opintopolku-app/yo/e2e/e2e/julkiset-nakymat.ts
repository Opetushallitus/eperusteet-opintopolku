const assertFailedHandles = (str: string) => expect(str.startsWith("{{") && str.endsWith("}}")).toBeFalsy();

describe("Sivuston näkymä", () => {
    it("lukiokoulutus latautuu", testView("root.lukio", "Lukion opetussuunnitelman perusteet 2015"));
    it("peruskoulutus latautuu", testView("root.selaus.ammatillinenperuskoulutus", "Ammatillinen peruskoulutus"));
    it("aikuiskoulutus latautuu", testView("root.selaus.ammatillinenaikuiskoulutus", "Ammatillinen aikuiskoulutus"));
    it("opetussuunnitelmat latautuu", testView("root.selaus.ops", "Paikalliset opetussuunnitelmat"));

    it("perusopetuksen sisältö", () => {
        element(by.css('a[ui-sref="root.perusopetus"]')).click();
        element(by.linkText("Oppiaineet")).click();
        element(by.linkText("Vuosiluokkakokonaisuudet")).click();

        element(by.linkText("Yhteiset osuudet")).click();
        element(by.linkText("Kaksikielinen opetus")).click();
        element(by.css('input[ng-change="changed()"]')).sendKeys("hyvinvointi");
        element(by.linkText("Hyvinvointi ja turvallinen arki")).click();
        element(by.css('span[ng-click="clear()"]')).click();

        element(by.linkText("Oppiaineet")).click();
        element(by.linkText("Kuvataide")).click();
        element(by.linkText("Vuosiluokat 3-6")).click();
    });

    it("lukiokoulutuksen sisältö", () => {
        element(by.css('a[ui-sref="root.lukio"]')).click();
        element(by.linkText("Oppiaineet")).click();
        element(by.linkText("Yhteiset osuudet")).click();
        element(by.linkText("Opetuksen toteuttaminen")).click();
        element(by.linkText("Oppimiskäsitys")).click();

        element(by.linkText("Oppiaineet")).click();
        element(by.css('a[ui-sref="root.lukio.oppiaine.tavoitteet"]')).click();
        element(by.css('a[ui-sref="root.lukio.oppiaine.aihekokonaisuudet"]')).click();
        element(by.css('a[ui-sref="root.lukio.oppiaine"]')).click();

        element(by.linkText("Matematiikka")).click();
        element(by.linkText("Matematiikan pitkä oppimäärä")).click();
        element(by.partialLinkText("Lukuteoria ja todistaminen")).click();
    });

    it("ammatillisen sisältö", () => {
        browser.get("http://localhost:9020/#/fi/selaus/ammatillinenperuskoulutus");
        element(by.partialLinkText("Audiovisuaalisen viestinnän perustutkinto")).click();
        element(by.linkText("Tutkinnon muodostuminen")).click();
        element(by.css('input[ng-change="changed()"]')).sendKeys("video");
        element(by.partialLinkText("Video- ja elokuvatuotannon")).click();
    });

});
