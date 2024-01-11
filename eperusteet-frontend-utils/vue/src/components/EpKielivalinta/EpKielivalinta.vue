<template>
   <b-dropdown size="sm" class="kielivalinta" right>
    <template slot="button-content">
      <span>{{ $t("kieli-sisalto") }}:
        <span class="valittukieli">{{ $t(sisaltoKieli) }}</span>
        <EpMaterialIcon>expand_more</EpMaterialIcon>
      </span>
    </template>
    <b-dropdown-item @click="valitseSisaltoKieli(kieli)" v-for="kieli in sovelluksenKielet" :key="kieli" :disabled="kieli === sisaltoKieli">{{ $t(kieli) }}</b-dropdown-item>
  </b-dropdown>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpKielivalinta extends Vue {
  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get sovelluksenKielet() {
    return UiKielet;
  }

  valitseSisaltoKieli(kieli: Kieli) {
    Kielet.setSisaltoKieli(kieli);
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  /deep/ .dropdown-toggle::after {
    display:none;
  }

  /deep/ .btn {
    background-color: $white !important;
    color: $black  !important;
    border-color: $white !important;
    box-shadow: 0;
  }

  /deep/ .btn-secondary,
  /deep/ .btn-secondary:not(:disabled):not(.disabled):active:focus,
  /deep/ .btn-secondary:not(:disabled):not(.disabled).active:focus,
  /deep/ .show > .btn-secondary.dropdown-toggle:focus {
    box-shadow: none;
  }

  .valittukieli {
    padding: 5px 70px 5px 10px;
    border: 1px solid $gray-lighten-3;
    border-radius: 5px;
  }

  .valintanuoli {
    margin-left: -20px;
  }

</style>
