<template>
  <div v-if="notifikaatio"
       class="notifikaatio justify-content-center p-3"
       :class="notifikaatioClass"
       v-sticky
       sticky-z-index="500"
       ref="stickyElement">
    <div class="ml-auto"></div>
    <div class="d-flex">
      <EpMaterialIcon icon-shape="outlined">info</EpMaterialIcon>
      <span class="notifikaatio-text korostus">{{ notifikaatio }}</span>
      <router-link v-if="targerVersio" :to="{ name: 'perusteTiedot', params: { perusteId: perusteId, revision: targerVersio }}">
        {{ $t('siirry-talla-hetkella-voimassaolevaan-perusteeseen') }}
      </router-link>
      <div v-else-if="showUusimpaanLink">
        <span class="btn-link clickable korostus" @click="toUusimpaan">{{ isLinkToVoimaantulevaan ? $t('siirry-voimaantulevaan-perusteeseen') : $t('siirry-uusimpaan-julkaisuun')}}</span>
      </div>
    </div>
    <div class="ml-auto closeBtn">
      <div v-if="targerVersio || isLinkToVoimaantulevaan" @click="closeBar()">
        <EpMaterialIcon>close</EpMaterialIcon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Sticky from 'vue-sticky-directive';
import * as _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { JulkaisuBaseDto } from '@shared/generated/eperusteet';

@Component({
  components: {
    EpMaterialIcon,
  },
  directives: {
    Sticky,
  },
})
export default class EpNotificationBar extends Vue {
  @Prop({ required: false, default: true })
  private hasSisaltoKielelle?: boolean;

  @Prop({ required: true })
  private julkaisut?: JulkaisuBaseDto[];

  targerVersio: number = 0;
  navBarHeight: number = 75;
  isNotificationBarHidden: boolean = false;
  isLinkToVoimaantulevaan: boolean = false;

  mounted() {
    if (this.notifikaatio) {
      const navbar = document.getElementById('navigation-bar');
      (this.$refs['stickyElement'] as any)['@@vue-sticky-directive'].options.topOffset = navbar?.getBoundingClientRect().height || this.navBarHeight;
    }
  }

  @Watch('versio')
  async revisionChange() {
    this.$router.go(0);
  }

  get notifikaatioClass() {
    return this.isNotificationBarHidden ? 'hidden' : this.isEsikatselu ? 'esikatselu' : 'katselu';
  }

  get isEsikatselu() {
    return this.versio === '0';
  }

  get versio() {
    return this.$route.params?.revision;
  }

  get showUusimpaanLink() {
    return !this.isEsikatselu && this.hasSisaltoKielelle;
  }

  get perusteId() {
    return this.$route.params?.perusteId || (this.julkaisut && this.julkaisut[0].peruste?.id);
  }

  get mapJulkaisut() {
    return _.chain(this.julkaisut)
      .map(julkaisu => {
        return {
          revision: julkaisu.revision,
          isSelected: julkaisu.revision === _.toNumber(this.$route.params?.revision),
          isVoimassa: this.isVoimassa(julkaisu),
          isTulossaVoimaan: this.isTulossaVoimaan(julkaisu),
          voimaantuloPvm: julkaisu.muutosmaaraysVoimaan || julkaisu.muutosmaarays?.voimassaoloAlkaa,
          julkaisuPvm: julkaisu ? julkaisu.luotu : null,
        };
      })
      .sortBy('revision')
      .reverse()
      .value();
  }

  closeBar() {
    this.isNotificationBarHidden = true;
  }

  isVoimassa(julkaisu) {
    return (julkaisu.muutosmaaraysVoimaan && julkaisu.muutosmaaraysVoimaan <= Date.now()) || (julkaisu.muutosmaarays?.voimassaoloAlkaa <= Date.now());
  }

  isTulossaVoimaan(julkaisu) {
    return (julkaisu.muutosmaaraysVoimaan && julkaisu.muutosmaaraysVoimaan > Date.now()) || (julkaisu.muutosmaarays?.voimassaoloAlkaa > Date.now());
  }

  versioBannerText(voimassaVersio, tulevaVersio, currentVersio) {
    if (tulevaVersio && (!this.versio || (this.versio && this.versio >= tulevaVersio.revision))) {
      this.targerVersio = tulevaVersio.revision - 1;
      return this.$t('katselet-voimaantulevaa', { date: this.$sd(tulevaVersio.voimaantuloPvm) });
    }
    else if (this.versio) {
      if (voimassaVersio && this.versio >= voimassaVersio.revision) {
        this.isLinkToVoimaantulevaan = true;
        return this.$t('katselet-voimassaolevaa');
      }
      else {
        return this.$t('katselet-vanhaa', { date: this.$sd(currentVersio.julkaisuPvm) });
      }
    }
  }

  get selectedVersio() {
    return this.mapJulkaisut.find(julkaisu => julkaisu.isSelected);
  }

  get voimassaVersio() {
    return this.mapJulkaisut.find(julkaisu => julkaisu.isVoimassa);
  }

  get tulevaVersio() {
    return this.mapJulkaisut.find(julkaisu => julkaisu.isTulossaVoimaan);
  }

  get notifikaatio() {
    if (!this.hasSisaltoKielelle) {
      return this.$t('sisaltoa-ei-saatavilla');
    }

    if (this.voimassaVersio || this.tulevaVersio) {
      return this.versioBannerText(this.voimassaVersio, this.tulevaVersio, this.selectedVersio);
    }

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
        return this.$t('katselet-vanhaa', { date: this.julkaisuPvmText });
      }
      else {
        return `${this.$t('katselet-suunnitelman-vanhentunutta-versiota')} (${this.versio}).`;
      }
    }
  }

  get julkaisuPvmText() {
    return this.selectedVersio && this.selectedVersio.julkaisuPvm ? this.$sd(this.selectedVersio.julkaisuPvm) : '';
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

  &.hidden {
    display: none;
  }

  .notifikaatio-text {
    margin: 0 5px 0 5px;
  }

  .korostus {
    font-weight: 600;
  }
}

.closeBtn {
  cursor: pointer;
}

</style>
