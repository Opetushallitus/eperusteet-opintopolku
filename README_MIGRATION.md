# Vuebootstrap to EP Components Migration

This directory contains documentation for migrating from bootstrap-vue to custom ep- prefixed components.

## Background

The application currently uses `bootstrap-vue` (version 2.23.1), which is designed for Vue 2. To support this in Vue 3, we're using the `@vue/compat` compatibility layer. This migration will:

1. Remove the dependency on bootstrap-vue
2. Create custom ep- prefixed components to replace bootstrap-vue components
3. Potentially remove the need for @vue/compat
4. Improve Vue 3 compatibility and performance

## Documentation Files

### 📋 [VUEBOOTSTRAP_MIGRATION_PLAN.md](./VUEBOOTSTRAP_MIGRATION_PLAN.md)
**Main migration plan** - Comprehensive document covering:
- Current state analysis
- Complete list of components to replace
- Migration strategy with 7 phases
- Implementation guidelines
- Timeline estimates (10-16 weeks)
- Risk assessment
- Success criteria

**Read this first** to understand the full scope and strategy.

### ✅ [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)
**Progress tracking** - Detailed checklist including:
- Component development progress
- File migration progress (92+ files)
- Configuration and cleanup tasks
- Testing and validation tasks
- Documentation tasks

**Use this** to track which components and files have been migrated.

### 📊 [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
**Quick reference** - Summary document with:
- Component mapping table (b-* → ep-*)
- Directive mapping table (v-b-* → v-ep-*)
- Statistics and usage counts
- Effort estimates by phase and priority
- Risk assessment
- Success metrics
- Quick start guide

**Reference this** for quick lookups and statistics.

### 🎨 [COMPONENT_TEMPLATE.md](./COMPONENT_TEMPLATE.md)
**Component development guide** - Templates for:
- Basic component structure
- Test file structure
- README structure
- Specific component examples (layout, modal, table)
- Best practices
- Common patterns

**Use this** when creating new ep- components.

### 🚀 [DEVELOPER_QUICK_GUIDE.md](./DEVELOPER_QUICK_GUIDE.md)
**Developer migration guide** - Quick reference for:
- Component mapping
- Step-by-step migration process
- Common migration patterns
- Testing changes
- Common issues and solutions
- Complete file migration example

**Use this** when migrating individual files.

## Quick Start

### For Project Managers

1. Read [VUEBOOTSTRAP_MIGRATION_PLAN.md](./VUEBOOTSTRAP_MIGRATION_PLAN.md) - sections:
   - Overview
   - Migration Strategy
   - Estimated Timeline
   - Risk Assessment

2. Review [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for:
   - Statistics
   - Effort estimates
   - Success metrics

3. Track progress in [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

### For Component Developers

1. Review [VUEBOOTSTRAP_MIGRATION_PLAN.md](./VUEBOOTSTRAP_MIGRATION_PLAN.md) - sections:
   - Components to Replace
   - Component Implementation Guidelines

2. Use [COMPONENT_TEMPLATE.md](./COMPONENT_TEMPLATE.md) as reference

3. Pick a component from [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

4. Create component in: `eperusteet-frontend-utils/vue/src/components/ep-[ComponentName]/`

5. Mark component as complete in checklist

### For File Migration Developers

1. Read [DEVELOPER_QUICK_GUIDE.md](./DEVELOPER_QUICK_GUIDE.md)

2. Pick a file from [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

3. Follow the step-by-step process in the quick guide

4. Test thoroughly

5. Mark file as complete in checklist

## Migration Phases

### Phase 1: Foundation (Weeks 1-3)
**Critical components**
- ep-container, ep-row, ep-col
- ep-table
- ep-modal + v-ep-modal directive
- Fix ep-pagination (EpBPagination)

### Phase 2: Forms (Weeks 4-5)
**Form components**
- ep-form-group
- ep-form-input
- ep-form-checkbox

### Phase 3: Navigation (Week 6)
**Navigation components**
- ep-tabs, ep-tab
- ep-dropdown, ep-dropdown-item, ep-dropdown-item-button

### Phase 4: Audit (Week 7)
**Verify existing components**
- ep-button, ep-collapse, ep-alert, ep-spinner, ep-link
- Create v-ep-toggle directive

### Phase 5: Utilities (Weeks 8-9)
**Utility components**
- ep-popover, ep-tooltip, ep-badge, ep-img
- ep-list-group, ep-list-group-item

### Phase 6: Migration (Weeks 10-13)
**Replace in all files**
- Update 92+ component files
- Update test files
- Update stubs

### Phase 7: Cleanup (Week 14-16)
**Remove old dependencies**
- Remove bootstrap-vue
- Remove @vue/compat (if possible)
- Update configuration

## Component Mapping Quick Reference

| Bootstrap-Vue | EP Component | Priority |
|---------------|--------------|----------|
| b-table | ep-table | Critical |
| b-modal | ep-modal | Critical |
| b-pagination | ep-pagination | Critical |
| b-row / b-col | ep-row / ep-col | High |
| b-form-group | ep-form-group | High |
| b-form-input | ep-form-input | High |
| b-tabs / b-tab | ep-tabs / ep-tab | High |
| b-button | ep-button | High |
| b-dropdown | ep-dropdown | Medium |
| b-collapse | ep-collapse | High |
| b-alert | ep-alert | Medium |
| b-form-checkbox | ep-form-checkbox | Medium |
| Others | See plan | Low |

## File Statistics

- **Total files to migrate**: 92+
- **Application files**: ~40
- **Shared component files**: ~52
- **Test files**: ~20
- **Configuration files**: 2

## Key Files

### Bootstrap-vue Configuration
- `src/config/bootstrap.ts` - Vue.use(BootstrapVue) registration
- `eperusteet-frontend-utils/vue/src/config/bootstrap.ts` - Shared registration
- `eperusteet-frontend-utils/vue/src/styles/bootstrap.scss` - Bootstrap styles

### Existing Partial Implementations
- `eperusteet-frontend-utils/vue/src/components/EpBPagination/EpBPagination.vue` - Wraps b-pagination (needs refactoring)
- `eperusteet-frontend-utils/vue/src/components/EpButton/` - May need audit
- `eperusteet-frontend-utils/vue/src/components/EpCollapse/` - May need audit
- `eperusteet-frontend-utils/vue/src/components/EpAlert/` - May need audit

## Progress Tracking

Track progress in [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md):

```markdown
## Progress Summary

- **Total Components**: 25
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 25

- **Total Files**: 92+
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 92+
```

Update this section as you complete components and files.

## Testing Strategy

1. **Unit Tests** - Test each component in isolation
2. **Integration Tests** - Test components working together
3. **Accessibility Tests** - Use vue-axe for a11y validation
4. **Visual Regression** - Compare before/after visually
5. **Performance Tests** - Ensure no regressions
6. **Manual Testing** - Test in browser with real interactions

## Success Criteria

✅ Migration is complete when:

1. All bootstrap-vue components replaced
2. bootstrap-vue removed from package.json
3. All tests passing
4. No accessibility regressions
5. No visual regressions
6. Performance maintained or improved
7. Documentation updated

## Common Issues

See [DEVELOPER_QUICK_GUIDE.md](./DEVELOPER_QUICK_GUIDE.md) - "Common Issues & Solutions" section.

## Tools & Commands

```bash
# Find bootstrap-vue usage
grep -r "<b-" src/
grep -r "v-b-" src/

# Run tests
yarn test

# Run linter
yarn lint

# Development server
yarn dev
```

## Contributing

1. Pick a task from [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)
2. Create a branch: `git checkout -b migrate/ep-[component-name]`
3. Implement changes following the guides
4. Write/update tests
5. Update checklist
6. Create pull request
7. Code review
8. Merge

## Communication

### Status Updates

Provide regular updates including:
- Components completed
- Files migrated
- Blockers/issues
- Next steps

### Meetings

- Weekly sync to review progress
- Demo sessions after major phases
- Retrospectives at phase completion

## Getting Help

1. Review the documentation files in this directory
2. Check existing migrated components for examples
3. Ask the team in standups or dedicated channels
4. Review Vue 3 and Bootstrap documentation
5. Check similar open-source projects for patterns

## Resources

### Documentation
- [Vue 3 Docs](https://vuejs.org/)
- [Bootstrap 5 Docs](https://getbootstrap.com/)
- [Bootstrap-Vue Docs](https://bootstrap-vue.org/) (reference only)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [vue-axe](https://github.com/vue-a11y/vue-axe) (accessibility)
- [Vitest](https://vitest.dev/) (testing)
- [Vite](https://vitejs.dev/) (build tool)

### Inspiration
- [PrimeVue](https://primevue.org/)
- [Vuetify](https://vuetifyjs.com/)
- [Quasar](https://quasar.dev/)
- [Element Plus](https://element-plus.org/)

## Timeline

**Estimated Duration**: 10-16 weeks (2.5-4 months)

**Start Date**: TBD
**Target Completion**: TBD

## Notes

- Keep Bootstrap CSS framework for styling utilities
- Focus on Vue 3 Composition API and TypeScript
- Maintain backward compatibility where possible
- Document any breaking changes
- Prioritize accessibility throughout

---

## Document Updates

When updating this migration plan:

1. Update the relevant document(s)
2. Update the checklist if components/files change
3. Update the summary statistics
4. Update this README if structure changes
5. Commit all changes together

---

**Created**: 2025-12-08  
**Last Updated**: 2025-12-08  
**Status**: Planning Phase

---

For questions or clarifications, contact the development team.

