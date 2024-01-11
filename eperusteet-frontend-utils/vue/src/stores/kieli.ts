import { createLogger } from '../utils/logger';
import { Kieli } from '../tyypit';
import _ from 'lodash';
import VueI18n from 'vue-i18n';
import Vue, { VueConstructor } from 'vue';
import moment from 'moment';
import VueCompositionApi, { computed, reactive } from '@vue/composition-api';
import { updateRelativeTime } from '../plugins/aikaleima';
import { Computed } from '../utils/interfaces';

Vue.use(VueCompositionApi);

declare module 'vue/types/vue' {
  interface Vue {
    $locale: Computed<string>;
    $slang: Computed<string>;
    $t: typeof VueI18n.prototype.t;
    $tc: typeof VueI18n.prototype.tc;
    $te: typeof VueI18n.prototype.te;
  }
}

export const UiKielet = Object.freeze(['fi', 'sv', 'en']);
const logger = createLogger('Kieli');

const kfi = require('../translations/locale-fi.json');
const ksv = require('../translations/locale-sv.json');
const ken = require('../translations/locale-en.json');

export function getMessages() {
  const result: any = {};
  result.fi = kfi;
  result.sv = ksv;
  result.en = ken;
  return result;
}

export class KieliStore {
  private vi18n!: VueI18n;

  public get i18n() {
    return this.vi18n;
  }

  /**
   * Add language support to root vue instance.
   *
   */
  public install(v: VueConstructor, config = {} as Partial<VueI18n.I18nOptions>) {
    moment.locale(Kieli.fi);
    this.vi18n = new VueI18n({
      fallbackLocale: Kieli.fi,
      locale: Kieli.fi,
      ...config,
      messages: _.merge(getMessages(), config.messages),
    });
    v.prototype.$locale = this.uiKieli;
    v.prototype.$slang = this.sisaltoKieli;
    moment.updateLocale(Kieli.fi, updateRelativeTime());
  }

  /**
   * Load translation from other source
   *
   */
  public async load(kaannokset: Kaannokset) {
    logger.info('Initing locales');
    const results = await this.fetchLocaleMap(kaannokset);
    _.forEach(results, (locales, lang) => {
      this.i18n!.mergeLocaleMessage(lang, locales);
    });
  }

  private readonly state = reactive({
    sisaltoKieli: Kieli.fi,
  });

  public readonly getUiKieli = computed(() => this.i18n?.locale);
  public readonly getSisaltoKieli = computed(() => this.state.sisaltoKieli);
  public readonly sisaltoKieli = computed(() => this.state.sisaltoKieli);
  public readonly uiKieli = computed(() => this.i18n?.locale);

  public readonly getAikakaannokset = computed(() => {
    const kieli = this.state.sisaltoKieli;
    return {
      days: _.map(moment.weekdays(), (day: string) => _.toUpper(_.first(day))),
      months: moment.monthsShort(),
      placeholder: {
        date: this.i18n!.t('valitse-pvm'),
        dateRange: this.i18n!.t('valitse-pvm-jana'),
      },
    };
  })

  public setUiKieli(kieli: Kieli) {
    if (this.i18n!.locale !== kieli && _.includes(UiKielet, kieli)) {
      moment.locale(kieli);
      this.i18n!.locale = kieli;
    }
  }

  public setSisaltoKieli(kieli: Kieli) {
    if (this.state.sisaltoKieli !== kieli && _.includes(UiKielet, kieli)) {
      this.state.sisaltoKieli = kieli;
    }
  }

  public haeLokalisoituOlio(avain: string) {
    const result = {
      fi: this.i18n!.t(avain, 'fi'),
      sv: this.i18n!.t(avain, 'sv'),
      en: this.i18n!.t(avain, 'en'),
    };
    return result;
  }

  /**
   * Check if text query matches object
   *
   */
  public search(query: string, text: any, config = {}): boolean {
    if (text && query) {
      const target = _.isString(text) ? text : text[this.getSisaltoKieli.value];
      return _.includes(_.toLower(target), _.toLower(query));
    }
    else {
      return true;
    }
  }

  public filterBy(field: string, query: string, config = {}) {
    return (data: any) => this.search(query, data[field]);
  }

  public searchFn(query: string) {
    return (text: any) => this.search(query, text);
  }

  /**
   * i18n locale convert
   *
   */
  public t(value: string): string {
    if (this.vi18n) {
      return this.vi18n.t(value) as string || '<' + value + '>';
    }
    else {
      return value;
    }
  };

  /**
   * Convert field into sortable value
   *
   * @returns {string}
   */
  public sortValue(value: any): string {
    if (!value) {
      return '';
    }
    else if (_.isObject(value)) {
      const locale = this.getSisaltoKieli.value;
      return (value as any)[locale];
    }
    else {
      return value;
    }
  };

  public kaanna(value?: LokalisoituTeksti | undefined | null, emptyWhenNotFound = false, squareBrackets = true): string {
    if (!value) {
      return '';
    }
    else if (_.isObject(value)) {
      const locale = this.getSisaltoKieli.value;
      const kielet = [locale, ..._.pull(['fi', 'sv', 'en', 'se', 'ru'], locale)];
      let teksti: string = '' + (value[locale] || '');

      if (teksti) {
        return teksti;
      }
      else if (emptyWhenNotFound) {
        return '';
      }
      else {
        const other = _.first(_.filter(_.map(kielet, kieli => value[kieli] as string)));
        if (other) {
          return squareBrackets ? '[' + other + ']' : other;
        }
      }
      return '';
    }
    else {
      logger.warn('"$kaanna" on tekstiolioiden kääntämiseen. Käytä vue-i18n vastaavaa funktiota. Esimerkiksi "$t()".', 'Käännös:', '"' + value + '"');
      return value;
    }
  };

  public kaannaOlioTaiTeksti(value: LokalisoituTeksti | string, emptyWhenNotFound = false, squareBrackets = true): string {
    if (_.isObject(value)) {
      return this.kaanna(value, emptyWhenNotFound, squareBrackets);
    }
    else if (_.isString(value)) {
      return this.t(value);
    }
    else {
      return value;
    }
  }

  private async fetchLocaleMap(kaannokset: Kaannokset) {
    try {
      const result: any = {};
      const localeObj = kaannokset;
      _.forEach(localeObj, (locales, lang) => {
        result[lang] = {};
        if (locales) {
          for (const locale of locales) {
            if (locale.key && locale.value) {
              result[lang][locale.key] = locale.value;
            }
          }
        }
      });
      return result;
    }
    catch (err) {
      logger.error('Käännösten haku epäonnistui', err.message);
      return {};
    }
  }
}

export const Kielet = new KieliStore();

export interface Kaannos {
  key: string;
  value: string;
}

export interface Kaannokset {
  fi?: Kaannos[];
  sv?: Kaannos[];
  en?: Kaannos[];
}

export interface LokalisoituTeksti {
  [locale: string]: string | null | undefined | number;
  _id?: number;
  _tunniste?: string;
}
