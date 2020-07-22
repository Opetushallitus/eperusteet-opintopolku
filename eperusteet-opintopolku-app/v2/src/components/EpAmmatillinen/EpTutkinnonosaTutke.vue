<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" :showHeader="false" v-if="tutkinnonosa.kuvaus">
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mb-5" name="osa-alueet" v-if="tutkinnonosa.osaAlueet">
      <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="tutkinnonosa.osaAlueet" />
    </ep-form-content>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmatillinenOsaalueet from '@/components/EpAmmatillinen/EpAmmatillinenOsaalueet.vue';

@Component({
  components: {
    EpFormContent,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmatillinenOsaalueet,
  },
})
export default class EpTutkinnonosaTutke extends Vue {
  @Prop({ required: true })
  private tutkinnonosa: any;

  @Prop({ required: true })
  private arviointiasteikot!: any[];
}
</script>

<style scoped lang="scss">

</style>
