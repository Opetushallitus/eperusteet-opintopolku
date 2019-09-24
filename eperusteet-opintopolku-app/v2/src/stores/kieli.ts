import { Aikaleima } from '@/plugins/aikaleima';
import { Kaannos } from '@/plugins/kaannos';
import { createLogger } from '@/stores/logger';
import { Kieli } from '@/tyypit';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/ru';
import 'moment/locale/se';
import 'moment/locale/sv';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Getter, Mutation, State, Store } from './store';

Vue.use(VueI18n);
Vue.use(new Aikaleima());
Vue.use(new Kaannos());

const logger = createLogger('Kieli');

export const UiKielet = Object.freeze(_.values(Kieli as object));

moment.locale(Kieli.fi);

export const i18n = new VueI18n({
  fallbackLocale: Kieli.fi,
  locale: Kieli.fi,
  messages: {
    fi: require('@/translations/locale-fi.json'),
    sv: require('@/translations/locale-sv.json'),
  },
});

@Store
class KieliStore {
  @State()
  private sisaltoKieli: Kieli = Kieli.fi;

  @Getter()
  public getUiKieli() {
    return i18n.locale;
  }

  @Getter()
  public getAikakaannokset() {
    const kieli = this.sisaltoKieli;
    return {
      days: _.map(moment.weekdays(), (day: string) => _.toUpper(_.first(day))),
      months: moment.monthsShort(),
      placeholder: {
        date: i18n.t('valitse-pvm'),
        dateRange: i18n.t('valitse-pvm-jana'),
      },
    };
  }

  @Getter()
  public getSisaltoKieli() {
    return this.sisaltoKieli;
  }

  @Mutation()
  public setUiKieli(kieli: Kieli) {
    if (i18n.locale !== kieli && _.includes(UiKielet, kieli)) {
      // this.logger.debug('Ui kieli ->', kieli);
      moment.locale(kieli);
      i18n.locale = kieli;
    }
  }

  @Mutation()
  public setSisaltoKieli(kieli: Kieli) {
    if (this.sisaltoKieli !== kieli && _.includes(UiKielet, kieli)) {
      this.sisaltoKieli = kieli;
    }
  }

  public haeLokalisoituOlio(avain: string) {
    const result = {
      fi: i18n.t(avain, 'fi'),
      sv: i18n.t(avain, 'sv'),
      en: i18n.t(avain, 'en'),
    };
    return result;
  }

  public search(query: string, text: any) {
    if (text && query) {
      const target = _.isString(text) ? text : text[this.sisaltoKieli];
      return _.includes(_.toLower(target), _.toLower(query));
    }
    else {
      return true;
    }
  }

  public searchFn(query: string) {
    return (text: any) => this.search(query, text);
  }

  public async init() {
    logger.info('Initing locales');
    _.forEach(await this.fetchLocaleMap(), (locales, lang) => {
      i18n.mergeLocaleMessage(lang, locales);
    });
  }

  private async fetchLocaleMap() {
    try {
      const result: any = {};
      /*
      const localeObj = (await Ulkopuoliset.getLokalisoinnit()).data;
      _.forEach(localeObj, (locales, lang) => {
        result[lang] = {};
        for (const locale of locales) {
          if (locale.key && locale.value) {
            result[lang][locale.key] = locale.value;
          }
        }
      });
      */
      return result;
    }
    catch (err) {
      logger.error('Käännösten haku epäonnistui', err.message);
      return {};
    }
  }
}

export const Kielet = new KieliStore();
