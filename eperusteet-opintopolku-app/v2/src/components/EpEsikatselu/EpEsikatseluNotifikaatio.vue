<template>
    <portal to="footernotifikaatio">
      <div class="bottom text-center py-1 mb-1" v-sticky sticky-side="bottom" sticky-z-index="5000">
        <slot/>
      </div>
    </portal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Sticky from 'vue-sticky-directive';

@Component({
  directives: {
    Sticky,
  },
})
export default class EpEsikatseluNotifikaatio extends Vue {

}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .bottom {
    width: 100% !important;
    border: 1px solid $gray-lighten-8;
    background-color: $gray-lighten-5;
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;
    position: relative;
    bottom: 0;
    position: fixed;
  }

</style>
