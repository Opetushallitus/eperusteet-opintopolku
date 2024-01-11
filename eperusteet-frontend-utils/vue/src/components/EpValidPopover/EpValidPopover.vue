<template>
  <div class="ep-valid-popover">
    <EpProgressPopover v-if="validoinnit"
                       :slices="prosessi"
                       :popup-style="popupStyle">
      <template v-slot:header>
        <div class="d-flex flex-column align-items-center" :class="tyyppi">
          <span class="validation-text pb-2">
            {{ $t(tila) }}
          </span>

          <template v-if="!arkistoitu">
            <EpSpinner v-if="julkaisemattomiaMuutoksia === undefined || julkaisemattomiaMuutoksia === null" color="#fff" small/>
            <template v-else>
              <div class="text-center julkaisemattomia-muutoksia font-size-08" v-if="julkaisemattomiaMuutoksia">
                <EpMaterialIcon icon-shape="outlined" size="16px">info</EpMaterialIcon>
                {{$t(julkaisemattomiaTeksti)}}
              </div>

              <b-button class="px-3 py-1" variant="primary" v-if="luonnos && !julkaistava" @click="asetaValmiiksi">
                {{$t('aseta-valmiiksi')}}
              </b-button>
              <b-button class="px-3 py-1" variant="primary" :to="{ name: 'julkaise' }" v-else-if="julkaistava && luonnos && !julkaistu && !arkistoitu">
                {{ $t('siirry-julkaisunakymaan') }}
              </b-button>
            </template>
          </template>
        </div>
      </template>
      <EpSpinner v-if="isValidating" class="mt-4"/>
      <div v-else class="d-flex flex-column align-items-center">
        <b-button
          v-if="arkistoitu"
          variant="primary"
          @click="palauta">{{ $t('palauta') }}
        </b-button>
        <template v-else>
          <b-button
            v-if="(julkaistu || valmis) && julkaistava"
            variant="primary"
            :to="{ name: 'julkaise' }">{{ $t('siirry-julkaisunakymaan') }}
          </b-button>
          <div class="pl-3 pt-2 pb-1 row" v-if="validointiOk">
            <div class="col-1">
              <EpMaterialIcon class="text-success" size="18px">check_circle</EpMaterialIcon>
            </div>
            <div class="col">
              {{ $t('ei-julkaisua-estavia-virheita') }}
            </div>
          </div>
          <div class="ml-3">
            <template v-if="validoinnit.ok && !validointiOk">
              <div class="pt-2 pb-1 row" v-for="ok in validoinnit.ok" :key="ok">
                <div class="col-1">
                  <EpMaterialIcon class="text-success" size="18px">info</EpMaterialIcon>
                </div>
                <div class="col">
                  <span>{{ $t(ok) }}</span>
                </div>
              </div>
            </template>
            <template v-if="validoinnit.virheet">
              <div class="pt-2 pb-1 row" v-for="virhe in uniqueVirheet" :key="virhe">
                <div class="col-1">
                  <EpMaterialIcon class="text-danger" size="18px">info</EpMaterialIcon>
                </div>
                <div class="col">
                  <span>{{ $t(virhe) }}</span>
                </div>
              </div>
            </template>
            <div class="pt-2 pb-1 row" v-if="validoinnit.huomautukset && validoinnit.huomautukset.length > 0">
              <div class="col-1">
                <EpMaterialIcon class="text-warning" size="18px">info</EpMaterialIcon>
              </div>
              <div class="col">
                <span>{{ $t(huomautuksia) }}</span>
              </div>
            </div>
        </div>
        </template>
      </div>
      <template v-slot:bottom>
        <b-button class="btn-tarkista" variant="link" @click="validoi">
          <EpMaterialIcon class="icon" icon-shape="outlined">refresh</EpMaterialIcon>
          <span> {{ $t('tarkista-virheet') }}</span>
        </b-button>
      </template>
    </EpProgressPopover>
    <EpSpinner v-else class="mt-4" color="#fff"/>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpProgressPopover from '@shared/components/EpProgressPopover/EpProgressPopover.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { tileBackgroundColor } from '@shared/utils/bannerIcons';
import { ValidableObject, Validoinnit, ValidoitavatTilat, ValidoitavatTyypit } from '@shared/components/EpValidPopover/EpValidPopoverTypes';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
    EpProgressPopover,
    EpSpinner,
  },
})
export default class EpValidPopover extends Vue {
  @Prop({ required: true })
  private validoitava!: ValidableObject;

  @Prop({ required: false })
  private validoinnit!: Validoinnit;

  @Prop({ required: true })
  private julkaisemattomiaMuutoksia!: boolean;

  @Prop({ required: true })
  private julkaistava!: boolean;

  @Prop({ required: true })
  private tyyppi!: ValidoitavatTyypit;

  @Prop({ required: false, default: false })
  private isValidating?: boolean;

  asetaValmiiksi() {
    this.$emit('asetaValmiiksi');
  }

  palauta() {
    this.$emit('palauta');
  }

  validoi() {
    this.$emit('validoi');
  }

  get prosessi() {
    if (this.arkistoitu) {
      return [0];
    }

    if (_.size(this.validoinnit?.virheet) > 0) {
      return [0.2, 0.5, 1];
    }

    return [1];
  }

  get tila() {
    if (this.julkaistu && !this.arkistoitu) {
      return ValidoitavatTilat.JULKAISTU;
    }

    return _.toLower(this.validoitava?.tila);
  }

  get popupStyle(): { background: string; } | undefined {
    if (this.tyyppi === 'peruste') {
      return {
        background: '#1d7599',
      };
    }

    return tileBackgroundColor(this.validoitava?.peruste ? this.validoitava?.peruste?.koulutustyyppi : this.validoitava?.koulutustyyppi);
  }

  get julkaistu(): boolean {
    return this.validoitava?.tila === ValidoitavatTilat.JULKAISTU || !!this.validoitava?.viimeisinJulkaisuAika;
  }

  get valmis(): boolean {
    return this.validoitava?.tila === ValidoitavatTilat.VALMIS;
  }

  get luonnos(): boolean | undefined {
    return this.tila === ValidoitavatTilat.LUONNOS;
  }

  get arkistoitu(): boolean {
    return this.validoitava?.tila === ValidoitavatTilat.POISTETTU;
  }

  get julkaisemattomiaTeksti() {
    if (this.tyyppi === ValidoitavatTyypit.PERUSTE) {
      return 'perusteessa-on-julkaisemattomia-muutoksia';
    }

    if (this.tyyppi === ValidoitavatTyypit.TOTEUTUSSUUNNITELMA) {
      return 'toteutussuunnitelmassa-on-julkaisemattomia-muutoksia';
    }

    if (this.tyyppi === ValidoitavatTyypit.OPETUSSUUNNITELMA) {
      return 'opetussuunnitelmassa-on-julkaisemattomia-muutoksia';
    }
  }

  get huomautuksia() {
    if (this.tyyppi === ValidoitavatTyypit.PERUSTE) {
      return 'perusteessa-huomautuksia';
    }

    if (this.tyyppi === ValidoitavatTyypit.TOTEUTUSSUUNNITELMA) {
      return 'toteutussuunnitelmassa-huomautuksia';
    }

    if (this.tyyppi === ValidoitavatTyypit.OPETUSSUUNNITELMA) {
      return 'opetussuunnitelmassa-huomautuksia';
    }
  }

  get uniqueVirheet() {
    return _.uniq(this.validoinnit.virheet);
  }

  get validointiOk() {
    return _.size(this.validoinnit.virheet) === 0 && _.size(this.validoinnit.huomautukset) === 0;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.validation-text {
  font-size: 14px;
}

.julkaisemattomia-muutoksia {
  width: 15rem;
  line-height: 1.1rem;
}

.btn-tarkista {
  text-decoration: none;
  display: flex;
  font-size: 1.125rem;
  font-weight: 500;
  padding: 0;
  align-items: center;
}

.icon {
  margin-right: 5px;
  font-size: 30px;
  align-self: center;
}

::v-deep .popover-body {
  color: inherit;

  .slot-area {
    color: $black;
  }
}

</style>
