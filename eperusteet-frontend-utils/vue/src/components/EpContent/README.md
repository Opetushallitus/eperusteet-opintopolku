Komponentti sisällön esittämiseen. Hakee kielivalinnan automaattisesti.

Sisältö esitystilassa:

```vue

new Vue({
  data(){
    return {
      value: 'Tekstiä',
    }
  },
  template: `
    <div>
        <ep-content :value="value" />
    </div>
  `
})

```

Sisältö editoitavissa:

```vue

new Vue({
  data(){
    return {
      value: 'Tekstiä',
      isEditing: true,
    }
  },
  methods: {
    muokkaa() {
      this.isEditing = !this.isEditing;
    }
  },
  template: `
    <div>
        <button @click="muokkaa()">Muokkaa</button>
        <pre v-html="value"></pre>
        <ep-content v-model="value" :is-editable="isEditing" />
    </div>
  `
})

```

Tukee myös kieliä:

```vue

<template>
<div>
    <button @click="muokkaa()">Muokkaa</button>
    <button @click="vaihdaKieli()">Vaihda kieli</button>
    <span>( Editorin kieli: {{ kieli }} )</span>
    <pre v-html="value"></pre>
    <ep-content v-model="value" :is-editable="isEditing" />
</div>
</template>

<script lang="ts">
export default {
  data(){
    return {
      value: {
        someNonEditorRelatedAttr: 'test',
        fi: 'hello',
        sv: 'world',
      },
      isEditing: true,
    }
  },
  computed: {
    kieli: function() {
     return Kielet.getSisaltoKieli.value;
    }
  },
  methods: {
    vaihdaKieli() {
      Kielet.setSisaltoKieli('sv');
    },
    muokkaa() {
      this.isEditing = !this.isEditing;
    }
  },
}
</script>

```
