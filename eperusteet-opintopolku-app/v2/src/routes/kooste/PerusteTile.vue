<template>
  <div>
    <div class="upper">
      <div class="peruste-ikoni">
        <img src="../../../public/img/icons/hallitus.svg" :alt="$t('peruste')" style="fill: #0041DC" />
      </div>
      <div class="nimi">
        <fas fixed-width icon="external-link-alt" class="mr-1" v-if="peruste.ulkoinenlinkki"></fas>
          {{ $kaanna(peruste.nimi) }}
      </div>
    </div>
    <div class="voimaantulo-viiva"></div>
    <div>
      <div class="d-flex align-items-center justify-content-center">
        <div class="voimaantulo">
          <div>
            {{ peruste.diaarinumero }}
          </div>
          {{ $t('voimaantulo') }}:
          {{ $sd(peruste.voimaantulopvm) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import Paikalliset from './Paikalliset.vue';
import { MurupolkuOsa } from '@/tyypit';
import { Meta } from '@shared/utils/decorators';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import { KoulutustyyppiToteutus } from '../../../eperusteet-frontend-utils/vue/src/tyypit';
import { perusteKoulutustyyppiUrlShortParamName } from '../../../eperusteet-frontend-utils/vue/src/utils/perusteet';
import _ from 'lodash';
import { ENV_PREFIX } from '@shared/utils/defaults';
import { PerusteDto } from '../../../eperusteet-frontend-utils/vue/src/api/tyypit';

@Component
export default class PerusteTile extends Vue {
  @Prop({ required: true })
  private peruste!: PerusteDto;
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';


.container {
  .tile {

    .voimaantulo {
      border-top: 1px solid #EBEBEB;
      color: #001A58;
      font-size: smaller;
      height: 40px;
      padding-top: 4px;
      text-align: center;
    }

    .upper {
      height: 180px;
      overflow-y: auto;

      .peruste-ikoni {
        color: #0041DC;
        text-align: center;

        img {
          margin: 20px;
          height: 32px;
          width: 32px;
        }
      }

      .nimi {
        hyphens: auto;
        overflow: hidden;
        width: 100%;
        padding: 12px;
        padding-top: 0;
        font-weight: bold;
        text-align: center;
      }
    }
  }
}

.row {
  margin-bottom: 3rem;
}

</style>
