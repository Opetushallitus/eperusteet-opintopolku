<template>
  <EpMultiSelect v-model="model"
                 :placeholder="placeholder"
                 :search-identity="identity"
                 label="nimi"
                 track-by="koulutustyyppi"
                 v-if="isEditing"
                 :options="selectVaihtoehdot"
                 group-values="koulutustyypit"
                 group-label="ryhma"
                 :group-select="false"
                 :searchable="false"
                 :maxHeight="500"
                 :multiple="isMultiple"
                 :closeOnSelect="!isMultiple"
                 :openDirection="'below'"
                 ref="koulutustyyppi_multiselect">

    <template slot="singleLabel" slot-scope="{ option }">
      <span :class="{'text-nowrap': !textWrap}">
        <slot name="colorindicator" :koulutustyyppi="option.koulutustyyppi" v-if="!nocolor">
          <EpColorIndicator :size="10" :kind="option.koulutustyyppi" v-if="!nocolor"/>
        </slot>
        <span class="ml-2">{{ $t(option.koulutustyyppi) }}</span>
      </span>
    </template>
    <template slot="option" slot-scope="{ option }">
      <hr class="mt-0 mb-0" v-if="option.$groupLabel" />

      <span v-else class="option text-nowrap" :class="{'text-nowrap': !textWrap}">
        <slot name="colorindicator" :koulutustyyppi="option.koulutustyyppi" v-if="option.koulutustyyppi !== 'kaikki' && !nocolor">
          <EpColorIndicator :size="10" :kind="option.koulutustyyppi" v-if="option.koulutustyyppi !== 'kaikki' && !nocolor"/>
        </slot>
        <span :class="{'font-weight-bold': option.koulutustyyppi === 'kaikki', 'ml-2': option.koulutustyyppi !== 'kaikki'}">
          {{ $t(option.koulutustyyppi) }}
        </span>
      </span>
    </template>
    <template v-slot:checkbox="{ option }"><span/></template>
    <template slot="selection" slot-scope="{ values }">
      <div class="d-flex align-items-center">
        <span class="multiselect__tag" v-for="value in values" :key="'value' + value.koulutustyyppi">
          <slot name="colorindicator" :koulutustyyppi="value.koulutustyyppi" v-if="!nocolor">
            <EpColorIndicator :size="10" :kind="value.koulutustyyppi" v-if="!nocolor"/>
          </slot>
          <span class="nimi ml-2">{{ $t(value.koulutustyyppi) }}</span>
          <span class="multiselect__tag-icon clickable" @click.prevent @mousedown.prevent.stop="remove(value)"/>
        </span>

        <span v-if="values.length > 0" class="ml-auto clickable border-right pr-2 remove-all" @click.prevent @mousedown.prevent.stop="removeAll()">
          <ep-material-icon>close</ep-material-icon>
        </span>
      </div>
    </template>
    <template v-slot:afterList>
      <div v-if="isMultiple" class="p-2 d-flex justify-content-end sulje border-top">
        <EpButton @click="sulje">{{ $t('valmis') }}</EpButton>
      </div>
    </template>
  </EpMultiSelect>
  <div v-else-if="asArray.length > 0">
    <span class="text-nowrap mr-3" :class="{'text-nowrap': !textWrap}" v-for="value in asArray" :key="'reading' + value">
      <slot name="colorindicator" :koulutustyyppi="value" v-if="!nocolor">
        <EpColorIndicator :size="10" :kind="value" v-if="!nocolor"/>
      </slot>
      <span class="ml-2">{{ $t(value) }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { EperusteetKoulutustyypit, EperusteetKoulutustyyppiRyhmat } from '../../utils/perusteet';
import * as _ from 'lodash';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpColorIndicator,
    EpInput,
    EpMultiSelect,
    EpSelect,
    EpSpinner,
    EpButton,
    EpMaterialIcon,
  },
})
export default class KoulutustyyppiSelect extends Vue {
  @Prop({ required: true })
  value!: string | string[];

  @Prop({ default: false })
  isEditing!: boolean;

  @Prop({ type: Boolean })
  required!: Boolean;

  @Prop({ default: false, type: Boolean })
  nocolor!: Boolean;

  @Prop({ default: () => EperusteetKoulutustyypit })
  koulutustyypit!: string[];

  @Prop({ default: () => EperusteetKoulutustyyppiRyhmat })
  koulutustyyppiryhmat!: any;

  @Prop({ default: () => [] })
  eiTuetutKoulutustyypit!: string[];

  @Prop({ default: false, type: Boolean })
  textWrap!: Boolean;

  identity(tr: any) {
    return _.toLower(this.$kaanna(tr.nimi));
  }

  get model() {
    return this.isMultiple ? this.toArrayValue : this.toValue;
  }

  get toArrayValue() {
    return _.chain(this.vaihtoehdot)
      .map(vaihtoehto => vaihtoehto.koulutustyypit)
      .flatMap()
      .filter(kt => _.includes(this.value, kt.koulutustyyppi))
      .value();
  }

  get toValue() {
    return _.chain(this.vaihtoehdot)
      .map(vaihtoehto => vaihtoehto.koulutustyypit)
      .flatMap()
      .find(kt => kt.koulutustyyppi === this.value)
      .value();
  }

  get asArray() {
    if (this.isMultiple) {
      return this.value;
    }

    return this.value ? [this.value] : [];
  }

  get isMultiple() {
    return _.isArray(this.value);
  }

  set model(value: any) {
    if (_.get(value, 'koulutustyyppi') === 'kaikki') {
      this.$emit('input', this.isMultiple ? [] : undefined);
    }
    else {
      if (!this.isMultiple) {
        this.$emit('input', _.get(value, 'koulutustyyppi'));
      }
      else {
        this.$emit('input', _.map(value, 'koulutustyyppi'));
      }
    }
  }

  get placeholder() {
    if (this.required) {
      return this.$t('valitse');
    }
    else {
      return this.$t('kaikki');
    }
  }

  get selectVaihtoehdot() {
    if (this.required) {
      return this.vaihtoehdot;
    }
    else {
      return this.kaikkiVaihtoehdot;
    }
  }

  get kaikkiVaihtoehdot() {
    return [
      {
        ryhma: 'kaikki',
        koulutustyypit: [{ koulutustyyppi: 'kaikki' }],
      },
      ...this.vaihtoehdot,
    ];
  }

  get vaihtoehdot() {
    return _.chain(this.koulutustyyppiryhmat)
      .keys()
      .map(ryhma => {
        return {
          ryhma,
          koulutustyypit: _.chain(this.koulutustyyppiryhmat[ryhma])
            .filter(koulutustyyppi => _.isEmpty(this.koulutustyypit) || _.includes(this.koulutustyypit, koulutustyyppi))
            .reject(koulutustyyppi => _.includes(this.eiTuetutKoulutustyypit, koulutustyyppi))
            .map(koulutustyyppi => ({ koulutustyyppi, nimi: this.$t(koulutustyyppi) }))
            .value(),
        };
      })
      .value();
  }

  remove(option) {
    const poistettava = _.get(option, 'koulutustyyppi');
    this.$emit('input', _.without(this.value, poistettava));
  }

  removeAll() {
    this.$emit('input', []);
  }

  sulje() {
    (this.$refs.koulutustyyppi_multiselect as any)?.sulje();
  }
}
</script>

<style lang="scss" scoped>
@import '@shared/styles/_variables.scss';

.tieto {
  padding: 20px;

  .nimi {
    font-weight: 600;
  }
}

::v-deep .multiselect__option {
 padding: 0px;
 min-height: 0px;
}

::v-deep .multiselect__option--disabled .option, ::v-deep .multiselect__option .option{
 padding: 12px;
 min-height: 40px;
 display: block;
}

.sulje {
  position: sticky;
  bottom: 0px;
  background: $white;
}

::v-deep .multiselect__tags {
  .multiselect__tag {
    .nimi {
      margin-right: 5px;
    }
  }
}

</style>
