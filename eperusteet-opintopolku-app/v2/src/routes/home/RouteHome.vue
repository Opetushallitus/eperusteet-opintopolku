<template>
<div class="home-container">
  <header>
    <ep-navigation :sticky="true"></ep-navigation>
  </header>
  <div class="container">
    <p style="height: 500px">Etusivu placeholder</p>
  <br>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  EpNavigation,
} from '@/components';

@Component({
  components: {
    EpNavigation,
  }
})
export default class Home extends Vue {
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

header {
  background-color: #1B47AF;
}

.home-container {
  background-color: $etusivu-background;
}

.container {
  // Todo: käytä muuttujaa
  @media (max-width: 767.98px) {
    max-width: none;
  }
}
</style>
