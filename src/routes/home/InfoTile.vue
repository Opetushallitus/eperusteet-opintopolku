<template>
  <div class="tile">
    <div class="text">
      <h2 class="mb-2">{{ $t(header) }}</h2>
      <span>{{ $t(text) }}</span>
      <div class="d-flex mt-4 link">
        <EpLinkki :url="infoLink" icon="chevron_right">
          <span class="link-text">{{ $t(linkText) }}</span>
        </EpLinkki>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';

@Component({
  components: {
    EpLinkki,
  },
})
export default class InfoTile extends Vue {
  @Prop({ required: true })
  private header!: any;

  @Prop({ required: true })
  private text!: any;

  @Prop({ required: true })
  private link!: any;

  @Prop({ required: true })
  private linkText!: any;

  get infoLink() {
    return this.$kaanna(this.link);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.tile {
  color: #212529;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  //width: 395px;
  width: 49%;
  height: 180px;
  padding: 20px;
  align-items: center;
  background-color: $white;
  position: relative;

  @media(max-width: 1220px) {
    width: 100%;
    margin-bottom: 20px;
  }

  .image {
    height: 60%;
    text-align: center;
  }

  .text {
    height: 40%;
    .link {
      position: absolute;
      bottom: 30px;
    }

    .link-text {
      font-size: medium;
      font-weight: 500;
    }
  }
}
</style>
