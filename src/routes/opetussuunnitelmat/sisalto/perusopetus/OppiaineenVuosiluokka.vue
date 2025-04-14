<template>
  <div>
    <div
      v-for="(alue, alueindex) in tavoitteetAlueilla"
      :key="'alue'+alueindex"
      class="mb-4"
    >
      <template v-if="alue.tavoitteet.length > 0">
        <div
          class="d-flex justify-content-between align-items-center mb-3"
          :class="{'mt-5' : alueindex > 0, 'mt-4': !!alue.nimi}"
        >
          <h3
            v-if="alue.nimi"
            class="mb-0"
          >
            {{ $kaanna(alue.nimi) }}
          </h3>

          <portal
            to="sulje-kaikki-tavoitteet-portal"
            class="ml-auto"
            :disabled="avaaSuljeSiirrettavissa === false || !!alue.nimi"
          >
            <ep-button
              v-if="oppiaineenVuosiluokka.tavoitteet.length > 0 && alueindex === 0"
              variant="link"
              @click="toggleTavoite()"
            >
              {{ $t('avaa-sulje-kaikki') }}
            </ep-button>
          </portal>
        </div>

        <ep-collapse
          v-for="(tavoite, tavoiteindex) in alue.tavoitteet"
          ref="tavoitecollapse"
          :key="alueindex + 'tavoite'+tavoiteindex"
          :class="{'mt-3': tavoiteindex > 0}"
          class="tavoite"
          :border-bottom="false"
          :expanded-by-default="false"
        >
          <template #header>
            <h3 v-html="tavoite.tavoite" />
          </template>

          <div class="mt-3">
            <div v-if="valinnainen">
              <template v-if="pohjanTavoitteet[tavoite.tunniste]">
                <h4>{{ $kaanna(pohjaNimi) }}</h4>
                <ep-content-viewer
                  :value="$kaanna(pohjanTavoitteet[tavoite.tunniste].sisaltoalueet[0].sisaltoalueet.kuvaus)"
                  :kuvat="kuvat"
                />
              </template>

              <div
                v-for="(sisaltoalue, index) in tavoite.sisaltoalueet"
                :key="'sisaltoalue'+index"
              >
                <ep-content-viewer
                  :value="$kaanna(sisaltoalue.sisaltoalueet.kuvaus)"
                  :kuvat="kuvat"
                />
              </div>
            </div>

            <div v-else>
              <div
                v-if="tavoite.oppiaineenTavoitteenOpetuksenTavoitteet && tavoite.oppiaineenTavoitteenOpetuksenTavoitteet.length > 0"
                class="mb-4"
              >
                <h5>{{ $t('opetuksen-tavoitteet') }}</h5>
                <div
                  v-for="(otavoite, index) in tavoite.oppiaineenTavoitteenOpetuksenTavoitteet"
                  :key="alueindex + 'ot'+index"
                  class="mt-3"
                >
                  <span v-html="$kaanna(otavoite.tavoite)" />
                </div>
              </div>

              <div v-if="tavoite.tavoitteistaJohdetutOppimisenTavoitteet">
                <h5>{{ $t('tavoitteista-johdetut-oppimisen-tavoitteet') }}</h5>
                <ep-content-viewer
                  :value="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)"
                  :kuvat="kuvat"
                />
              </div>

              <EpPaikallinenTarkennus
                v-if="tavoite.vuosiluokanTavoite && tavoite.vuosiluokanTavoite.tavoite"
                class="mb-4"
                :avattava="false"
              >
                <div v-html="$kaanna(tavoite.vuosiluokanTavoite.tavoite)" />
              </EpPaikallinenTarkennus>

              <TavoitteenSisaltoalueet
                ref="tavoitteenSisaltoalueet"
                :sisaltoalueet="tavoite.sisaltoalueet"
                :nayta-sisaltoalueet="naytaSisaltoalueet"
              />

              <div
                v-if="tavoite.laajaalaisetosaamiset && naytaLaajaAlaisetOsaamiset && tavoite.laajaalaisetosaamiset.length > 0"
                class="mb-2"
              >
                <h5>{{ $t('laaja-alaisen-osaamisen-alueet') }}</h5>
                <ep-collapse
                  v-for="(lao, index) in tavoite.laajaalaisetosaamiset"
                  ref="tavoitteenLaajaAlaisetOsaamiset"
                  :key="alueindex + 'lao'+index"
                  :border-bottom="false"
                  :expanded-by-default="false"
                  chevron-location="left"
                  class="mt-0 pt-0"
                  :use-padding="false"
                >
                  <template #header>
                    <h6
                      class="nimi"
                      v-html="$kaanna(lao.perusteenLao.nimi)"
                    />
                  </template>
                  <ep-content-viewer
                    v-if="lao.paikallinenLao.naytaPerusteenPaatasonLao"
                    :value="$kaanna(lao.perusteenLao.kuvaus)"
                    :kuvat="kuvat"
                  />
                  <ep-content-viewer
                    v-if="lao.paikallinenLao.naytaPerusteenVlkTarkennettuLao && lao.perusteenVlkLao"
                    :value="$kaanna(lao.perusteenVlkLao.kuvaus)"
                    :kuvat="kuvat"
                  />

                  <EpPaikallinenTarkennus
                    v-if="lao.paikallinenLao && lao.paikallinenLao.kuvaus"
                    class="mb-2"
                    :avattava="false"
                  >
                    <ep-content-viewer
                      v-if="lao.paikallinenLao && lao.paikallinenLao.kuvaus"
                      :value="$kaanna(lao.paikallinenLao.kuvaus)"
                      :kuvat="kuvat"
                    />
                  </EpPaikallinenTarkennus>
                </ep-collapse>
              </div>

              <template v-if="naytaArviointikriteerit">
                <div
                  v-if="tavoite.arvioinninKuvaus"
                  class="mb-4"
                >
                  <h5>{{ $t('arvioinnin-kohde') }}</h5>
                  <div
                    class="arvioinnin-kuvaus d-inline-block"
                    v-html="$kaanna(tavoite.arvioinninKuvaus)"
                  />
                </div>

                <div
                  v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0"
                  class="mb-4"
                >
                  <h5 class="mb-0 pb-0">
                    {{ $t('arviointi-vuosiluokan-paatteeksi') }}
                  </h5>
                  <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
                </div>
              </template>

              <div
                v-if="tavoite.vapaaTeksti"
                class="mb-4"
              >
                <h5>{{ $t('lisatietoa') }}</h5>
                <div v-html="$kaanna(tavoite.vapaaTeksti)" />
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
import { Vue, Component, Prop, InjectReactive } from 'vue-property-decorator';
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
  private pohjaOppiaineenVuosiluokka!: any;

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

  @Prop({ default: false })
  private avaaSuljeSiirrettavissa!: boolean;

  tavoitteetAvattu = false;

  @InjectReactive('opetussuunnitelma')
  private opetussuunnitelma!: any;

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

  get pohjanTavoitteet() {
    return _.keyBy(this.pohjaOppiaineenVuosiluokka?.tavoitteet, 'tunniste');
  }

  async toggleTavoite() {
    this.tavoitteetAvattu = !this.tavoitteetAvattu;
    _.forEach(this.$refs.tavoitecollapse, (collapsable: any) => collapsable.toggle(this.tavoitteetAvattu));
    await this.$nextTick();
    _.forEach(this.$refs.tavoitteenSisaltoalueet, (collapsable: any) => collapsable.toggle(this.tavoitteetAvattu));
    _.forEach(this.$refs.tavoitteenLaajaAlaisetOsaamiset, (collapsable: any) => collapsable.toggle(this.tavoitteetAvattu));
  }

  get tavoitealueet() {
    return _.chain(this.tavoitteet)
      .map('kohdealueet')
      .flatten()
      .uniqBy('nimi')
      .value();
  }

  get pohjaNimi() {
    return this.opetussuunnitelma?.pohja?.nimi;
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
