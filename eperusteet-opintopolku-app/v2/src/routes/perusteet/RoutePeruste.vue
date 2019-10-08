<template>
<div class="container">
  <div>
    <pre>peruste {{$route.params.perusteId}}</pre>
  </div>
</div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';
import EpRoute from '@shared/mixins/EpRoute';


@Component({
  components: {
  },
})
export default class RouteOpetussuunnitelma extends Mixins(EpRoute) {

}
</script>

<style scoped lang="scss">
</style>
