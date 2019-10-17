<template>
<div>
  <ep-spinner v-if="!tiedotteet" />
  <div v-else>
    <ep-header :murupolku="[]">
      <template slot="header">
        {{ $t('uutiset') }}
      </template>
      <div class="tiedotteet">
        <div class="tiedote" v-for="(tiedote, idx) in tiedotteet.tiedotteet" :key="idx">
          <div class="otsikko">
            {{ $kaanna(tiedote.otsikko) }}
          </div>
          <div class="aikaleima">
            {{ $sd(tiedote.luotu) }}
          </div>
          <div class="tiedote-sisalto">
            <p v-html="$kaanna(tiedote.sisalto)"></p>
          </div>
        </div>
      </div>
      <b-pagination
        v-if="tiedotteet"
        v-model="page"
        :total-rows="tiedotteet.amount"
        :per-page="tiedotteet.perPage"
        aria-controls="uutiset-sivut"></b-pagination>
    </ep-header>
  </div>
</div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import { Tiedotteet } from '@shared/api/eperusteet';
import { TiedoteStore } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import _ from 'lodash';
import EpHeader from '@/components/EpHeader/EpHeader.vue';


@Component({
  components: {
    EpSpinner,
    EpHeader,
  },
})
export default class RouteUutiset extends Vue {
  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;

  // private tiedotteet: PageTiedoteDto | null = null;
  private page = 1;

  get lang() {
    return this.$i18n.locale;
  }

  get tiedotteet() {
    return this.tiedoteStore.data();
  }

  @Watch('page', { immediate: true })
  async updatePage(val) {
    await this.tiedoteStore.getUutiset(val - 1, 10, this.lang);
  }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.tiedotteet {
  .tiedote {
    margin-bottom: 50px;

    .otsikko {
      color: #001A58;
      font-size: 22px;
    }

    .aikaleima {
      color: #555;
      font-weight: lighter;
    }

    .tiedote-sisalto {
      margin-top: 10px;
    }
  }
}

</style>

