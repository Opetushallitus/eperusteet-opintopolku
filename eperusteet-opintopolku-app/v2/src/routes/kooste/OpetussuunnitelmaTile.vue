<template>
  <div class="d-flex align-items-center">
    <div class="opsicon-wrapper">
      <div class="opsicon"></div>
    </div>
    <div class="nimi flex-fill">
      <div class="ops">
        <fas fixed-width icon="external-link-alt" class="mr-1" v-if="ops.ulkoinenlinkki"></fas>
        {{ $kaanna(ops.nimi) }}
      </div>
      <div class="organisaatiot">
        <div v-if="ops.toimijat.length > 0">
          <span class="otsikko">{{ $t('toimijat') }}</span>
          <span class="mr-1">:</span>
          <span class="toimijat" v-for="(toimija, tidx) in ops.toimijat" :key="tidx">
            {{ $kaanna(toimija.nimi) }}<span v-if="tidx < ops.toimijat.length - 1">, </span>
          </span>
        </div>
        <div v-if="ops.oppilaitokset.length > 0">
          <span class="otsikko">{{ $t('oppilaitokset') }}</span>
          <span class="mr-1">:</span>
          <span class="toimijat" v-for="(oppilaitos, tidx) in ops.oppilaitokset" :key="tidx">
            {{ $kaanna(oppilaitos.nimi) }}<span v-if="tidx < ops.oppilaitokset.length - 1">, </span>
          </span>
        </div>
      </div>
    </div>
    <div class="perusteen-nimi">
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OpetussuunnitelmaJulkinenDto } from '@shared/api/tyypit';

@Component({
  components: {
  }
})
export default class PerusteTile extends Vue {
  @Prop({ required: true })
  private ops!: OpetussuunnitelmaJulkinenDto;
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

  .opsicon-wrapper {
    padding: 20px 25px 20px 25px;

    .opsicon {
      height: 40px;
      width: 40px;
      background: url('../../../public/img/icons/opskortti.svg');
      background-size: 40px 40px;
    }
  }

  .nimi {
    padding: 13px 0px;
    color: #3367E3;

    .ops {
      margin-bottom: 8px;
    }
  }

  .perusteen-nimi {
    padding: 20px;
  }

  .organisaatiot {
    .toimijat {
      color: #555;
      font-size: smaller;
    }

    .otsikko {
      color: #2B2B2B;
      font-size: smaller;
    }
  }

</style>
