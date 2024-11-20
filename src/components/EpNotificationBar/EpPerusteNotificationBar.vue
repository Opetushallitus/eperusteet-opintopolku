<template>
  <EpNotificationBar :julkaisu-pvm="julkaisuPvm" :has-sisalto-kielelle="hasSisaltoKielelle" :maxRevision="maxRevision">
    <template v-if="voimassaolo">
      <div class="notifikaatio-text" v-if="voimassaolo === 'tuleva'">
        <span>{{ $t('katselet-voimaantulevaa-perustetta', {voimaantulo: $sd(currentJulkaisu.muutosmaarays.voimassaoloAlkaa)}) }} </span>
        <span class="btn-link clickable korostus" @click="toVoimassaolevaanJulkaisuun">{{$t('voimassaolevaan-perusteeseen')}}.</span>
      </div>
      <div class="notifikaatio-text" v-if="voimassaolo === 'voimassa'">
        <span>{{ $t('katselet-talla-hetkella-voimassaolevaa-perustetta') }}. </span>
        <span>{{ $t('siirry') }} </span>
        <span class="btn-link clickable korostus" @click="toUusimpaanJulkaisuun">{{$t('uusimpaan-perusteeseen')}}, </span>
        <span>{{ $t('joka-on-tulossa-voimaan', {voimaantulo: $sd(uusinJulkaisu.muutosmaarays.voimassaoloAlkaa)}) }}.</span>
      </div>
    </template>
  </EpNotificationBar>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpNotificationBar from '@/components/EpNotificationBar/EpNotificationBar.vue';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpNotificationBar,
  },
})
export default class EpPerusteNotificationBar extends Vue {
  @Prop()
  private julkaisut?: any[];

  @Prop()
  private peruste?: any;

  get julkaisutSorted() {
    return _.sortBy(this.julkaisut, 'revision');
  }

  get julkaisutReversed() {
    return _.clone(this.julkaisutSorted).reverse();
  }

  get ensimmainenTulevaMuutosmaarays() {
    return _.find(this.julkaisutSorted, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
  }

  get uusinTulevaMuutosmaarays() {
    return _.find(this.julkaisutReversed, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
  }

  get uusinVoimassaolevaJulkaisu() {
    return _.find(this.julkaisutReversed, julkaisu => julkaisu.revision < this.ensimmainenTulevaMuutosmaarays.revision);
  }

  get voimassaolo() {
    if (this.ensimmainenTulevaMuutosmaarays) {
      if (this.currentRevision >= this.ensimmainenTulevaMuutosmaarays?.revision) {
        return 'tuleva';
      }

      if (this.currentRevision >= this.uusinVoimassaolevaJulkaisu?.revision) {
        return 'voimassa';
      }
    }
  }

  get currentRevision() {
    return _.toNumber(this.$route?.params?.revision || _.max(_.map(this.julkaisut, 'revision')));
  }

  get maxRevision() {
    return _.max(_.map(this.julkaisut, 'revision'));
  }

  get uusinJulkaisu() {
    return {
      ..._.last(this.julkaisut),
      muutosmaarays: this.uusinTulevaMuutosmaarays?.muutosmaarays,
    };
  }

  get currentJulkaisu() {
    const currentJulkaisu = _.find(this.julkaisut, julkaisu => julkaisu.revision === this.currentRevision);

    if (currentJulkaisu) {
      return {
        ...currentJulkaisu,
        muutosmaarays: currentJulkaisu?.muutosmaarays || _.find(this.julkaisutReversed, j => j.revision < currentJulkaisu.revision && j.muutosmaarays)?.muutosmaarays,
      };
    }
  }

  get julkaisuPvm() {
    return this.currentJulkaisu?.luotu;
  }

  async toVoimassaolevaanJulkaisuun() {
    let route = _.assign({}, this.$route);
    await this.$router.push(
      {
        name: route.name!,
        params: {
          ...route.params,
          revision: _.toString(this.uusinVoimassaolevaJulkaisu?.revision),
        },
      });
  }

  get hasSisaltoKielelle() {
    return _.includes(this.peruste?.kielet, _.toString(Kielet.getSisaltoKieli.value));
  }

  async toUusimpaanJulkaisuun() {
    let route = _.assign({}, this.$route);
    delete route.params?.revision;
    await this.$router.push({ name: route.name!, params: route.params });
    this.$router.go(0);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
