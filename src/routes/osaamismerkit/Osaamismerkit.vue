<template>
  <div>
    <EpSpinner v-if="!osaamismerkit" />
    <div v-else-if="osaamismerkitCount === 0">
      <div class="alert alert-info">
        {{ $t('ei-hakutuloksia') }}
      </div>
    </div>
    <div v-else>
      <div v-for="(group, index) in kategoriaGroup" :key="index" class="mb-4">
        <div class="mb-4">
          <h4>{{$kaanna(group.data.nimi)}}</h4>
        </div>
        <div class="mb-4" v-if="group.data.kuvaus && !hideKuvaus">
          {{$kaanna(group.data.kuvaus)}}
        </div>
        <div class="d-md-flex flex-wrap justify-content-start">
          <div v-for="(osaamismerkki, idx) in group.osaamismerkit" :key="idx" class="mb-2">
            <router-link :to="{ name: 'osaamismerkkiTiedot', params: { osaamismerkkiId: osaamismerkki.id } }">
              <div class="tile tile-background-shadow-selected shadow-tile d-flex">
                <div>
                  <img :src="osaamismerkki.image" width="40" height="40">
                </div>
                <div class="ml-3">
                  <span class="nimi">{{ $kaanna(osaamismerkki.nimi) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';

@Component({})
export default class EpOsaamismerkit extends Vue {
  @Prop({ required: true })
  private osaamismerkitStore!: OsaamismerkitStore;

  @Prop({ required: true })
  private osaamismerkkiKategoriat!: any[];

  @Prop({ required: false, default: false, type: Boolean })
  private hideKuvaus?: Boolean;

  generateImageUrl(liite) {
    return liite ? 'data:' + liite.mime + ';base64,' + liite.binarydata : null;
  }

  get osaamismerkit() {
    return _.chain(this.osaamismerkitStore.osaamismerkit.value)
      .map(osaamismerkki => ({
        ...osaamismerkki,
        image: this.generateImageUrl(osaamismerkki.kategoria?.liite),
      }))
      .sortBy(om => Kielet.sortValue(om.nimi))
      .value();
  }

  get osaamismerkitCount() {
    return this.osaamismerkitStore.osaamismerkit?.value?.length;
  }

  get kategoriaGroup() {
    return _.chain(this.osaamismerkkiKategoriat)
      .map(kategoria => ({
        ...kategoria,
        osaamismerkit: _.filter(this.osaamismerkit, osaamismerkki => osaamismerkki.kategoria?.id === kategoria.value),
      }))
      .filter(kategoria => kategoria.osaamismerkit.length > 0)
      .value();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tile {
  color: #212529;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  overflow-x: auto;
  width: 380px;
  height: 75px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  margin-right: 15px;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.nimi {
  font-size: 18px;
  font-weight: 600;
}
</style>
