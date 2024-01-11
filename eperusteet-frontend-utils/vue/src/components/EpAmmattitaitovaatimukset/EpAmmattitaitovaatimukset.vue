<template>
<div v-if="inner">
  <div v-if="isEditing">
    <b-form-group v-if="showKohde" :label="$t('otsikko')">
        <ep-input v-model="inner.kohde"
                  :is-editing="true"
                  :validation="validation && validation.kohde"
                  :warning="true" />
    </b-form-group>
    <b-form-group :label="$t('vaatimukset')" v-if="kohdealueettomat">
      <draggable
        v-bind="vaatimusOptions"
        tag="div"
        v-model="inner.vaatimukset">
        <div v-for="(v, vaatimusIdx) in inner.vaatimukset"
             :key="vaatimusIdx"
             class="d-flex mt-1">
          <div class="flex-grow-1">
            <vaatimus-field v-if="koodisto"
                            :koodisto="koodisto"
                            v-model="inner.vaatimukset[vaatimusIdx]"
                            :validation="vaatimusValidation(null, vaatimusIdx)"/>
            <EpInput v-else v-model="v.vaatimus" :isEditing="isEditing"/>
          </div>
          <div>
            <Kayttolistaus v-if="inner.vaatimukset[vaatimusIdx].koodi"
                           :koodi="inner.vaatimukset[vaatimusIdx].koodi" />
          </div>
          <div>
            <b-button @click="poistaVaatimus(inner, v)" variant="link">
              <EpMaterialIcon icon-shape="outlined">delete</EpMaterialIcon>
            </b-button>
          </div>
        </div>
      </draggable>
      <div class="mt-2">
        <ep-button variant="outline"
                   @click="lisaaVaatimus(inner)"
                   icon="add">
                   {{ $t('lisaa-ammattitaitovaatimus-ilman-kohdealuetta') }}
        </ep-button>
      </div>
    </b-form-group>
    <b-form-group :label="kaannokset.kohdealueet">
      <draggable
        v-bind="kohdealueOptions"
        tag="div"
        v-model="inner.kohdealueet">
        <div v-for="(kohdealue, kohdealueIdx) in inner.kohdealueet" class="kohdealue mt-2" :key="kohdealueIdx">
          <b-form-group class="w-100">
            <div slot="label">
              <span class="handle-kohdealue text-muted">
                <EpMaterialIcon size="20px">drag_indicator</EpMaterialIcon>
              </span>
              <span class="font-weight-bold">{{ kaannokset.kohdealue }}</span>
            </div>
            <ep-input v-model="kohdealue.kuvaus" :is-editing="true" :validation="validation && validation.kohdealueet.$each.$iter[kohdealueIdx].kuvaus" class="ml-3 mr-4"/>
          </b-form-group>
          <b-form-group :label="kaannokset.vaatimukset" class="ml-3">
            <div class="otsikko font-italic">
              {{ $kaanna(inner.kohde) }}
            </div>
            <draggable
              v-bind="vaatimusOptions"
              tag="div"
              v-model="kohdealue.vaatimukset">
              <div v-for="(v, vaatimusIdx) in kohdealue.vaatimukset" :key="vaatimusIdx" class="mt-1 d-flex align-items-center">
                <div class="flex-grow-1">
                  <vaatimus-field v-if="koodisto"
                                  :koodisto="koodisto"
                                  v-model="kohdealue.vaatimukset[vaatimusIdx]"
                                  :validation="vaatimusValidation(kohdealueIdx, vaatimusIdx)"/>
                  <EpInput v-else v-model="v.vaatimus" :isEditing="isEditing"/>
                </div>
                <div>
                  <Kayttolistaus v-if="koodisto && kohdealue.vaatimukset[vaatimusIdx].koodi"
                                :koodi="kohdealue.vaatimukset[vaatimusIdx].koodi" />
                </div>
                <div>
                  <ep-button @click="poistaVaatimus(kohdealue, v)" variant="link" icon="delete"></ep-button>
                </div>
              </div>
            </draggable>

            <div class="mt-2">
              <ep-button @click="lisaaKohdealueVaatimus(kohdealue)"
                         variant="outline"
                         icon="add">
                {{ kaannokset.lisaaAmmattitaitovaatimus }}
              </ep-button>
            </div>
            <div class="float-right">
              <ep-button @click="poistaKohdealue(inner, kohdealue)" variant="link" icon="delete">
                {{ $t('poista-kohdealue') }}
              </ep-button>
            </div>
          </b-form-group>

        </div>
      </draggable>
      <div class="mt-2">
        <ep-button @click="lisaaKohdealue(inner)"
                   variant="outline"
                   icon="add">
          {{ kaannokset.lisaaKohdealue }}
        </ep-button>
      </div>
    </b-form-group>
  </div>
  <div v-else>
    <div v-if="inner.vaatimukset && inner.vaatimukset.length > 0 && showKohde"
        class="otsikko font-weight-bold">
      {{ $kaanna(innerKohde) }}
    </div>
    <ul v-if="inner.vaatimukset && inner.vaatimukset.length > 0">
      <li v-for="(v, vidx) in inner.vaatimukset" :key="vidx">
        <span v-if="v.koodi">
          <slot name="koodi" :koodi="v.koodi">
            <span>{{ $kaanna(v.koodi.nimi) || $kaanna(v.vaatimus) }}</span>
            <span class="ml-1">
              (<a :href="koodistoPalveluUrl(v.koodi.uri)"
                target="_blank"
                rel="nofollow noopener noreferrer">{{ v.koodi.uri.split('_')[1] }}</a>)
            </span>
          </slot>
        </span>
        <span v-else>
          <span>{{ $kaanna(v.vaatimus) }}</span>
          <span class="ml-2"></span>
        </span>
      </li>
    </ul>
    <div>
      <div v-for="(kohdealue, kaIdx) in inner.kohdealueet" :key="kaIdx" :class="{'mt-3' : showKohde || kohdealueettomat}">
        <div class="otsikko font-weight-bold">
          {{ $kaanna(kohdealue.kuvaus) }}
        </div>
        <div class="otsikko" v-if="showKohde">
          {{ $kaanna(innerKohde) }}
        </div>
        <div class="otsikko" v-if="kaannosKohde">
          {{ kaannosKohde }}
        </div>
        <ul>
          <li v-for="(v, kvIdx) in kohdealue.vaatimukset" :key="kvIdx">
            <span v-if="v.koodi">
              <slot name="koodi" :koodi="v.koodi">
                <span>{{ $kaanna(v.koodi.nimi) || $kaanna(v.vaatimus) }}</span>
                <span class="ml-1" v-if="showKoodiArvo">
                  (<a :href="koodistoPalveluUrl(v.koodi.uri)"
                    target="_blank"
                    rel="nofollow noopener noreferrer">{{ v.koodi.uri.split('_')[1] }}</a>)
                </span>
              </slot>
            </span>
            <span v-else>
              <span>{{ $kaanna(v.vaatimus) }}</span>
              <span class="ml-2"></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpInput from '../forms/EpInput.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import VaatimusField from './VaatimusField.vue';
import { Ammattitaitovaatimukset2019Dto, Koodisto } from '../../api/eperusteet';
import draggable from 'vuedraggable';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';
import Kayttolistaus from './Kayttolistaus.vue';

@Component({
  components: {
    EpButton,
    EpErrorWrapper,
    EpExternalLink,
    EpInput,
    Kayttolistaus,
    VaatimusField,
    EpMaterialIcon,
    draggable,
  },
})
export default class EpAmmattitaitovaatimukset extends Vue {
  @Prop({ required: true })
  private value!: Ammattitaitovaatimukset2019Dto | null;

  @Prop({ default: 'ammattitaitovaatimukset' })
  private tavoitekoodisto!: string;

  @Prop({ required: false })
  private kaannosKohdealueet!: string;

  @Prop({ required: false })
  private kaannosLisaaAmmattitaitovaatimus!: string;

  @Prop({ required: false })
  private kaannosLisaaKohdealue!: string;

  @Prop({ required: false })
  private kaannosVaatimukset!: string;

  @Prop({ required: false })
  private kaannosKohdealue!: string;

  @Prop({ required: false })
  private kaannosKohde!: string;

  @Prop({ default: true })
  private kohdealueettomat!: boolean;

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ default: null })
  public kohde!: any;

  @Prop({ default: null })
  public validation!: any;

  @Prop({ default: true })
  public showKohde!: boolean;

  @Prop({ default: true })
  public showKoodiArvo!: boolean;

  get kaannokset() {
    return {
      kohdealueet: !_.isNull(this.kaannosKohdealueet) ? this.kaannosKohdealueet : this.$t('ammattitaito-kohdealueet'),
      lisaaKohdealue: this.kaannosLisaaKohdealue ? this.kaannosLisaaKohdealue : this.$t('lisaa-kohdealue'),
      lisaaAmmattitaitovaatimus: this.kaannosLisaaAmmattitaitovaatimus ? this.kaannosLisaaAmmattitaitovaatimus : this.$t('lisaa-ammattitaitovaatimus'),
      kohdealue: this.kaannosKohdealue ? this.kaannosKohdealue : this.$t('kohdealueen-otsikko'),
      vaatimukset: this.kaannosVaatimukset ? this.kaannosVaatimukset : this.$t('vaatimukset'),
    };
  }

  get inner() {
    return this.value || {
      kohde: null,
      vaatimukset: [],
      kohdealueet: [],
    };
  }

  set inner(value: any) {
    this.$emit('input', value);
  }

  get innerKohde() {
    if (this.showKohde) {
      return this.inner.kohde || this.kohde;
    }
  }

  get kohdealueOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.handle-kohdealue',
      group: {
        name: 'kohdealueet-drag-list',
      },
      disabled: !this.isEditing,
      ghostClass: 'dragged',
    };
  }

  get vaatimusOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.handle',
      group: {
        name: 'vaatimukset',
      },
      disabled: !this.isEditing,
      ghostClass: 'dragged',
    };
  }

  private koodisto: KoodistoSelectStore | null = null;

  mounted() {
    if (this.tavoitekoodisto) {
      this.koodisto = new KoodistoSelectStore({
        koodisto: this.tavoitekoodisto,
        async query(query: string, sivu = 0, koodisto: string) {
          return (await Koodisto.kaikkiSivutettuna(koodisto, query, {
            params: {
              sivu,
              sivukoko: 10,
            },
          })).data as any;
        },
      });
    }
  }

  async poistaKohdealue(value: any, el: any) {
    if (await this.$vahvista(this.$t('poista-kohdealue') as string, this.$t('poista-kohdealue-kuvaus') as string)) {
      Vue.set(value, 'kohdealueet', _.without(value.kohdealueet, el));
    }
  }

  async poistaVaatimus(value: any, el: any) {
    if (await this.$vahvista(this.$t('poista-vaatimus') as string, this.$t('poista-vaatimus-kuvaus') as string)) {
      Vue.set(value, 'vaatimukset', _.without(value.vaatimukset, el));
    }
  }

  lisaaKohdealue(value: Ammattitaitovaatimukset2019Dto) {
    this.inner = {
      ...this.inner,
      kohdealueet: [...(this.inner.kohdealueet || []), {
        kuvaus: null as any,
        vaatimukset: [] as any[],
      }],
    };
  }

  lisaaKohdealueVaatimus(kohdealue: any) {
    Vue.set(kohdealue, 'vaatimukset', [...(kohdealue.vaatimukset || []), {
      vaatimus: null,
      koodi: null,
    }]);
  }

  lisaaVaatimus() {
    Vue.set(this.inner, 'vaatimukset', [...(this.inner.vaatimukset || []), {
      vaatimus: null,
      koodi: null,
    }]);
  }

  vaatimusValidation(kohdealueIdx: number | null, vaatimusIdx: number) {
    if (!kohdealueIdx) {
      return this.validation?.vaatimukset?.$each?.$iter[vaatimusIdx]?.vaatimus;
    }
    else {
      return this.validation?.kohdealueet?.$each?.$iter[kohdealueIdx]?.vaatimukset?.$each?.$iter[vaatimusIdx]?.vaatimus;
    }
  }

  koodistoPalveluUrl(uri) {
    return `${window.location.origin}/koodisto-app/koodi/view/${uri}/1`;
  }
}
</script>

<style scoped lang="scss">
.kohdealue {
  padding: 0px 8px 8px 8px;
  border: 1px solid #eee;
}

.dragged {
  background: white;
}
</style>
