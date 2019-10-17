<template>
<div>
  <header role="banner">
    <ep-navigation :sticky="true"></ep-navigation>
  </header>
  <main class="router-container" role="main">
    <router-view />
  </main>
  <ep-footer />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EpFooter from '@/components/EpFooter/EpFooter.vue';
import EpNavigation from '@/components/EpNavigation/EpNavigation.vue';

@Component({
  components: {
    EpFooter,
    EpNavigation,
  },
})
export default class Root extends Vue {
}
</script>

<style lang="scss">
@import '../styles/_variables.scss';

main.router-container {
  min-height: calc(100vh - 400px);
  margin-bottom: 40px;
}

</style>
