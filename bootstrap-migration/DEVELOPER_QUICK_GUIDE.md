# Developer Quick Migration Guide

This guide provides quick reference for developers migrating files from bootstrap-vue to ep- components.

## Quick Component Mapping

### Most Common Replacements

```vue
<!-- BEFORE: bootstrap-vue -->
<b-container>
<b-row>
<b-col md="6">
<b-table :items="items" :fields="fields">
<b-modal id="myModal">
<b-pagination v-model="page" :total-rows="total">
<b-form-group label="Name">
<b-form-input v-model="name">
<b-form-checkbox v-model="checked">
<b-tabs>
  <b-tab title="Tab 1">
<b-button variant="primary">
<b-dropdown text="Actions">

<!-- AFTER: custom components -->
<ep-container>
<ep-row>
<ep-col md="6">
<ep-table :items="items" :fields="fields">
<ep-modal id="myModal">
<ep-pagination v-model="page" :total-rows="total">
<ep-form-group label="Name">
<ep-form-input v-model="name">
<ep-form-checkbox v-model="checked">
<ep-tabs>
  <ep-tab title="Tab 1">
<ep-button variant="primary">
<ep-dropdown text="Actions">
```

### Directive Replacements

```vue
<!-- BEFORE -->
<button v-b-modal.myModal>Open</button>
<button v-b-toggle.sidebar>Toggle</button>
<span v-b-popover="'Content'">Info</span>
<span v-b-tooltip="'Tooltip'">Hover</span>

<!-- AFTER -->
<button v-ep-modal="'myModal'">Open</button>
<button v-ep-toggle="'sidebar'">Toggle</button>
<span v-ep-popover="'Content'">Info</span>
<span v-ep-tooltip="'Tooltip'">Hover</span>
```

## Step-by-Step Migration Process

### Step 1: Identify Bootstrap-Vue Components

Search your file for:
- `<b-` tags
- `v-b-` directives
- Bootstrap-vue imports

### Step 2: Update Imports

```typescript
// BEFORE
import BootstrapVue from 'bootstrap-vue';
// OR
// No explicit import (using global registration)

// AFTER
import EpTable from '@shared/components/ep-table/ep-table.vue';
import EpModal from '@shared/components/ep-modal/ep-modal.vue';
// etc.
```

### Step 3: Replace Component Tags

Use find-and-replace (carefully!):
- `<b-table` → `<ep-table`
- `</b-table>` → `</ep-table>`
- Repeat for all components

### Step 4: Update Props (if needed)

Most props should work the same, but check component documentation for:
- Renamed props
- Removed props
- New required props

### Step 5: Update Events

```vue
<!-- BEFORE -->
<b-modal @show="onShow" @hide="onHide">

<!-- AFTER -->
<ep-modal @show="onShow" @hide="onHide">
```

Most events should remain the same.

### Step 6: Update Directives

Replace `v-b-*` with `v-ep-*`:

```vue
<!-- BEFORE -->
<button v-b-modal.modalId>Open Modal</button>

<!-- AFTER -->
<button v-ep-modal="'modalId'">Open Modal</button>
```

Note: Syntax may change slightly (check directive documentation).

### Step 7: Test

- Run unit tests
- Run application locally
- Manually test all interactions
- Check accessibility with vue-axe

## Common Migration Patterns

### Pattern 1: Layout Components

```vue
<!-- BEFORE -->
<b-container fluid>
  <b-row>
    <b-col md="6" offset="3">
      Content
    </b-col>
  </b-row>
</b-container>

<!-- AFTER -->
<ep-container fluid>
  <ep-row>
    <ep-col md="6" offset="3">
      Content
    </ep-col>
  </ep-row>
</ep-container>
```

**Notes**: Props and behavior remain the same.

### Pattern 2: Tables with Slots

```vue
<!-- BEFORE -->
<b-table :items="items" :fields="fields" striped hover>
  <template #cell(name)="data">
    <strong>{{ data.value }}</strong>
  </template>
</b-table>

<!-- AFTER -->
<ep-table :items="items" :fields="fields" striped hover>
  <template #cell(name)="data">
    <strong>{{ data.value }}</strong>
  </template>
</ep-table>
```

**Notes**: Slot syntax remains the same.

### Pattern 3: Modals with v-model

```vue
<!-- BEFORE -->
<template>
  <b-modal v-model="showModal" title="My Modal">
    Modal content
  </b-modal>
</template>

<script setup>
const showModal = ref(false);
</script>

<!-- AFTER -->
<template>
  <ep-modal v-model="showModal" title="My Modal">
    Modal content
  </ep-modal>
</template>

<script setup>
const showModal = ref(false);
</script>
```

**Notes**: v-model works the same way.

### Pattern 4: Forms

```vue
<!-- BEFORE -->
<b-form-group label="Email" label-for="email-input">
  <b-form-input
    id="email-input"
    v-model="email"
    type="email"
    placeholder="Enter email"
  />
</b-form-group>

<!-- AFTER -->
<ep-form-group label="Email" label-for="email-input">
  <ep-form-input
    id="email-input"
    v-model="email"
    type="email"
    placeholder="Enter email"
  />
</ep-form-group>
```

**Notes**: API remains compatible.

### Pattern 5: Tabs

```vue
<!-- BEFORE -->
<b-tabs>
  <b-tab title="Tab 1" active>
    <p>Content 1</p>
  </b-tab>
  <b-tab title="Tab 2">
    <p>Content 2</p>
  </b-tab>
</b-tabs>

<!-- AFTER -->
<ep-tabs>
  <ep-tab title="Tab 1" active>
    <p>Content 1</p>
  </ep-tab>
  <ep-tab title="Tab 2">
    <p>Content 2</p>
  </ep-tab>
</ep-tabs>
```

**Notes**: Props and behavior remain the same.

### Pattern 6: Pagination (Special Case)

```vue
<!-- BEFORE: Already using EpBPagination wrapper -->
<EpBPagination
  v-model="currentPage"
  :total="totalItems"
  :items-per-page="itemsPerPage"
/>

<!-- AFTER: Same API, but internal implementation changed -->
<EpBPagination
  v-model="currentPage"
  :total="totalItems"
  :items-per-page="itemsPerPage"
/>
```

**Notes**: EpBPagination was refactored to not use b-pagination internally. No changes needed in consuming components.

## Import Aliases

In this project, the following import aliases are available:

```typescript
// Shared components (eperusteet-frontend-utils/vue/src/)
import EpTable from '@shared/components/ep-table/ep-table.vue';
import { useKieli } from '@shared/stores/kieli';

// Application components (src/)
import MyComponent from '@/components/MyComponent.vue';
```

## Testing Changes

### Update Test Imports

```typescript
// BEFORE
import BootstrapVue from 'bootstrap-vue';
import { createLocalVue, mount } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const wrapper = mount(Component, {
  localVue,
});

// AFTER
import { mount } from '@vue/test-utils';
import EpTable from '@shared/components/ep-table/ep-table.vue';

const wrapper = mount(Component, {
  global: {
    components: {
      EpTable,
    },
  },
});
```

### Update Test Stubs

```typescript
// BEFORE
const wrapper = mount(Component, {
  stubs: {
    'b-table': true,
    'b-modal': true,
  },
});

// AFTER
const wrapper = mount(Component, {
  global: {
    stubs: {
      'ep-table': true,
      'ep-modal': true,
    },
  },
});
```

## Common Issues & Solutions

### Issue 1: Component Not Found

**Error**: `Component ep-table is not found`

**Solution**: Import the component:
```typescript
import EpTable from '@shared/components/ep-table/ep-table.vue';

// In components option:
components: {
  EpTable,
}
```

### Issue 2: Props Not Working

**Error**: Props are not being recognized

**Solution**: Check component documentation. Some props may have been renamed or removed.

### Issue 3: Styles Look Different

**Error**: Component doesn't look the same

**Solution**: 
1. Verify Bootstrap CSS is still loaded
2. Check if custom styles need updating
3. Review component-specific style documentation

### Issue 4: Events Not Firing

**Error**: Event handlers not being called

**Solution**: Check event names in component documentation. Most should be the same, but some may have changed.

### Issue 5: Directive Not Working

**Error**: `v-ep-modal` directive not recognized

**Solution**: Ensure directive is registered in your app:
```typescript
// main.ts
import { epModalDirective } from '@shared/plugins/ep-modal-directive';

app.directive('ep-modal', epModalDirective);
```

## File Migration Checklist

When migrating a file, use this checklist:

- [ ] Identify all bootstrap-vue components used
- [ ] Import required ep- components
- [ ] Replace all `<b-*>` with `<ep-*>`
- [ ] Replace all `v-b-*` with `v-ep-*`
- [ ] Update component registration if needed
- [ ] Check for prop differences
- [ ] Update tests
- [ ] Run linter
- [ ] Test functionality manually
- [ ] Check accessibility
- [ ] Update MIGRATION_CHECKLIST.md

## Example: Complete File Migration

### Before

```vue
<template>
  <b-container>
    <b-row>
      <b-col md="12">
        <h1>Users</h1>
        <b-button v-b-modal.addUserModal variant="primary">
          Add User
        </b-button>
        
        <b-table
          :items="users"
          :fields="fields"
          striped
          hover
        >
          <template #cell(actions)="data">
            <b-button size="sm" @click="editUser(data.item)">
              Edit
            </b-button>
          </template>
        </b-table>
        
        <b-modal id="addUserModal" title="Add User">
          <b-form-group label="Name">
            <b-form-input v-model="newUser.name" />
          </b-form-group>
          <b-form-group label="Email">
            <b-form-input v-model="newUser.email" type="email" />
          </b-form-group>
        </b-modal>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const users = ref([]);
const fields = ['name', 'email', 'actions'];
const newUser = ref({ name: '', email: '' });

const editUser = (user) => {
  console.log('Edit', user);
};
</script>
```

### After

```vue
<template>
  <ep-container>
    <ep-row>
      <ep-col md="12">
        <h1>Users</h1>
        <ep-button v-ep-modal="'addUserModal'" variant="primary">
          Add User
        </ep-button>
        
        <ep-table
          :items="users"
          :fields="fields"
          striped
          hover
        >
          <template #cell(actions)="data">
            <ep-button size="sm" @click="editUser(data.item)">
              Edit
            </ep-button>
          </template>
        </ep-table>
        
        <ep-modal id="addUserModal" title="Add User">
          <ep-form-group label="Name">
            <ep-form-input v-model="newUser.name" />
          </ep-form-group>
          <ep-form-group label="Email">
            <ep-form-input v-model="newUser.email" type="email" />
          </ep-form-group>
        </ep-modal>
      </ep-col>
    </ep-row>
  </ep-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EpContainer from '@shared/components/ep-container/ep-container.vue';
import EpRow from '@shared/components/ep-row/ep-row.vue';
import EpCol from '@shared/components/ep-col/ep-col.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpTable from '@shared/components/ep-table/ep-table.vue';
import EpModal from '@shared/components/ep-modal/ep-modal.vue';
import EpFormGroup from '@shared/components/ep-form-group/ep-form-group.vue';
import EpFormInput from '@shared/components/ep-form-input/ep-form-input.vue';

const users = ref([]);
const fields = ['name', 'email', 'actions'];
const newUser = ref({ name: '', email: '' });

const editUser = (user) => {
  console.log('Edit', user);
};
</script>
```

**Changes Made**:
1. Replaced all `b-*` with `ep-*`
2. Added imports for all ep- components
3. Changed `v-b-modal.addUserModal` to `v-ep-modal="'addUserModal'"`
4. No other code changes needed!

## Tools & Commands

### Find Bootstrap-Vue Usage

```bash
# Find all files using b- components
grep -r "<b-" src/

# Find all files using v-b- directives
grep -r "v-b-" src/

# Find bootstrap-vue imports
grep -r "bootstrap-vue" src/
```

### Run Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test path/to/file.spec.ts

# Run with coverage
yarn test --coverage
```

### Lint Files

```bash
# Lint all files
yarn lint

# Lint specific file
yarn lint path/to/file.vue

# Fix auto-fixable issues
yarn lint --fix
```

## Getting Help

1. Check `VUEBOOTSTRAP_MIGRATION_PLAN.md` for detailed information
2. Check component README in `eperusteet-frontend-utils/vue/src/components/ep-[component]/`
3. Look at other migrated files for examples
4. Check `COMPONENT_TEMPLATE.md` for component structure
5. Ask the team

## Tracking Progress

After migrating a file:

1. Open `MIGRATION_CHECKLIST.md`
2. Find the file in the appropriate section
3. Mark it as complete: `- [x]`
4. Commit your changes

Example:
```markdown
- [x] src/routes/perusteet/tiedot/RoutePerusteTiedot.vue
```

---

**Remember**: 
- Test thoroughly after each migration
- Update tests along with components
- Check accessibility
- Document any issues or breaking changes

Last updated: 2025-12-08

