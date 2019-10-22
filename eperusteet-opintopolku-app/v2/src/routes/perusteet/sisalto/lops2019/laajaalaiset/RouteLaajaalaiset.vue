<template>
<div class="content">
    <h2 class="otsikko" slot="header">{{ $t('laaja-alaiset-osaamiset') }}</h2>
    <div class="teksti">
        <div v-if="hasLaajaAlaiset" class="laaja-alaiset" id="laaja-alaiset-lista">
            <div v-for="(laajaAlainen, idx) in laajaAlaiset" :key="idx">
                <h3>{{ $kaanna(laajaAlainen.nimi) }}</h3>
                <div v-if="laajaAlainen.koodi">
                    <strong>{{ $t('koodi') }}</strong>
                    <p>{{ laajaAlainen.koodi.arvo }}</p>
                </div>
                <div v-html="$kaanna(laajaAlainen.kuvaus)"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019LaajaalaisetStore } from '@/stores/Lops2019LaajaalaisetStore';

@Component({})
export default class RouteLaajaalaiset extends Vue {
  @Prop({ required: true })
  private lops2019LaajaalaisetStore!: Lops2019LaajaalaisetStore;

  get laajaAlaisetKokonaisuus() {
    return this.lops2019LaajaalaisetStore.laajaalaisetKokonaisuus;
  }

  get laajaAlaiset() {
    if (this.laajaAlaisetKokonaisuus && this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset) {
      return this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset;
    }
  }

  get hasLaajaAlaiset() {
    return !_.isEmpty(this.laajaAlaiset);
  }
}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';

.content {
    padding: 0 $content-padding;
    overflow-x: auto;

    .otsikko, .teksti {
        hyphens: auto;

        & /deep/ p {
            text-align: justify;
        }

        & /deep/ img {
            max-width: 100%;
            margin: 0 auto;
        }

        & /deep/ table {
            max-width: 100%;
            margin: 0 auto;
        }
    }
}
</style>
