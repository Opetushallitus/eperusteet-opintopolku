<template>
<div>
  <div class="kooste-header">
    <div class="container">
      <div>
        <div class="murupolku">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link class="breadcrumb-home" :to="{ name: 'root' }">
                  {{ $t('eperusteet') }}
                </router-link>
              </li>
              <li class="breadcrumb-item" v-for="(item, idx) in murupolku" :key="idx">
                <router-link class="breadcrumb-normal" :to="item.to">{{ item.name }}</router-link>
              </li>
            </ol>
          </nav>
          <slot name="murupolku"></slot>
        </div>
        <div class="nimi">
          <slot name="header"></slot>
        </div>
      </div>
    </div>
  </div>
  <div class="container sisalto">
    <slot></slot>
  </div>
</div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EpHeader extends Vue {

  @Prop({ required: false, default: () => [] })
  private murupolku!: Array<any>;

}
</script>


<style scoped lang="scss">
.kooste-header {
  height: 150px;
  box-shadow: 0 2px 6px 0 rgba(0,45,153,0.08);
  background-image: url('../../../public/img/banners/aallot.svg');
  background-repeat: no-repeat;
  background-position: right;

  .murupolku {
    padding-top: 25px;
    height: 75px;
  }

  .nimi {
    margin-top: 0px;
    height: 75px;
    font-size: 28px;
    color: #001A58;
  }

  ol.breadcrumb {
    background: none;
    margin: 0px;
    padding: 0px;

    .breadcrumb-home {
      color: #2B2B2B;
      font-weight: bolder;
    }

    .breadcrumb-normal {
      color: #2B2B2B;
    }
  }
}

.container.sisalto {
  margin-top: 40px;
  margin-bottom: 40px;
}

</style>
