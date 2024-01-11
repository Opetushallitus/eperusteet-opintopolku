import { Component } from 'vue-property-decorator';
import EpRoot from './EpRoot';
import { Murupolku } from '../stores/murupolku';

@Component
export default class EpRoute extends EpRoot {
  breadcrumb(key: string, value: any) {
    Murupolku.aseta(key, value);
  }
}
