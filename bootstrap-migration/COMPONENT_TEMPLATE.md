# Component Template

Use this template when creating new ep- components to replace bootstrap-vue components.

## Directory Structure

```
eperusteet-frontend-utils/vue/src/components/ep-[ComponentName]/
├── ep-[ComponentName].vue      # Main component file
├── ep-[ComponentName].spec.ts  # Unit tests
└── README.md                    # Documentation (optional)
```

## Component Template (ep-[ComponentName].vue)

```vue
<template>
  <div
    :class="classes"
    :style="styles"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  // Define your props here with proper types
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  // Add more props as needed
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  // Default values
});

const emit = defineEmits<{
  // Define events
  click: [event: MouseEvent];
  // Add more events as needed
}>();

// Computed classes for dynamic styling
const classes = computed(() => ({
  'ep-[component-name]': true,
  [`ep-[component-name]--${props.variant}`]: props.variant,
  [`ep-[component-name]--${props.size}`]: props.size,
}));

// Computed styles if needed
const styles = computed(() => ({
  // Dynamic styles
}));

// Component logic
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.ep-[component-name] {
  // Base styles
  
  // Variants
  &--primary {
    // Primary variant styles
  }
  
  &--secondary {
    // Secondary variant styles
  }
  
  // Sizes
  &--sm {
    // Small size styles
  }
  
  &--md {
    // Medium size styles
  }
  
  &--lg {
    // Large size styles
  }
}
</style>
```

## Test Template (ep-[ComponentName].spec.ts)

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Ep[ComponentName] from './ep-[ComponentName].vue';

describe('Ep[ComponentName]', () => {
  it('renders correctly', () => {
    const wrapper = mount(Ep[ComponentName], {
      props: {
        // Add props
      },
    });
    
    expect(wrapper.exists()).toBe(true);
  });
  
  it('applies correct classes', () => {
    const wrapper = mount(Ep[ComponentName], {
      props: {
        variant: 'primary',
        size: 'md',
      },
    });
    
    expect(wrapper.classes()).toContain('ep-[component-name]');
    expect(wrapper.classes()).toContain('ep-[component-name]--primary');
    expect(wrapper.classes()).toContain('ep-[component-name]--md');
  });
  
  it('renders slot content', () => {
    const wrapper = mount(Ep[ComponentName], {
      slots: {
        default: 'Test Content',
      },
    });
    
    expect(wrapper.text()).toBe('Test Content');
  });
  
  it('emits events correctly', async () => {
    const wrapper = mount(Ep[ComponentName]);
    
    // Trigger event
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
  
  it('handles props correctly', () => {
    const wrapper = mount(Ep[ComponentName], {
      props: {
        variant: 'success',
      },
    });
    
    expect(wrapper.props('variant')).toBe('success');
  });
});
```

## README Template (README.md)

```markdown
# ep-[ComponentName]

Brief description of what this component does and how it replaces the bootstrap-vue component.

## Replaced Component

This component replaces `b-[component-name]` from bootstrap-vue.

## Usage

### Basic Usage

\`\`\`vue
<template>
  <ep-[component-name]>
    Content here
  </ep-[component-name]>
</template>

<script setup>
import Ep[ComponentName] from '@shared/components/ep-[ComponentName]/ep-[ComponentName].vue';
</script>
\`\`\`

### With Props

\`\`\`vue
<template>
  <ep-[component-name]
    variant="primary"
    size="md"
    @click="handleClick"
  >
    Content here
  </ep-[component-name]>
</template>

<script setup>
import Ep[ComponentName] from '@shared/components/ep-[ComponentName]/ep-[ComponentName].vue';

const handleClick = (event) => {
  console.log('Clicked!', event);
};
</script>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| ...` | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of component |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when component is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Main content area |

## Accessibility

- Ensure proper ARIA labels
- Keyboard navigation support
- Focus management

## Migration from b-[component-name]

### Before (bootstrap-vue)

\`\`\`vue
<b-[component-name]
  variant="primary"
  size="md"
>
  Content
</b-[component-name]>
\`\`\`

### After (custom component)

\`\`\`vue
<ep-[component-name]
  variant="primary"
  size="md"
>
  Content
</ep-[component-name]>
\`\`\`

### Breaking Changes

- List any API differences
- List any behavior changes

## Examples

### Example 1: Basic

\`\`\`vue
<ep-[component-name]>
  Simple content
</ep-[component-name]>
\`\`\`

### Example 2: With Events

\`\`\`vue
<ep-[component-name] @click="handleClick">
  Clickable content
</ep-[component-name]>
\`\`\`

## Notes

- Any special notes about this component
- Known limitations
- Browser compatibility
```

## Specific Component Templates

### Layout Component (ep-row, ep-col)

```vue
<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  // For ep-col
  cols?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  offset?: number | string;
  order?: number | string;
  alignSelf?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
}

const props = defineProps<Props>();

const classes = computed(() => {
  const classList: Record<string, boolean> = {
    'row': true, // or 'col' for ep-col
  };
  
  // Add responsive classes
  if (props.cols) classList[`col-${props.cols}`] = true;
  if (props.sm) classList[`col-sm-${props.sm}`] = true;
  if (props.md) classList[`col-md-${props.md}`] = true;
  if (props.lg) classList[`col-lg-${props.lg}`] = true;
  if (props.xl) classList[`col-xl-${props.xl}`] = true;
  
  // Add offset, order, align-self
  if (props.offset) classList[`offset-${props.offset}`] = true;
  if (props.order) classList[`order-${props.order}`] = true;
  if (props.alignSelf) classList[`align-self-${props.alignSelf}`] = true;
  
  return classList;
});
</script>

<style scoped lang="scss">
// Use Bootstrap's existing row/col classes
// Only add custom styles if needed
</style>
```

### Modal Component (ep-modal)

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal"
        tabindex="-1"
        role="dialog"
        @click.self="handleBackdropClick"
        @keydown.esc="handleEscKey"
      >
        <div class="modal-dialog" :class="sizeClass" role="document">
          <div class="modal-content">
            <div v-if="$slots.header || $slots['modal-header']" class="modal-header">
              <slot name="modal-header">
                <slot name="header" />
              </slot>
              <button
                type="button"
                class="close"
                aria-label="Close"
                @click="close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer || $slots['modal-footer']" class="modal-footer">
              <slot name="modal-footer">
                <slot name="footer" />
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="modal-backdrop">
      <div v-if="isOpen" class="modal-backdrop" />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue?: boolean;
  size?: 'sm' | 'lg' | 'xl';
  noCloseOnBackdrop?: boolean;
  noCloseOnEsc?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: undefined,
  noCloseOnBackdrop: false,
  noCloseOnEsc: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  show: [];
  hide: [];
  hidden: [];
  shown: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const sizeClass = computed(() => {
  if (props.size) return `modal-${props.size}`;
  return '';
});

const close = () => {
  isOpen.value = false;
  emit('hide');
};

const handleBackdropClick = () => {
  if (!props.noCloseOnBackdrop) {
    close();
  }
};

const handleEscKey = (event: KeyboardEvent) => {
  if (!props.noCloseOnEsc) {
    close();
  }
};

// Focus trap implementation
// Body scroll lock
// etc.

watch(isOpen, (newValue) => {
  if (newValue) {
    emit('show');
    document.body.style.overflow = 'hidden';
  } else {
    emit('hidden');
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 1050;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

// Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
```

### Table Component (ep-table)

```vue
<template>
  <div class="ep-table-wrapper">
    <table :class="tableClasses">
      <thead>
        <tr>
          <th
            v-for="field in normalizedFields"
            :key="field.key"
            :class="field.class"
            @click="handleHeaderClick(field)"
          >
            <slot :name="`head(${field.key})`" :field="field">
              {{ field.label }}
              <span v-if="field.sortable" class="sort-icon">
                {{ getSortIcon(field.key) }}
              </span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedItems" :key="index">
          <td
            v-for="field in normalizedFields"
            :key="field.key"
            :class="field.class"
          >
            <slot :name="`cell(${field.key})`" :item="item" :value="item[field.key]">
              {{ item[field.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Field {
  key: string;
  label?: string;
  sortable?: boolean;
  class?: string;
}

interface Props {
  items: any[];
  fields: (string | Field)[];
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  responsive?: boolean;
  fixed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  striped: false,
  bordered: false,
  hover: false,
  responsive: false,
  fixed: false,
});

const sortBy = ref<string | null>(null);
const sortDesc = ref(false);

const normalizedFields = computed(() => {
  return props.fields.map(field => {
    if (typeof field === 'string') {
      return { key: field, label: field };
    }
    return { ...field, label: field.label || field.key };
  });
});

const tableClasses = computed(() => ({
  'table': true,
  'table-striped': props.striped,
  'table-bordered': props.bordered,
  'table-hover': props.hover,
  'table-responsive': props.responsive,
  'table-fixed': props.fixed,
}));

const sortedItems = computed(() => {
  if (!sortBy.value) return props.items;
  
  return [...props.items].sort((a, b) => {
    const aVal = a[sortBy.value!];
    const bVal = b[sortBy.value!];
    
    if (aVal < bVal) return sortDesc.value ? 1 : -1;
    if (aVal > bVal) return sortDesc.value ? -1 : 1;
    return 0;
  });
});

const handleHeaderClick = (field: Field) => {
  if (!field.sortable) return;
  
  if (sortBy.value === field.key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = field.key;
    sortDesc.value = false;
  }
};

const getSortIcon = (key: string) => {
  if (sortBy.value !== key) return '⇅';
  return sortDesc.value ? '↓' : '↑';
};
</script>

<style scoped lang="scss">
.ep-table-wrapper {
  // Use Bootstrap table styles
}
</style>
```

## Best Practices

1. **TypeScript**: Always use TypeScript with proper interfaces
2. **Composition API**: Use `<script setup>` syntax
3. **Props Validation**: Define proper types and defaults
4. **Events**: Use typed emits
5. **Slots**: Provide flexible slot options
6. **Accessibility**: Include ARIA attributes
7. **Responsive**: Consider mobile/tablet layouts
8. **Testing**: Write comprehensive tests
9. **Documentation**: Document props, events, slots
10. **Style Scoping**: Use scoped styles, import variables

## Common Patterns

### v-model Support

```typescript
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
```

### Multiple Slots

```vue
<template>
  <div>
    <header v-if="$slots.header">
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### Teleport (for modals, dropdowns)

```vue
<template>
  <Teleport to="body">
    <div class="modal">
      <!-- Modal content -->
    </div>
  </Teleport>
</template>
```

### Focus Management

```typescript
import { ref, onMounted } from 'vue';

const focusElement = ref<HTMLElement | null>(null);

onMounted(() => {
  focusElement.value?.focus();
});
```

## Notes

- Always test your components thoroughly
- Check accessibility with vue-axe
- Verify Bootstrap CSS classes work correctly
- Consider performance for frequently used components
- Document any breaking changes from bootstrap-vue

---

Last updated: 2025-12-08

