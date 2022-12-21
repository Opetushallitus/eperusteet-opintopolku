<template>
  <div class="notifikaatio text-center py-3" :class="notifikaatioClass" v-sticky sticky-z-index="5000" v-if="notifikaatio" ref="stickyElement">
    {{notifikaatio}}
    <span v-if="!isEsikatselu && versio">
      {{$t('siirry')}} <span class="btn-link clickable" @click="toUusimpaan">{{$t('uusimpaan-versioon')}}.</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Sticky from 'vue-sticky-directive';
import * as _ from 'lodash';

@Component({
  directives: {
    Sticky,
  },
})
export default class EpEsikatseluNotifikaatio extends Vue {
  navBarHeight: number = 0;

  mounted() {
    if (this.notifikaatio) {
      const navbar = document.getElementById('navigation-bar');
      (this.$refs['stickyElement'] as any)['@@vue-sticky-directive'].options.topOffset = navbar?.getBoundingClientRect().height || 0;
    }
  }

  get offset() {
    return `{top: ${this.navBarHeight}}`;
  }

  get notifikaatioClass() {
    return this.isEsikatselu ? 'esikatselu' : 'katselu';
  }

  get isEsikatselu() {
    return this.versio === '0';
  }

  get versio() {
    return this.$route.params?.revision;
  }

  @Watch('versio')
  async revisionChange() {
    this.$router.go(0);
  }

  get notifikaatio() {
    if (this.isEsikatselu) {
      if (this.$route.params?.perusteId) {
        return this.$t('olet-esikastelutilassa-perustetta-ei-ole-viela-julkaistu');
      }
      else {
        return this.$t('olet-esikatselutilassa-suunnitelmaa-ei-ole-viela-julkaistu');
      }
    }

    if (this.versio) {
      if (this.$route.params?.perusteId) {
        return `${this.$t('katselet-perusteen-vanhentunutta-versiota')} (${this.versio}).`;
      }
      else {
        return `${this.$t('katselet-suunnitelman-vanhentunutta-versiota')} (${this.versio}).`;
      }
    }
  }

  async toUusimpaan() {
    let route = _.assign({}, this.$route);
    delete route.params.revision;
    await this.$router.push({ name: route.name!, params: route.params });
    this.$router.go(0);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .notifikaatio {
    width: 100% !important;
    &.esikatselu {
      background-color: $gray-lighten-4;
    }

    &.katselu {
      background-color: $blue-lighten-4;
    }
  }

</style>
