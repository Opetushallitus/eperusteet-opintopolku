<template>
  <div>

    <ep-button variant="link" @click="toggleTavoite()" v-if="oppiaineenVuosiluokka.tavoitteet.length > 0">
      {{$t('avaa-sulje-kaikki')}}
    </ep-button>

    <ep-collapse
      ref="tavoitecollapse"
      class="tavoite"
      v-for="(tavoite, index) in tavoitteet"
      :key="'tavoite'+index"
      :border-bottom="false"
      :expandedByDefault="false"
      :shadow="true">

      <template v-slot:header>
        <h3 v-html="$kaanna(tavoite.tavoite)"></h3>
      </template>

      <div v-if="valinnainen">
        <div v-for="(sisaltoalue, index) in tavoite.sisaltoalueet" :key="'sisaltoalue'+index">
          <ep-content-viewer :value="$kaanna(sisaltoalue.sisaltoalueet.kuvaus)" :kuvat="kuvat" />
        </div>
      </div>

      <div v-else>
        <div v-if="tavoite.oppiaineenTavoitteenOpetuksenTavoitteet && tavoite.oppiaineenTavoitteenOpetuksenTavoitteet.length > 0" class="mb-4">
          <h4>{{$t('opetuksen-tavoitteet')}}</h4>
          <div v-for="(otavoite, index) in tavoite.oppiaineenTavoitteenOpetuksenTavoitteet" :key="'ot'+index" class="mt-3">
            <span v-html="$kaanna(otavoite.tavoite)"></span>
          </div>
        </div>

        <div v-if="tavoite.tavoitteistaJohdetutOppimisenTavoitteet">
          <h4>{{$t('tavoitteista-johdetut-oppimisen-tavoitteet')}}</h4>
          <ep-content-viewer :value="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)" :kuvat="kuvat" />
        </div>

        <div class="inner-collapse mb-4" v-if="tavoite.sisaltoalueet.length > 0">
          <h4>{{$t('sisaltoalueet')}}</h4>
          <ep-collapse v-for="(sisaltoalue, index) in tavoite.sisaltoalueet"
                       :key="'sisaltoalue'+index"
                       ref="sisaltoaluecollapse"
                       class="sisaltoalue"
                       :borderBottom="false"
                       :expanded-by-default="false"
                       chevronLocation="left"
                       tyyppi="perusopetus-vuosiluokka-sisaltoalue"
                       :use-padding="false">
            <template v-slot:header>
              <h5 class="nimi" v-html="$kaanna(sisaltoalue.nimi)"></h5>
            </template>

            <div class="pl-4 mb-4 sisaltoaluekuvaus" v-if="sisaltoalue.vuosiluokanSisaltoalue">
              <div v-if="sisaltoalue.kuvaus" v-html="$kaanna(sisaltoalue.kuvaus)"></div>
              <div v-if="sisaltoalue.vuosiluokanSisaltoalue.kaytaOmaaKuvausta || sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus">
                <div class="font-weight-bold">{{$t('paikallinen-teksti')}}</div>
                <div v-if="sisaltoalue.vuosiluokanSisaltoalue.kaytaOmaaKuvausta" v-html="$kaanna(sisaltoalue.vuosiluokanSisaltoalue.omaKuvaus)"></div>
                <div v-else-if="sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus" v-html="$kaanna(sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus)"></div>
              </div>
            </div>

          </ep-collapse>
        </div>

        <b-row class="mb-2" v-if="tavoite.laajaalaisetosaamiset">
          <b-col class="inner-list" v-if="tavoite.laajaalaisetosaamiset.length > 0">
            <h4>{{$t('laaja-alaisen-osaamisen-alueet')}}</h4>

          <ep-collapse v-for="(lao, index) in tavoite.laajaalaisetosaamiset"
                       :key="'lao'+index"
                       :borderBottom="false"
                       :expanded-by-default="false"
                       chevronLocation="left"
                       class="mt-0 pt-0"
                       :use-padding="false">

            <template v-slot:header>
              <h5 class="nimi" v-html="$kaanna(lao.nimi)"></h5>
            </template>

            <ep-content-viewer :value="$kaanna(lao.kuvaus)" :kuvat="kuvat" />

          </ep-collapse>

          </b-col>
          <b-col v-if="tavoite.kohdealueet.length > 0">
            <h4>{{$t('tavoitealue')}}</h4>
            <div v-for="(kohdealue, index) in tavoite.kohdealueet" :key="'kohdealue'+index" class="mt-4 pt-1">
              <ep-order-color-ball class="pr-2" :index="kohdealue.index" />
              <span>{{$kaanna(kohdealue.nimi)}}</span>
            </div>
          </b-col>
        </b-row>

        <div class="mb-4" v-if="tavoite.arvioinninKuvaus">
          <h4>{{ $t('arvioinnin-kohde') }}</h4>
          <span v-html="$kaanna(tavoite.arvioinninKuvaus)"></span>
        </div>

        <div class="mb-4" v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0">
          <h4 class="mb-0 pb-0">{{$t('arviointi-vuosiluokan-paatteeksi')}}</h4>
          <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
        </div>

        <div class="mb-4" v-if="tavoite.vuosiluokanTavoite && tavoite.vuosiluokanTavoite.tavoite">
          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <div v-html="$kaanna(tavoite.vuosiluokanTavoite.tavoite)"></div>
        </div>

        <div class="mb-4" v-if="tavoite.vapaaTeksti">
          <h4>{{ $t('lisatietoa') }}</h4>
          <div v-html="$kaanna(tavoite.vapaaTeksti)"></div>
        </div>
      </div>

    </ep-collapse>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpOrderColorBall from '@shared/components/EpColorIndicator/EpOrderColorBall.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpArvioinninkohteetTable from '@shared/components/EpArvioinninkohteetTable/EpArvioinninkohteetTable.vue';

@Component({
  components: {
    EpButton,
    EpArvioinninkohteetTable,
    EpContentViewer,
    EpOrderColorBall,
    EpCollapse,
  },
})
export default class OppiaineenVuosiluokka extends Vue {
  @Prop({ required: true })
  private oppiaineenVuosiluokka!: any;

  @Prop({ required: false })
  private valinnainen!: boolean;

  @Prop({ required: true })
  private kuvat!: any[];

  get tavoitteet() {
    return this.oppiaineenVuosiluokka?.tavoitteet;
  }

  toggleTavoite() {
    _.forEach(this.$refs.tavoitecollapse, (tavoite: any) => tavoite.toggle());
  }
}

</script>

<style scoped lang="scss">

::v-deep .ep-button .btn-link {
  padding-left: 0;
}

.nimi {
  line-height: 1.7;
}

</style>
