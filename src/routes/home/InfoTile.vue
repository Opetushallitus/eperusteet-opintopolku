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

<script setup lang="ts">
import { computed } from 'vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import { $kaanna } from '@shared/utils/globals';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const props = defineProps({
  header: {
    type: [String, Object],
    required: true,
  },
  text: {
    type: [String, Object],
    required: false,
  },
  translatedText: {
    type: [String, Object],
    required: false,
  },
  link: {
    type: [String, Object],
    required: false,
  },
  route: {
    type: Object,
    required: false,
  },
  linkText: {
    type: [String, Object],
    required: true,
  },
});

const infoLink = computed(() => {
  return $kaanna(props.link);
});
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

:deep(.icon) {
  color: white;
}
</style>
