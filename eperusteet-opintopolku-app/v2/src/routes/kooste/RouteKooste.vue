<template>
<div class="kooste-container">
  <header>
    <ep-navigation :sticky="true"></ep-navigation>
  </header>
  <div class="container">
    <p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p><p>Lorem ipsum</p>
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

.kooste-container {
  background-color: $etusivu-background;
}

.container {
  @media (max-width: 767.98px) {
    max-width: none;
  }
}
</style>
