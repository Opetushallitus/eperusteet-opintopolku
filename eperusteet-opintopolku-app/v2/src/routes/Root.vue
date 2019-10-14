<template>
<div>
  <header>
    <ep-navigation :sticky="true"></ep-navigation>
  </header>
  <div class="router-container">
    <router-view />
  </div>
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

header {
  background-color: #1B47AF;
}

.router-container {
}

</style>
