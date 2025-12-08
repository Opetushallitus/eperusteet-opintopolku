# Vuebootstrap Migration Summary

## Quick Reference

This is a quick reference document for the vuebootstrap to ep- components migration.

## Component Mapping Table

| Bootstrap-Vue | Custom Component | Priority | Status | Estimated Effort |
|---------------|------------------|----------|--------|------------------|
| `b-container` | `ep-container` | High | 🔴 Not Started | 1 day |
| `b-row` | `ep-row` | High | 🔴 Not Started | 1 day |
| `b-col` | `ep-col` | High | 🔴 Not Started | 1 day |
| `b-table` | `ep-table` | Critical | 🔴 Not Started | 5-7 days |
| `b-modal` | `ep-modal` | Critical | 🔴 Not Started | 5-7 days |
| `b-pagination` | `ep-pagination` | Critical | 🟡 Partial (EpBPagination) | 3-4 days |
| `b-form-group` | `ep-form-group` | High | 🔴 Not Started | 2-3 days |
| `b-form-input` | `ep-form-input` | High | 🔴 Not Started | 2-3 days |
| `b-form-checkbox` | `ep-form-checkbox` | High | 🔴 Not Started | 1-2 days |
| `b-tabs` | `ep-tabs` | High | 🔴 Not Started | 3-4 days |
| `b-tab` | `ep-tab` | High | 🔴 Not Started | (part of ep-tabs) |
| `b-button` | `ep-button` | High | 🟢 Exists (needs audit) | 1 day |
| `b-dropdown` | `ep-dropdown` | Medium | 🔴 Not Started | 2-3 days |
| `b-dropdown-item` | `ep-dropdown-item` | Medium | 🔴 Not Started | 1 day |
| `b-dropdown-item-button` | `ep-dropdown-item-button` | Medium | 🔴 Not Started | 1 day |
| `b-collapse` | `ep-collapse` | High | 🟢 Exists (needs audit) | 1 day |
| `b-alert` | `ep-alert` | Medium | 🟢 Exists (needs audit) | 1 day |
| `b-spinner` | `ep-spinner` | Low | 🟢 Exists (needs audit) | 1 day |
| `b-popover` | `ep-popover` | Medium | 🔴 Not Started | 2-3 days |
| `b-tooltip` | `ep-tooltip` | Low | 🔴 Not Started | 1-2 days |
| `b-badge` | `ep-badge` | Low | 🔴 Not Started | 1 day |
| `b-img` | `ep-img` | Low | 🔴 Not Started | 1 day |
| `b-link` | `ep-link` | Low | 🟢 Exists (EpLinkki, needs audit) | 1 day |
| `b-list-group` | `ep-list-group` | Low | 🔴 Not Started | 1 day |
| `b-list-group-item` | `ep-list-group-item` | Low | 🔴 Not Started | 1 day |

## Directive Mapping Table

| Bootstrap-Vue Directive | Custom Directive | Priority | Status | Estimated Effort |
|-------------------------|------------------|----------|--------|------------------|
| `v-b-modal` | `v-ep-modal` | Critical | 🔴 Not Started | 1-2 days |
| `v-b-toggle` | `v-ep-toggle` | High | 🔴 Not Started | 1-2 days |
| `v-b-popover` | `v-ep-popover` | Medium | 🔴 Not Started | 1 day |
| `v-b-tooltip` | `v-ep-tooltip` | Low | 🔴 Not Started | 1 day |

## Statistics

### Component Statistics

- **Total Components to Create/Update**: 25
- **Components Not Started**: 17 (68%)
- **Components Partially Done**: 1 (4%)
- **Components Needing Audit**: 7 (28%)

### Directive Statistics

- **Total Directives to Create**: 4
- **Directives Not Started**: 4 (100%)

### File Statistics

- **Total Files Affected**: 92+
- **Application Files (src/)**: ~40
- **Shared Components (eperusteet-frontend-utils/vue/src/)**: ~52
- **Test Files**: ~20

### Usage Statistics by Component

| Component | Files Affected | Usage Priority |
|-----------|----------------|----------------|
| `b-row` / `b-col` | ~30 | High |
| `b-table` | ~15 | Critical |
| `b-form-group` | ~40 | High |
| `b-modal` | ~10 | Critical |
| `b-pagination` | ~15 (via EpBPagination) | Critical |
| `b-tabs` / `b-tab` | ~10 | High |
| `b-button` | ~20 | High |
| `b-form-input` | ~5 | High |
| `b-form-checkbox` | ~5 | Medium |
| `b-dropdown` | ~5 | Medium |
| `b-container` | ~5 | Medium |
| `v-b-modal` | ~7 | Critical |
| `v-b-toggle` | ~2 | High |

## Effort Estimates

### By Phase

| Phase | Components | Estimated Time | Priority |
|-------|-----------|----------------|----------|
| Phase 1: Foundation | 5 components | 2-3 weeks | Critical |
| Phase 2: Forms | 3 components | 1-2 weeks | High |
| Phase 3: Navigation | 5 components | 1 week | High |
| Phase 4: Audit Existing | 6 components | 1 week | High |
| Phase 5: Utilities | 6 components | 1-2 weeks | Medium/Low |
| Phase 6: Migration | All files | 3-4 weeks | Critical |
| Phase 7: Cleanup | Configuration | 1 week | High |
| **Total** | **25 components + 92 files** | **10-16 weeks** | **Mixed** |

### By Priority

| Priority | Components | Files | Estimated Time |
|----------|-----------|-------|----------------|
| Critical | 3 | ~25 | 3-4 weeks |
| High | 13 | ~50 | 4-6 weeks |
| Medium | 5 | ~10 | 1-2 weeks |
| Low | 4 | ~7 | 1 week |

## Risk Assessment

### High Risk Areas

1. **ep-table** - Complex component with sorting, filtering, slots
   - Risk: High complexity
   - Mitigation: Thorough testing, incremental development

2. **ep-modal** - Complex accessibility requirements
   - Risk: Focus management, keyboard navigation
   - Mitigation: Use existing libraries or patterns

3. **ep-form-* components** - Many files depend on these
   - Risk: Breaking forms across application
   - Mitigation: Comprehensive testing strategy

4. **Large number of files** - 92+ files to update
   - Risk: Human error, missed files
   - Mitigation: Automated search/replace, code reviews

### Medium Risk Areas

1. **ep-tabs** - Complex state management
2. **ep-dropdown** - Click-outside, positioning
3. **Existing component audits** - Unknown current state

### Low Risk Areas

1. **Layout components** (row, col, container) - Mostly CSS
2. **Simple utilities** (badge, img) - Straightforward implementation

## Testing Strategy

### Required Testing

| Test Type | Coverage Target | Priority |
|-----------|----------------|----------|
| Unit Tests | 100% of new components | Critical |
| Integration Tests | Key user flows | High |
| Accessibility Tests | All interactive components | Critical |
| Visual Regression | All components | High |
| Performance Tests | Table, Modal, Dropdown | Medium |
| Browser Compatibility | Modern browsers | High |

### Key Test Scenarios

1. **Tables**: Sorting, filtering, pagination, custom slots
2. **Modals**: Open, close, focus trap, ESC key, backdrop click
3. **Forms**: Validation, v-model, disabled states
4. **Tabs**: Navigation, keyboard, lazy loading
5. **Dropdowns**: Open, close, click outside, keyboard navigation
6. **Layout**: Responsive behavior, grid system

## Success Metrics

### Pre-Migration Baseline
- [ ] Record application bundle size
- [ ] Record page load times
- [ ] Record test suite execution time
- [ ] Record accessibility score (axe)
- [ ] Document known issues

### Post-Migration Targets
- [ ] No bootstrap-vue dependencies
- [ ] No @vue/compat (if possible)
- [ ] All tests passing
- [ ] No accessibility regressions
- [ ] Bundle size same or smaller
- [ ] Performance same or better

## Critical Path

The following tasks are on the critical path and block other work:

1. **ep-modal + v-ep-modal** (blocks 10 files)
2. **ep-table** (blocks 15 files)
3. **ep-pagination fix** (blocks 15 files)
4. **ep-form-group** (blocks 40 files)
5. **Layout components** (blocks 30 files)

These should be prioritized first.

## Dependencies

### External Dependencies to Keep
- Bootstrap CSS framework (for utilities)
- Vue 3.5.22
- Pinia (state management)
- Other non-bootstrap-vue dependencies

### Dependencies to Remove
- bootstrap-vue 2.23.1
- @vue/compat (after migration, if possible)

### Dependencies to Consider Adding
- Floating UI / Popper.js (for dropdowns, popovers, tooltips)
- Focus-trap-vue (for modal focus management)

## Rollback Strategy

If issues arise during migration:

1. **Git branches**: Each phase in separate branch
2. **Feature flags**: Consider feature flags for gradual rollout
3. **Parallel implementation**: Keep both versions temporarily
4. **Incremental merge**: Merge smaller chunks, not all at once

## Communication Plan

### Stakeholders
- Development team
- QA team
- Product owners
- End users (if visible changes)

### Communication Points
1. Before Phase 1: Kickoff, explain plan
2. After Phase 1: Demo new components
3. After Phase 4: Milestone update
4. After Phase 6: Almost done update
5. After Phase 7: Completion announcement

## Resources

### Documentation
- [Vue 3 Documentation](https://vuejs.org/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/)
- [Bootstrap-Vue Documentation](https://bootstrap-vue.org/) (for reference)
- [Vue Accessibility](https://www.w3.org/WAI/ARIA/apg/)

### Tools
- Vue DevTools
- Vue Axe (accessibility)
- Vitest (testing)
- Vite (build tool)

### Reference Implementations
- PrimeVue
- Vuetify
- Quasar
- Element Plus

## Quick Start Guide

### For Developers Starting Migration

1. Read `VUEBOOTSTRAP_MIGRATION_PLAN.md`
2. Review `MIGRATION_CHECKLIST.md`
3. Pick a component from Phase 1
4. Create component in `eperusteet-frontend-utils/vue/src/components/ep-[ComponentName]/`
5. Write tests
6. Update checklist
7. Create PR

### Component Template Location

```
eperusteet-frontend-utils/vue/src/components/ep-[ComponentName]/
├── ep-[ComponentName].vue      # Component
├── ep-[ComponentName].spec.ts  # Tests
└── README.md                    # Documentation (optional)
```

### Example Component Structure

See `VUEBOOTSTRAP_MIGRATION_PLAN.md` section "Component Implementation Guidelines"

## Contact

For questions about this migration:
- Review the detailed plan in `VUEBOOTSTRAP_MIGRATION_PLAN.md`
- Check the checklist in `MIGRATION_CHECKLIST.md`
- Contact the development team lead

---

**Note**: This is a living document. Update as migration progresses.

Last updated: 2025-12-08

