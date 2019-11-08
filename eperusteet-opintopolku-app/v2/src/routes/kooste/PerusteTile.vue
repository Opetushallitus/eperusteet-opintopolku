<template>
  <div>
    <div class="upper">
      <div class="peruste-ikoni">
        <img src="../../../public/img/icons/hallitus.svg" alt="" style="fill: #0041DC" />
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
