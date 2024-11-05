<template>
  <div
      id="notification-bar"
      class="notifikaatio justify-content-center py-3 korostus"
      :class="notifikaatioClass"
      v-sticky
      sticky-z-index="5000"
      v-if="hasNotification"
      ref="stickyElement">
    <EpMaterialIcon icon-shape="outlined">info</EpMaterialIcon>
    <slot>
      <span class="notifikaatio-text">{{ notifikaatio }}</span>
      <div v-if="!isEsikatselu && versio && hasSisaltoKielelle">
        <span class="btn-link clickable" @click="toUusimpaan">{{$t('siirry-uusimpaan-julkaisuun')}}.</span>
      </div>
    </slot>
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
export default class EpNotificationBar extends Vue {
  @Prop({ required: false })
  private julkaisuPvm?: any;

  @Prop({ required: false, default: true })
  private hasSisaltoKielelle?: boolean;

  navBarHeight: number = 0;

  mounted() {
    if (this.hasNotification) {
      const navbar = document.getElementById('navigation-bar');
      (this.$refs['stickyElement'] as any)['@@vue-sticky-directive'].options.topOffset = navbar?.getBoundingClientRect().height || 0;
    }
  }

  get hasNotification() {
    return this.notifikaatio || this.hasDefaultSlotContent;
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

  get tyyppi(): 'peruste' | 'suunnitelma' {
    return this.$route.params?.perusteId ? 'peruste' : 'suunnitelma';
  }

  get notifikaatio() {
    if (this.isEsikatselu) {
      if (this.tyyppi === 'peruste') {
        return this.$t('olet-esikastelutilassa-perustetta-ei-ole-viela-julkaistu');
      }
      else {
        return this.$t('olet-esikatselutilassa-suunnitelmaa-ei-ole-viela-julkaistu');
      }
    }

    if (!this.hasSisaltoKielelle) {
      return this.$t('sisaltoa-ei-saatavilla');
    }

    if (this.versio) {
      if (this.tyyppi === 'peruste') {
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

  get hasDefaultSlotContent() {
    return !!this.$slots.default;
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

    &.korostus, .korostus {
      font-weight: 600 !important;
    }
  }

</style>
