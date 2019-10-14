<template>
  <pre>peruste sidenav</pre>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component
export default class EpPerusteSidenav extends Vue {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;
}
</script>

<style scoped lang="scss">

</style>
