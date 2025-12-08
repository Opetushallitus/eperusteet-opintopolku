# Vuebootstrap Migration Checklist

This checklist tracks the progress of migrating from bootstrap-vue to custom ep- components.

## Component Development Progress

### Phase 1: Foundation (Critical Components)

- [ ] **ep-container**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: fluid

- [ ] **ep-row**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Flexbox layout support

- [ ] **ep-col**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: md, lg, sm, xs, cols

- [ ] **ep-table**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: items, fields, striped, fixed, responsive, hover
  - [ ] Slots: cell(fieldName), head(fieldName)
  - [ ] Sorting functionality
  - [ ] Filtering functionality

- [ ] **ep-modal**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: id, size, static, lazy, no-enforce-focus
  - [ ] Slots: modal-header, modal-footer, default
  - [ ] Focus trap
  - [ ] ESC key handling
  - [ ] Backdrop click handling

- [ ] **v-ep-modal directive**
  - [ ] Directive implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Modal trigger functionality

- [ ] **ep-pagination (fix EpBPagination)**
  - [ ] Remove b-pagination dependency
  - [ ] Pure Vue 3 implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Maintain existing API
  - [ ] Accessibility (ARIA labels)

### Phase 2: Forms (High Priority)

- [ ] **ep-form-group**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: label, label-for, description
  - [ ] Validation state display

- [ ] **ep-form-input**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: modelValue, type, placeholder, disabled
  - [ ] v-model support
  - [ ] Input types: text, email, password, number, etc.

- [ ] **ep-form-checkbox**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: modelValue, value, disabled
  - [ ] v-model support

### Phase 3: Navigation (High Priority)

- [ ] **ep-tabs**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: modelValue, card, pills
  - [ ] Tab navigation
  - [ ] Keyboard navigation

- [ ] **ep-tab**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: title, disabled, active
  - [ ] Lazy loading support

- [ ] **ep-dropdown**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: text, variant, size
  - [ ] Click outside handling
  - [ ] Keyboard navigation

- [ ] **ep-dropdown-item**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: disabled, active
  - [ ] Router link support

- [ ] **ep-dropdown-item-button**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: disabled

### Phase 4: Verify Existing Components

- [ ] **ep-button (EpButton)**
  - [ ] Audit component
  - [ ] Check for b-button dependency
  - [ ] Refactor if needed
  - [ ] Update tests
  - [ ] Update documentation

- [ ] **ep-collapse (EpCollapse)**
  - [ ] Audit component
  - [ ] Check for b-collapse dependency
  - [ ] Refactor if needed
  - [ ] Update tests
  - [ ] Update documentation

- [ ] **v-ep-toggle directive**
  - [ ] Create directive (if not exists)
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Toggle functionality

- [ ] **ep-alert (EpAlert)**
  - [ ] Audit component
  - [ ] Check for b-alert dependency
  - [ ] Refactor if needed
  - [ ] Update tests
  - [ ] Update documentation

- [ ] **ep-spinner (EpSpinner)**
  - [ ] Audit component
  - [ ] Check for b-spinner dependency
  - [ ] Refactor if needed
  - [ ] Update tests
  - [ ] Update documentation

- [ ] **ep-link (EpLinkki)**
  - [ ] Audit component
  - [ ] Check for b-link dependency
  - [ ] Refactor if needed
  - [ ] Update tests
  - [ ] Update documentation

### Phase 5: Utility Components (Medium/Low Priority)

- [ ] **ep-popover**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: title, content, placement, trigger
  - [ ] Portal/Teleport usage

- [ ] **v-ep-popover directive**
  - [ ] Directive implementation
  - [ ] Unit tests
  - [ ] Documentation

- [ ] **ep-tooltip**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: content, placement
  - [ ] Portal/Teleport usage

- [ ] **v-ep-tooltip directive**
  - [ ] Directive implementation
  - [ ] Unit tests
  - [ ] Documentation

- [ ] **ep-badge**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: variant, pill

- [ ] **ep-img**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: src, alt, fluid, thumbnail
  - [ ] Lazy loading

- [ ] **ep-list-group**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: flush

- [ ] **ep-list-group-item**
  - [ ] Component implementation
  - [ ] Unit tests
  - [ ] Documentation
  - [ ] Props: active, disabled

## File Migration Progress

### Layout Components Migration (b-container, b-row, b-col)

#### Application Files (src/)
- [ ] src/routes/kooste/RouteKoosteAmmatillinen.vue
- [ ] src/routes/kooste/RouteKooste.vue
- [ ] src/routes/home/RouteHome.vue
- [ ] src/routes/ammatillinen/RouteKoulutuksenJarjestaja.vue
- [ ] src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOsaamismerkki.vue
- [ ] src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOpintokokonaisuus.vue
- [ ] src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue
- [ ] src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen.vue
- [ ] src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaSuorituspolku.vue
- [ ] src/components/EpToteutussuunnitelma/EpToteutukset.vue
- [ ] src/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoLaajaAlainenOsaaminen.vue
- [ ] src/routes/perusteet/sisalto/tutkintoonvalmentava/RouteKoulutuksenOsa.vue

#### Shared Components (eperusteet-frontend-utils/vue/src/)
- [ ] eperusteet-frontend-utils/vue/src/components/EpKotoTaitotasot/EpKotoTaitotasot.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpOsaamiskokonaisuus/EpOsaAlueSisalto.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpOsaamiskokonaisuus/EpOsaAlue.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTavoitesisaltoalue/EpTavoitesisaltoalueTavoitealueet.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTavoitesisaltoalue/EpTavoitealueTavoitteet.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTavoitesisaltoalue/EpTavoitealueKeskeisetSisaltoalueet.vue

### Table Components Migration (b-table)

- [ ] src/routes/perusteet/tiedot/RoutePerusteTiedot.vue (multiple tables)
- [ ] src/routes/perusteet/tiedot/RoutePerusteKoosteEng.vue (multiple tables)
- [ ] src/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaTutkinnonosat.vue
- [ ] src/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaSuorituspolut.vue
- [ ] src/routes/perusteet/sisalto/ammatillinen/RouteTutkinnonosat.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpKoodistoSelect/EpKoodistoSelectTable.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpPoistettuTable/PoistetutTable.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTutkinnonosa/Arviointi2020Taulukko.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTutkinnonosa/GeneerinenArviointiTaulukko.vue
- [ ] src/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpArvioinninkohteetTable/EpArvioinninkohteetTable.vue

### Modal Components Migration (b-modal, v-b-modal)

- [ ] eperusteet-frontend-utils/vue/src/components/EpTiedoteModal/EpTiedoteModal.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpEditointi/EpVersioModaali.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTekstikappaleLisays/EpTekstikappaleLisays.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpArkistoidutModal/EpArkistoidutModal.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpContent/LinkModal.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpContent/ImageModal.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpAikataulu/EpAikatauluModal.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpConfirmDialog/EpConfirmDialog.vue

### Form Components Migration (b-form-group, b-form-input, b-form-checkbox)

- [ ] src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue
- [ ] src/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuusPaaAlue.vue
- [ ] src/routes/perusteet/sisalto/tutkintoonvalmentava/RouteKoulutuksenOsa.vue
- [ ] src/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoLaajaAlainenOsaaminen.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTiedoteModal/EpTiedoteModal.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpToggleGroup.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpToggle.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpSelect.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpList.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpErrorWrapper.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpDatepicker.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpKoodistoSelect/EpKoodistoSelect.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpArviointi/OsaamistasonKriteeri.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpArviointi/EpArviointi.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpAmmattitaitovaatimukset/VaatimusField.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpAmmattitaitovaatimukset/Kayttolistaus.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue

### Tabs Components Migration (b-tabs, b-tab)

- [ ] src/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusOppiaine.vue
- [ ] src/routes/opetussuunnitelmat/sisalto/perusopetus/OppiaineenVuosiluokkakokonaisuus.vue
- [ ] src/routes/perusteet/sisalto/perusopetus/RoutePerusopetusOppiaine.vue
- [ ] src/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuus.vue
- [ ] eperusteet-frontend-utils/vue/src/components/forms/EpToggle.vue

### Dropdown Components Migration (b-dropdown)

- [ ] eperusteet-frontend-utils/vue/src/components/lops2019/EpOpintojaksonLaajaAlaisetOsaamiset.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpNavbar/EpNavbar.vue

### Pagination Migration (Update EpBPagination)

- [ ] eperusteet-frontend-utils/vue/src/components/EpBPagination/EpBPagination.vue (remove b-pagination)
- [ ] Verify all files using EpBPagination still work

### Button Migration (Verify EpButton)

- [ ] eperusteet-frontend-utils/vue/src/components/EpButton/EpButton.vue
- [ ] Verify no b-button usage

### Collapse Migration (Verify EpCollapse + v-b-toggle)

- [ ] eperusteet-frontend-utils/vue/src/components/EpCollapse/EpCollapse.vue
- [ ] src/components/EpJulkinenSidenav/EpJulkinenSidenav.vue (v-b-toggle)
- [ ] eperusteet-frontend-utils/vue/src/components/EpNavbar/EpNavbar.vue (v-b-toggle)

### Popover Components (b-popover)

- [ ] eperusteet-frontend-utils/vue/src/components/EpValidPopover/EpValidPopover.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpInfoPopover/EpInfoPopover.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpProgressPopover/EpProgressPopover.vue

### Other Components

- [ ] eperusteet-frontend-utils/vue/src/components/EpPagination/EpPagination.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTreeNavibar/EpTreeNavibar.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTreeNavibar/EpNavigationPostFix.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTreeNavibar/EpNavigationLabel.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpNavigation/EpNavigation.vue
- [ ] src/routes/uutiset/UutisenKoodit.vue
- [ ] src/routes/uutiset/RouteUutiset.vue
- [ ] src/routes/maarays/RouteMaarays.vue
- [ ] src/components/EpSidenav/EpSidenavNode.vue
- [ ] src/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue
- [ ] src/components/EpPerusteSidenav/EpPerusteSidenavNode.vue
- [ ] src/components/EpOpetussuunnitelmaSidenav/EpOpetussuunnitelmaSidenavNode.vue
- [ ] src/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpAmmatillinenArvioinninKohdealueet/EpAmmatillinenArvioinninKohdealueet.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpSortableTextList/EpSortableTextList.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTiedostoLataus/EpTiedostoLataus.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpTiedosto/EpTiedostoInput.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpOsaamistavoite/Osaamistavoite.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpKoulutuksenJarjestajaSelect/EpKoulutuksenJarjestajaSelect.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpKielivalinta/EpKielivalinta.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpKayttaja/EpKayttaja.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpEditointi/EpEditointi.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpContentViewer/EpContentViewer.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpContent/tiptap1/TermiEditorTiptap1.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpContent/tiptap1/EpEditorMenuBarTiptap1.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpColorIndicator/EpColorIndicator.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpColorIndicator/EpColorCircle.vue
- [ ] eperusteet-frontend-utils/vue/src/components/EpAikataulu/EpAikataulu.vue

### Test Files Migration

- [ ] eperusteet-frontend-utils/vue/src/utils/globals.ts (remove BvModal import)
- [ ] eperusteet-frontend-utils/vue/src/utils/__tests__/stubs.ts
- [ ] eperusteet-frontend-utils/vue/src/utils/__tests__/b-table-stub.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpTutkinnonosa/Arviointi2020Taulukko.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpTiedoteList/EpTiedoteList.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpKielivalinta/EpKielivalinta.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpKayttaja/EpKayttaja.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpJulkiLista/EpJulkiLista.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpHomeTiles/EpHomeTile.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpHeading/EpHeading.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpExternalLink/EpExternalLink.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpErrorPage/EpErrorPage.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpContentView/EpContentView.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpColorIndicator/EpColorIndicator.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpButton/EpButton.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpBalloonList/EpBalloonList.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/forms/__tests__/EpSelect.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpTreeNavibar/EpTreeNavibar.spec.ts
- [ ] eperusteet-frontend-utils/vue/src/components/EpKoodistoSelect/EpKoodistoSelect.spec.ts
- [ ] src/routes/opetussuunnitelmat/sisalto/tekstikappale/RouteOpetussuunnitelmaTekstikappale.spec.ts

## Configuration & Cleanup

- [ ] Remove bootstrap-vue from package.json
- [ ] Remove bootstrap-vue from eperusteet-frontend-utils/vue/package.json
- [ ] Delete src/config/bootstrap.ts
- [ ] Delete eperusteet-frontend-utils/vue/src/config/bootstrap.ts
- [ ] Remove @shared/config/bootstrap import from src/main.ts
- [ ] Update eperusteet-frontend-utils/vue/src/config/bootstrap.ts reference in shared config
- [ ] Remove @vue/compat if no longer needed
- [ ] Update vite.config.js if necessary
- [ ] Update vitest.config.js if necessary

## Testing & Validation

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Manual testing of all migrated components
- [ ] Accessibility testing (vue-axe)
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Browser compatibility testing

## Documentation

- [ ] Update component documentation
- [ ] Update developer guide
- [ ] Create migration guide for future developers
- [ ] Update README files

## Progress Summary

- **Total Components**: 25
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 25

- **Total Files**: 92+
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 92+

---

Last updated: 2025-12-08

