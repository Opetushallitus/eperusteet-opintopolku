<template>
  <div>
    <EpMaterialIcon class="default-icon clickable" icon-shape="outlined" id="infopopup">info</EpMaterialIcon>
    <b-popover
      target="infopopup"
      triggers="hover click blur">
      <slot/>
    </b-popover>
  </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpInfoPopover extends Vue {

}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
