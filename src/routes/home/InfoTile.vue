<template>
  <div class="tile">
    <div class="text">
      <h2 class="mb-2">
        {{ $t(header) }}
      </h2>
      <span
        v-if="translatedText"
        v-html="$kaanna(translatedText)"
      />
      <span v-if="text">{{ $t(text) }}</span>
      <div class="d-flex mt-4 link">
        <EpMaterialIcon>chevron_right</EpMaterialIcon>
        <EpLinkki
          v-if="infoLink"
          :url="infoLink"
          icon="launch"
          icon-right
        >
          <span class="link-text">{{ $t(linkText) }}</span>
        </EpLinkki>
        <router-link
          v-if="route"
          :to="route"
        >
          <span class="link-text">{{ $t(linkText) }}</span>
        </router-link>
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

  @Prop({ required: false })
  private text!: any;

  @Prop({ required: false })
  private translatedText!: any;

  @Prop({ required: false })
  private link!: any;

  @Prop({ required: false })
  private route!: any;

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
  color: $white;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  width: 395px;
  height: 220px;
  padding: 20px;
  align-items: center;
  background-color: $oph-green;
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
      color: $white;
      text-decoration: underline;
    }
  }
}

::v-deep .icon {
  color: white;
}
</style>
