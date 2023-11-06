<template>
  <EpHeader :murupolku="murupolku" :koulutustyyppi="koulutustyyppi">
    <template slot="header">
      {{ $kaanna(osaamismerkki.nimi) }}
    </template>
    <template slot="subheader">
      <div class="mt-3">
        <span class="kategoria-nimi">{{ $kaanna(osaamismerkki.kategoria.nimi) }}</span>
      </div>
    </template>
    <div class="d-flex flex-lg-row flex-column mt-5">
      <div class="m-3">
        <div class="tile tile-background-shadow-selected shadow-tile">
          <div class="img">
            <img :src="imageUrl" width="200" height="200">
          </div>
          <div class="nimi">
            <span>{{ $kaanna(osaamismerkki.nimi) }}</span>
          </div>
        </div>
      </div>
      <div class="m-3">
        <div>
          <strong>{{$t('osaamistavoitteet')}}</strong>
          <ul class="mt-1">
            <li v-for="(tavoite, index) in osaamismerkki.osaamistavoitteet" :key="'tavoite'+index">
              {{$kaanna(tavoite.osaamistavoite)}}
            </li>
          </ul>
        </div>
        <div>
          <strong>{{$t('arviointikriteerit')}}</strong>
          <ul class="mt-1">
            <li v-for="(kriteeri, index) in osaamismerkki.arviointikriteerit" :key="'kriteeri'+index">
              {{$kaanna(kriteeri.arviointikriteeri)}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </EpHeader>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { MurupolkuOsa } from '@/tyypit';
import { RawLocation } from 'vue-router';
import _ from 'lodash';
import { OsaamismerkkiStore } from '@/stores/OsaamismerkkiStore';
import { Meta } from '@shared/utils/decorators';
import {murupolkuOsaamismerkkiTiedot} from "@/utils/murupolku";

@Component({
  components: {
    EpHeader,
  },
})
export default class RouteOsaamismerkkiTiedot extends Vue {
  @Prop({ required: true })
  private osaamismerkkiStore!: OsaamismerkkiStore;

  get koulutustyyppi() {
    return _.get(this.$route.params, 'koulutustyyppi') || 'vapaasivistystyo';
  }

  get osaamismerkki() {
    return this.osaamismerkkiStore.osaamismerkki.value;
  }

  get kategoria() {
    return this.osaamismerkki?.kategoria;
  }

  get imageUrl() {
    return this.kategoria ? 'data:' + this.kategoria.liite?.mime + ';base64,' + this.kategoria.liite?.binarydata : null;
  }

  get murupolku(): Array<MurupolkuOsa> {
    return murupolkuOsaamismerkkiTiedot(this.koulutustyyppi, this.osaamismerkki);
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('osaamismerkki'),
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.kategoria-nimi {
  padding: 7px 15px;
  background: $gray-lighten-6;
  color: $black;
  border-radius: 20px;
  font-size: 15px;
}

.tile {
  color: #212529;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  width: 320px;
  height: 320px;
  padding: 20px;
  align-items: center;
  margin-right: 15px;

  @media(max-width: 767.98px) {
    width: 100%;
    height: 100%;
  }
}

.nimi {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}

.img {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
