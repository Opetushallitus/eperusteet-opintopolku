<template>
  <div class="notifikaatio justify-content-center py-3" :class="notifikaatioClass" v-sticky sticky-z-index="5000" v-if="notifikaatio" ref="stickyElement">
    <EpMaterialIcon icon-shape="outlined">info</EpMaterialIcon>
    <span class="notifikaatio-text korostus">{{ notifikaatio }}</span>
    <span v-if="!isEsikatselu && versio">
      <span class="btn-link clickable korostus" @click="toUusimpaan">{{$t('siirry-uusimpaan-julkaisuun')}}.</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Sticky from 'vue-sticky-directive';
import * as _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
  directives: {
    Sticky,
  },
})
export default class EpEsikatseluNotifikaatio extends Vue {
  @Prop({ required: false })
  private julkaisuPvm?: any;

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
        return `${this.$t('katselet-perusteen-aiempaa-julkaisua')}${this.julkaisuPvmText}`;
      }
      else {
        return `${this.$t('katselet-suunnitelman-vanhentunutta-versiota')} (${this.versio}).`;
      }
    }
  }

  get julkaisuPvmText() {
    return this.julkaisuPvm ? ' (' + this.$sd(this.julkaisuPvm) + ').' : '.';
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
    display: flex;

    &.esikatselu {
      background-color: $gray-lighten-4;
    }

    &.katselu {
      background-color: $blue-lighten-4;
    }

    .notifikaatio-text {
      margin: 0 5px 0 5px;
    }

    .korostus {
      font-weight: 600;
    }
  }

</style>
