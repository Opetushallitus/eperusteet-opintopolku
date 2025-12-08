# Vuebootstrap to Custom Components Migration Plan

## Overview

This document outlines the plan to migrate from bootstrap-vue (vuebootstrap) to custom ep- prefixed components. The application currently uses Vue 3 with a compatibility layer to support bootstrap-vue, which is designed for Vue 2. This migration will eliminate the need for the compatibility layer and provide better Vue 3 support.

## Current State

- **Bootstrap-vue version**: 2.23.1
- **Vue version**: 3.5.22
- **Compatibility layer**: @vue/compat 3.5.22
- **Configuration files**:
  - `src/config/bootstrap.ts`
  - `eperusteet-frontend-utils/vue/src/config/bootstrap.ts`
  - `eperusteet-frontend-utils/vue/src/styles/bootstrap.scss`

## Components to Replace

Based on the codebase analysis, the following bootstrap-vue components need to be replaced:

### 1. Layout Components

#### ep-container (replaces b-container)
- **Usage**: Layout wrapper for responsive container
- **Props**: fluid (boolean)
- **Files affected**: ~5 files
- **Priority**: High
- **Example usage**: `src/routes/kooste/RouteKoosteAmmatillinen.vue`

#### ep-row (replaces b-row)
- **Usage**: Flexbox row container
- **Props**: No specific props needed, uses CSS classes
- **Files affected**: ~30 files
- **Priority**: High
- **Example files**:
  - `src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue`
  - `src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOpintokokonaisuus.vue`

#### ep-col (replaces b-col)
- **Usage**: Flexbox column container
- **Props**: md, lg, sm, xs (responsive column sizes)
- **Files affected**: ~30 files
- **Priority**: High
- **Example files**: Same as b-row

### 2. Table Components

#### ep-table (replaces b-table)
- **Usage**: Data table with sorting, filtering
- **Props**:
  - items (array)
  - fields (array)
  - striped (boolean)
  - fixed (boolean)
  - responsive (boolean)
  - hover (boolean)
- **Slots**: cell(fieldName), head(fieldName)
- **Files affected**: ~15 files
- **Priority**: Critical
- **Example files**:
  - `src/routes/perusteet/tiedot/RoutePerusteTiedot.vue`
  - `src/routes/perusteet/tiedot/RoutePerusteKoosteEng.vue`
  - `src/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaTutkinnonosat.vue`
  - `src/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaSuorituspolut.vue`
  - `src/routes/perusteet/sisalto/ammatillinen/RouteTutkinnonosat.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpKoodistoSelect/EpKoodistoSelectTable.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpPoistettuTable/PoistetutTable.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpTutkinnonosa/Arviointi2020Taulukko.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpTutkinnonosa/GeneerinenArviointiTaulukko.vue`
  - `src/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue`

### 3. Modal Components

#### ep-modal (replaces b-modal)
- **Usage**: Modal dialog boxes
- **Props**:
  - id (string)
  - size (string: 'sm', 'lg', 'xl')
  - static (boolean)
  - lazy (boolean)
  - no-enforce-focus (boolean)
- **Slots**: modal-header, modal-footer, default
- **Directives needed**: ep-modal (replaces v-b-modal)
- **Files affected**: ~10 files
- **Priority**: Critical
- **Example files**:
  - `eperusteet-frontend-utils/vue/src/components/EpTiedoteModal/EpTiedoteModal.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpEditointi/EpVersioModaali.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpTekstikappaleLisays/EpTekstikappaleLisays.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpArkistoidutModal/EpArkistoidutModal.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpContent/LinkModal.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpContent/ImageModal.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpAikataulu/EpAikatauluModal.vue`

### 4. Form Components

#### ep-form-group (replaces b-form-group)
- **Usage**: Form field wrapper with label
- **Props**:
  - label (string)
  - label-for (string)
  - description (string)
- **Files affected**: ~40 files
- **Priority**: High
- **Example files**:
  - `src/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue`
  - `src/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuusPaaAlue.vue`
  - Various form-heavy components

#### ep-form-input (replaces b-form-input)
- **Usage**: Text input field
- **Props**:
  - modelValue (string)
  - type (string)
  - placeholder (string)
  - disabled (boolean)
- **Files affected**: ~5 files
- **Priority**: High
- **Example files**:
  - `eperusteet-frontend-utils/vue/src/components/EpTiedoteModal/EpTiedoteModal.vue`

#### ep-form-checkbox (replaces b-form-checkbox)
- **Usage**: Checkbox input
- **Props**:
  - modelValue (boolean)
  - value (any)
  - disabled (boolean)
- **Files affected**: ~5 files
- **Priority**: Medium
- **Example files**:
  - `src/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuusPaaAlue.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpKoodistoSelect/EpKoodistoSelect.vue`

### 5. Navigation Components

#### ep-tabs (replaces b-tabs)
- **Usage**: Tab navigation container
- **Props**:
  - modelValue (number or string)
  - card (boolean)
  - pills (boolean)
- **Files affected**: ~10 files
- **Priority**: High
- **Example files**:
  - `src/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusOppiaine.vue`
  - `src/routes/opetussuunnitelmat/sisalto/perusopetus/OppiaineenVuosiluokkakokonaisuus.vue`
  - `src/routes/perusteet/sisalto/perusopetus/RoutePerusopetusOppiaine.vue`
  - `src/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuus.vue`
  - `eperusteet-frontend-utils/vue/src/components/forms/EpToggle.vue`

#### ep-tab (replaces b-tab)
- **Usage**: Individual tab
- **Props**:
  - title (string)
  - disabled (boolean)
  - active (boolean)
- **Files affected**: Same as ep-tabs
- **Priority**: High

### 6. Button & Dropdown Components

#### ep-button (replaces b-button)
- **Status**: ✅ Already exists at `eperusteet-frontend-utils/vue/src/components/EpButton/EpButton.vue`
- **Usage**: Various button actions
- **Props**: variant, size, disabled, type
- **Files affected**: ~20 files
- **Note**: Need to verify if it wraps b-button or is standalone

#### ep-dropdown (replaces b-dropdown)
- **Usage**: Dropdown menu
- **Props**:
  - text (string)
  - variant (string)
  - size (string)
- **Files affected**: ~5 files
- **Priority**: Medium
- **Example files**:
  - `eperusteet-frontend-utils/vue/src/components/lops2019/EpOpintojaksonLaajaAlaisetOsaamiset.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpNavbar/EpNavbar.vue`

#### ep-dropdown-item (replaces b-dropdown-item)
- **Usage**: Dropdown menu item
- **Props**: disabled, active
- **Files affected**: Same as ep-dropdown
- **Priority**: Medium

#### ep-dropdown-item-button (replaces b-dropdown-item-button)
- **Usage**: Dropdown menu button item
- **Props**: disabled
- **Files affected**: Same as ep-dropdown
- **Priority**: Medium

### 7. Pagination Components

#### ep-pagination (replaces b-pagination)
- **Status**: ⚠️ Partially implemented at `eperusteet-frontend-utils/vue/src/components/EpBPagination/EpBPagination.vue`
- **Current implementation**: Wrapper around b-pagination
- **Props**:
  - modelValue (number)
  - total (number)
  - itemsPerPage (number)
  - ariaControls (string)
- **Files affected**: ~15 files (already migrated to EpBPagination)
- **Priority**: Critical - needs to be converted to pure implementation
- **Action needed**: Replace internal b-pagination with custom implementation

### 8. Utility Components

#### ep-collapse (replaces b-collapse)
- **Status**: ✅ Already exists at `eperusteet-frontend-utils/vue/src/components/EpCollapse/EpCollapse.vue`
- **Usage**: Collapsible content
- **Directives needed**: ep-toggle (replaces v-b-toggle)
- **Files affected**: ~5 files
- **Priority**: High
- **Example files**:
  - `src/components/EpJulkinenSidenav/EpJulkinenSidenav.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpNavbar/EpNavbar.vue`
- **Note**: Need to verify if it wraps b-collapse or is standalone

#### ep-popover (replaces b-popover)
- **Usage**: Popover tooltips
- **Directives needed**: ep-popover (replaces v-b-popover)
- **Files affected**: ~10 files
- **Priority**: Medium
- **Example files**:
  - `eperusteet-frontend-utils/vue/src/components/EpValidPopover/EpValidPopover.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpInfoPopover/EpInfoPopover.vue`
  - `eperusteet-frontend-utils/vue/src/components/EpProgressPopover/EpProgressPopover.vue`

#### ep-tooltip (replaces b-tooltip)
- **Usage**: Simple tooltips
- **Directives needed**: ep-tooltip (replaces v-b-tooltip)
- **Files affected**: ~5 files
- **Priority**: Low

#### ep-badge (replaces b-badge)
- **Usage**: Small count and labeling component
- **Props**: variant, pill
- **Files affected**: ~3 files
- **Priority**: Low

#### ep-alert (replaces b-alert)
- **Status**: ✅ Already exists at `eperusteet-frontend-utils/vue/src/components/EpAlert/EpAlert.vue`
- **Usage**: Alert messages
- **Props**: variant, dismissible
- **Files affected**: ~5 files
- **Priority**: Medium
- **Note**: Need to verify if it wraps b-alert or is standalone

#### ep-spinner (replaces b-spinner)
- **Status**: ✅ Already exists at `eperusteet-frontend-utils/vue/src/components/EpSpinner/`
- **Usage**: Loading spinner
- **Props**: variant, small
- **Files affected**: ~3 files
- **Priority**: Low
- **Note**: Need to verify if it wraps b-spinner or is standalone

#### ep-img (replaces b-img)
- **Usage**: Responsive images
- **Props**: src, alt, fluid, thumbnail
- **Files affected**: ~3 files
- **Priority**: Low

#### ep-link (replaces b-link)
- **Status**: ✅ Already exists at `eperusteet-frontend-utils/vue/src/components/EpLinkki/`
- **Usage**: Router-aware links
- **Props**: to, href
- **Files affected**: ~5 files
- **Priority**: Low
- **Note**: Need to verify if it wraps b-link or is standalone

#### ep-list-group (replaces b-list-group)
- **Usage**: List container
- **Props**: flush
- **Files affected**: ~2 files
- **Priority**: Low

#### ep-list-group-item (replaces b-list-group-item)
- **Usage**: List item
- **Props**: active, disabled
- **Files affected**: Same as ep-list-group
- **Priority**: Low

## Migration Strategy

### Phase 1: Foundation (Critical Components)
Priority: Critical | Estimated: 2-3 weeks

1. **Create base layout components**
   - ep-container
   - ep-row
   - ep-col

2. **Create ep-table component**
   - Full-featured table with sorting, filtering
   - Custom slots for headers and cells
   - Responsive design

3. **Create ep-modal component**
   - Modal with header, body, footer slots
   - Create ep-modal directive (v-ep-modal)
   - Accessibility features (focus trap, ESC key, etc.)

4. **Fix ep-pagination (EpBPagination)**
   - Remove internal b-pagination dependency
   - Implement pure Vue 3 pagination logic
   - Maintain existing API for backward compatibility

### Phase 2: Forms (High Priority)
Priority: High | Estimated: 1-2 weeks

5. **Create form components**
   - ep-form-group
   - ep-form-input
   - ep-form-checkbox

### Phase 3: Navigation (High Priority)
Priority: High | Estimated: 1 week

6. **Create navigation components**
   - ep-tabs
   - ep-tab
   - ep-dropdown
   - ep-dropdown-item
   - ep-dropdown-item-button

### Phase 4: Verify Existing Components
Priority: High | Estimated: 1 week

7. **Audit and upgrade existing ep- components**
   - ep-button: Verify it doesn't use b-button internally
   - ep-collapse: Verify it doesn't use b-collapse internally
   - ep-alert: Verify it doesn't use b-alert internally
   - ep-spinner: Verify it doesn't use b-spinner internally
   - ep-link: Verify it doesn't use b-link internally

8. **Create collapse directive**
   - ep-toggle directive (v-ep-toggle) to replace v-b-toggle

### Phase 5: Utility Components (Medium/Low Priority)
Priority: Medium/Low | Estimated: 1-2 weeks

9. **Create utility components**
   - ep-popover (+ directive)
   - ep-tooltip (+ directive)
   - ep-badge
   - ep-img
   - ep-list-group
   - ep-list-group-item

### Phase 6: Migration Execution
Priority: Critical | Estimated: 3-4 weeks

10. **Replace components file by file**
    - Update imports
    - Replace component tags
    - Replace directives (v-b-modal → v-ep-modal, v-b-toggle → v-ep-toggle)
    - Test functionality

11. **Update tests**
    - Replace BootstrapVue imports in test files
    - Update test stubs

### Phase 7: Cleanup
Priority: High | Estimated: 1 week

12. **Remove bootstrap-vue dependency**
    - Remove from package.json (both locations)
    - Remove bootstrap.ts configuration files
    - Remove Vue.use(BootstrapVue) calls
    - Remove @vue/compat if no longer needed
    - Update vite/build configuration if necessary

## Component Implementation Guidelines

### General Principles

1. **API Compatibility**: Maintain similar prop names and behavior to bootstrap-vue for easier migration
2. **Accessibility**: Ensure ARIA attributes and keyboard navigation
3. **Composition API**: Use Vue 3 Composition API (script setup)
4. **TypeScript**: Full TypeScript support with proper types
5. **Styling**: Use existing Bootstrap SCSS utilities, maintain same CSS classes where possible
6. **Testing**: Unit tests for each component

### Example Component Structure

```vue
<template>
  <div class="ep-[component-name]">
    <!-- Component template -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  // Props definition
}

const props = withDefaults(defineProps<Props>(), {
  // Default values
});

const emit = defineEmits<{
  // Events definition
}>();

// Component logic
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.ep-[component-name] {
  // Styles
}
</style>
```

## File Structure

Create components in:
- `eperusteet-frontend-utils/vue/src/components/ep-[ComponentName]/`
  - `ep-[ComponentName].vue` - Main component
  - `ep-[ComponentName].spec.ts` - Unit tests
  - `README.md` - Component documentation (optional)

## Directives to Create

1. **v-ep-modal** - Replaces v-b-modal
   - Location: `eperusteet-frontend-utils/vue/src/plugins/ep-modal-directive.ts`
   - Functionality: Opens modal by ID

2. **v-ep-toggle** - Replaces v-b-toggle
   - Location: `eperusteet-frontend-utils/vue/src/plugins/ep-toggle-directive.ts`
   - Functionality: Toggles collapse by ID

3. **v-ep-popover** - Replaces v-b-popover
   - Location: `eperusteet-frontend-utils/vue/src/plugins/ep-popover-directive.ts`
   - Functionality: Shows popover on trigger

4. **v-ep-tooltip** - Replaces v-b-tooltip
   - Location: `eperusteet-frontend-utils/vue/src/plugins/ep-tooltip-directive.ts`
   - Functionality: Shows tooltip on hover

## Testing Strategy

1. **Unit Tests**: Each component should have spec file
2. **Integration Tests**: Test components in context (forms, tables with data)
3. **Visual Regression**: Consider adding visual tests for complex components
4. **Accessibility Testing**: Use vue-axe for a11y validation

## Estimated Timeline

- **Phase 1 (Critical)**: 2-3 weeks
- **Phase 2 (Forms)**: 1-2 weeks
- **Phase 3 (Navigation)**: 1 week
- **Phase 4 (Audit)**: 1 week
- **Phase 5 (Utilities)**: 1-2 weeks
- **Phase 6 (Migration)**: 3-4 weeks
- **Phase 7 (Cleanup)**: 1 week

**Total Estimated Time**: 10-16 weeks (2.5-4 months)

## Risks & Mitigation

### Risks

1. **Breaking Changes**: Component API differences may break existing functionality
   - *Mitigation*: Maintain backward compatibility, thorough testing

2. **Performance Issues**: Custom implementations may have different performance characteristics
   - *Mitigation*: Performance testing, optimization

3. **Accessibility Regressions**: Missing ARIA attributes or keyboard support
   - *Mitigation*: Use vue-axe, manual accessibility testing

4. **Styling Issues**: Components may look different from bootstrap-vue
   - *Mitigation*: Use same Bootstrap CSS classes, visual regression testing

5. **Large Codebase**: Many files to update increases risk of mistakes
   - *Mitigation*: Incremental migration, automated testing, code reviews

## Success Criteria

1. ✅ All bootstrap-vue components replaced with ep- components
2. ✅ bootstrap-vue dependency removed from package.json
3. ✅ @vue/compat removed (if no other dependencies)
4. ✅ All tests passing
5. ✅ No accessibility regressions
6. ✅ No visual regressions
7. ✅ Application performance maintained or improved

## Notes

- Some components like EpButton, EpCollapse, EpAlert, EpSpinner already exist but need verification that they don't use bootstrap-vue internally
- EpBPagination currently wraps b-pagination and needs to be refactored
- Keep Bootstrap CSS framework for styling utilities
- Focus on Vue 3 best practices (Composition API, TypeScript)

## References

- Bootstrap-vue documentation: https://bootstrap-vue.org/
- Vue 3 documentation: https://vuejs.org/
- Bootstrap 4/5 documentation: https://getbootstrap.com/
- Existing component: `eperusteet-frontend-utils/vue/src/components/EpBPagination/EpBPagination.vue` (example of wrapper pattern)

