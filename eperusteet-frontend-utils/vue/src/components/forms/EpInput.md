EpInput example:

```vue
<template>
<div>
    <div>
        <pre>{{ text }}</pre>
    </div>
    <b-form-checkbox v-model="edit">
      Muokattava
    </b-form-checkbox>
    <ep-input
        v-model="text"
        :is-editing="edit" />
</div>
</template>

<script>
export default {
  data(){
    return {
        edit: true,
        text: {
            fi: '',
        },
    }
  },
}
</script>
```
