<template>
<div>
  <b-modal ref="epConfirmDialogModal" id="epConfirmDialog" size="lg" v-model="visible" @ok="cancelSave">
    <template v-slot:modal-title>
     {{ $t('haluatko-poistua-tallentamatta')}}
    </template>

    <span>{{$t('poistumisen-varmistusteksti-dialogi')}}</span>

    <template v-slot:modal-cancel>
      {{ $t('peruuta')}}
    </template>
    <template v-slot:modal-ok>
      {{ $t('poistu-tallentamatta')}}
    </template>

  </b-modal>
</div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Mixins } from 'vue-property-decorator';
import _ from 'lodash';

@Component({ name: 'EpConfirmDialog' })
export default class EpConfirmDialog extends Vue {
  @Prop({ required: true })
  private redirect!: Function;

  @Prop({ required: true })
  private ctrls!: any;

  private visible: boolean = false;

  setVisible() {
    this.visible = true;
  }

  async cancelSave() {
    await this.ctrls.cancel();
    this.redirect();
  }
}
</script>

<style scoped lang="scss">

</style>
