<template>
  <router-link :to="route">
    <div class="d-inline-flex align-items-start flex-column kortti ml-0 mr-3 my-3 pl-3 pt-3 pr-2 pb-2">
      <div class="font-weight-bold mb-auto nimi">{{$kaanna(koulutuksenosa.nimi)}}</div>
      <div class="w-100 text-right laajuus">
        <span class="pr-1">
          {{koulutuksenosa.laajuusMinimi}}-{{koulutuksenosa.laajuusMaksimi}} {{$t('viikkoa')}}
        </span>

        <EpColorCircle class="laajuusmerkki" v-for="(laajuusmerkki, index) in laajuusmerkit" :key="'laajuusmerkki'+index" :color="laajuusmerkki"/>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpColorCircle from '@shared/components/EpColorIndicator/EpColorCircle.vue';

@Component({
  components: {
    EpColorCircle,
  },
})
export default class EpKoulutuksenOsaKortti extends Vue {
    @Prop({ required: true })
    private koulutuksenosa!: any;

    @Prop({ required: true })
    private route!: any;

    get laajuusmerkit() {
      return [
        this.koulutuksenosa.laajuusMaksimi >= 10 ? '#E75B00' : '#FCBF88',
        this.koulutuksenosa.laajuusMaksimi >= 20 ? '#E75B00' : '#FCBF88',
        this.koulutuksenosa.laajuusMaksimi >= 30 ? '#E75B00' : '#FCBF88',
      ];
    }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';
@import '@shared/styles/_mixins.scss';

  .kortti {
    background-color: #F8E1CC;
    border-radius: 0.5rem;
    min-height: 150px;
    width: 200px;
    color: $black;

    @include tile-background-shadow;

    &:hover {
      @include tile-background-shadow-selected;
    }

    .laajuus {
      font-size: 0.8rem;

      .laajuusmerkki {
        margin-right: 2px;
      }
    }

  }

</style>
