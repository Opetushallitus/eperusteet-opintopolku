<template>
  <div>
    <div v-for="(alue, alueindex) in tavoitteetAlueilla" :key="'alue'+alueindex" class="mb-4">
      <template v-if="alue.tavoitteet.length > 0">

        <div class="d-flex justify-content-between align-items-center mt-4 mb-3" :class="{'mt-5' : alueindex > 0}">
          <h3 class="mb-0" v-if="alue.nimi">{{$kaanna(alue.nimi)}}</h3>

          <ep-button variant="link" @click="toggleTavoite()" v-if="oppiaineenVuosiluokka.tavoitteet.length > 0 && alueindex === 0">
            {{$t('avaa-sulje-kaikki')}}
          </ep-button>
        </div>

        <ep-collapse
          v-for="(tavoite, tavoiteindex) in alue.tavoitteet"
          :class="{'mt-3': tavoiteindex > 0}"
          ref="tavoitecollapse"
          class="tavoite"
          :key="alueindex + 'tavoite'+tavoiteindex"
          :border-bottom="false"
          :expandedByDefault="false">

          <template v-slot:header>
            <h3 v-html="$kaanna(tavoite.tavoite)"></h3>
          </template>

          <div class="mt-3">
            <div v-if="valinnainen">
              <div v-for="(sisaltoalue, index) in tavoite.sisaltoalueet" :key="'sisaltoalue'+index">
                <ep-content-viewer :value="$kaanna(sisaltoalue.sisaltoalueet.kuvaus)" :kuvat="kuvat" />
              </div>
            </div>

            <div v-else>
              <div v-if="tavoite.oppiaineenTavoitteenOpetuksenTavoitteet && tavoite.oppiaineenTavoitteenOpetuksenTavoitteet.length > 0" class="mb-4">
                <h4>{{$t('opetuksen-tavoitteet')}}</h4>
                <div v-for="(otavoite, index) in tavoite.oppiaineenTavoitteenOpetuksenTavoitteet" :key="alueindex + 'ot'+index" class="mt-3">
                  <span v-html="$kaanna(otavoite.tavoite)"></span>
                </div>
              </div>

              <div v-if="tavoite.tavoitteistaJohdetutOppimisenTavoitteet">
                <h4>{{$t('tavoitteista-johdetut-oppimisen-tavoitteet')}}</h4>
                <ep-content-viewer :value="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)" :kuvat="kuvat" />
              </div>

              <div class="mb-4 paikallinen-tarkennus-alue" v-if="tavoite.vuosiluokanTavoite && tavoite.vuosiluokanTavoite.tavoite">
                <h4>{{ $t('paikallinen-teksti') }}</h4>
                <div v-html="$kaanna(tavoite.vuosiluokanTavoite.tavoite)"></div>
              </div>

              <TavoitteenSisaltoalueet :sisaltoalueet="tavoite.sisaltoalueet" :naytaSisaltoalueet="naytaSisaltoalueet" />

              <div class="mb-2" v-if="tavoite.laajaalaisetosaamiset && naytaLaajaAlaisetOsaamiset && tavoite.laajaalaisetosaamiset.length > 0">
                  <h4>{{$t('laaja-alaisen-osaamisen-alueet')}}</h4>
                  <ep-collapse v-for="(lao, index) in tavoite.laajaalaisetosaamiset"
                              :key="alueindex + 'lao'+index"
                              :borderBottom="false"
                              :expanded-by-default="false"
                              chevronLocation="left"
                              class="mt-0 pt-0"
                              :use-padding="false">

                    <template v-slot:header>
                      <h5 class="nimi" v-html="$kaanna(lao.perusteenLao.nimi)"></h5>
                    </template>
                    <ep-content-viewer v-if="lao.paikallinenLao.naytaPerusteenPaatasonLao" :value="$kaanna(lao.perusteenLao.kuvaus)" :kuvat="kuvat" />
                    <ep-content-viewer v-if="lao.paikallinenLao.naytaPerusteenVlkTarkennettuLao" :value="$kaanna(lao.perusteenVlkLao.kuvaus)" :kuvat="kuvat" />

                    <template v-if="lao.paikallinenLao && lao.paikallinenLao.kuvaus">
                      <h6 class="font-weight-600">{{ $t('paikallinen-teksti') }}</h6>
                      <ep-content-viewer v-if="lao.paikallinenLao && lao.paikallinenLao.kuvaus" :value="$kaanna(lao.paikallinenLao.kuvaus)" :kuvat="kuvat" />
                    </template>

                  </ep-collapse>
              </div>

              <template v-if="naytaArviointikriteerit">
                <div class="mb-4" v-if="tavoite.arvioinninKuvaus">
                  <h4>{{ $t('arvioinnin-kohde') }}</h4>
                  <div class="arvioinnin-kuvaus d-inline-block" v-html="$kaanna(tavoite.arvioinninKuvaus)"></div>
                </div>

                <div class="mb-4" v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0">
                  <h4 class="mb-0 pb-0">{{$t('arviointi-vuosiluokan-paatteeksi')}}</h4>
                  <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
                </div>
              </template>

              <div class="mb-4" v-if="tavoite.vapaaTeksti">
                <h4>{{ $t('lisatietoa') }}</h4>
                <div v-html="$kaanna(tavoite.vapaaTeksti)"></div>
              </div>
            </div>
          </div>
        </ep-collapse>
      </template>
    </div>
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
import TavoitteenSisaltoalueet from './TavoitteenSisaltoalueet.vue';

@Component({
  components: {
    EpButton,
    EpArvioinninkohteetTable,
    EpContentViewer,
    EpOrderColorBall,
    EpCollapse,
    TavoitteenSisaltoalueet,
  },
})
export default class OppiaineenVuosiluokka extends Vue {
  @Prop({ required: true })
  private oppiaineenVuosiluokka!: any;

  @Prop({ required: false })
  private valinnainen!: boolean;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ default: true })
  private naytaSisaltoalueet!: boolean;

  @Prop({ default: true })
  private naytaArviointikriteerit!: boolean;

  @Prop({ default: true })
  private naytaLaajaAlaisetOsaamiset!: boolean;

  get tavoitteet() {
    return _.map(this.oppiaineenVuosiluokka?.tavoitteet, tavoite => {
      return {
        ...tavoite,
        tavoite: this.$kaanna(tavoite.tavoite)
          .replace('<p>', '')
          .replace('</p>', ''),
      };
    });
  }

  get tavoitteetAlueilla() {
    if (_.size(this.tavoitealueet) > 0) {
      return [
        ..._.map(this.tavoitealueet, tavoitealue => {
          return {
            nimi: tavoitealue.nimi,
            tavoitteet: _.filter(this.tavoitteet, tavoite => _.find(tavoite.kohdealueet, { nimi: tavoitealue.nimi })),
          };
        }),
      ];
    }
    else {
      return [{ nimi: '', tavoitteet: this.tavoitteet }];
    }
  }

  toggleTavoite() {
    _.forEach(this.$refs.tavoitecollapse, (tavoite: any) => tavoite.toggle());
  }

  get tavoitealueet() {
    return _.chain(this.tavoitteet)
      .map('kohdealueet')
      .flatten()
      .uniqBy('nimi')
      .value();
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.tavoite {
  border: 2px solid#E0E0E1;
  border-radius: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

::v-deep .ep-button .btn-link {
  padding-left: 0;
}

.nimi {
  line-height: 1.7;
}

.arvioinnin-kuvaus {
  border-radius: 1rem;
  background-color: #66CCCC;
  padding: 0.5rem 0.7rem;
}

::v-deep .ep-collapse {
  margin-top: 0px;

  .collapse-button {
    margin-bottom: 0px !important;
  }
}

::v-deep .ep-button .btn{
  padding: 0;
}

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;
}

</style>
