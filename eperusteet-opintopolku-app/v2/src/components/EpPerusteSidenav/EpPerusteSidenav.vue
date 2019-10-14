<template>
<div class="sidebar">
  <div class="search">
    <ep-search></ep-search>
  </div>

  <ul class="navigation">
    <li>
      li
      <ul>
        <li>sub li</li>
      </ul>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';

@Component({
  components: {
    EpSearch,
  }
})
export default class EpPerusteSidenav extends Vue {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.sidebar {
  .search {
    padding: 10px 20px 10px 30px;
  }

  ul.navigation {

  }
}
</style>
