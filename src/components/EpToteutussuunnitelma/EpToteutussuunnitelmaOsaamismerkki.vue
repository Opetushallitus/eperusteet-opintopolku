<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="mb-4">{{ $t('kansalliset-perustaitojen-osaamismerkit') }}</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="mb-4">{{ $t('osaamismerkkien-suorittaminen') }}</h4>
        <ep-content-viewer :value="$kaanna(sisaltoviite.osaamismerkkiKappale.kuvaus)" :kuvat="kuvat" class="mb-5"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Osaamismerkit :osaamismerkit-store="osaamismerkitStore"
                       :osaamismerkki-kategoriat="osaamismerkkiKategoriat"
                       hide-kuvaus></Osaamismerkit>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import Osaamismerkit from '@/routes/osaamismerkit/Osaamismerkit.vue';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpContentViewer,
    Osaamismerkit,
  },
})
export default class EpToteutussuunnitelmaOsaamismerkki extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: SisaltoViiteExportDto;

  @Prop({ required: true })
  private kuvat!: any[];

  private osaamismerkitStore = new OsaamismerkitStore();

  async mounted() {
    let koodit = _.map(this.sisaltoviite.opintokokonaisuus?.osaamismerkkiKappale?.osaamismerkkiKoodit, koodi => {
      return _.toNumber(koodi.koodi);
    });
    await this.osaamismerkitStore.updateOsaamismerkkiQuery({ koodit: koodit });
    await this.osaamismerkitStore.fetchKategoriat();
  }

  get osaamismerkkiKategoriat() {
    return _.chain(this.osaamismerkitStore.kategoriat.value)
      .map(kategoria => {
        return {
          text: this.$kaanna(kategoria.nimi),
          value: kategoria.id,
          data: kategoria,
        };
      })
      .uniqWith(_.isEqual)
      .sortBy('text')
      .filter('text')
      .value();
  }

  get osaamismerkkiKappale() {
    return this.sisaltoviite.osaamismerkkiKappale;
  }
}
</script>

<style scoped lang="scss">

</style>
