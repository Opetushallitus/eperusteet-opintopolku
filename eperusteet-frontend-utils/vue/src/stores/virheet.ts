import { Store, Action, State } from './store';
import { SovellusVirhe } from '../tyypit';

export type ErrorHandler = (virhe: SovellusVirhe) => Promise<void> | void;

@Store
class VirheStore {
  private onErrorHandlers: ErrorHandler[] = [];

  @State()
  private virheet: SovellusVirhe[] = [];

  @Action()
  public async lisaaVirhe(virhe: SovellusVirhe) {
    // this.virheet = [...this.virheet, virhe];
    for (const handler of this.onErrorHandlers) {
      handler(virhe);
    }
  }

  public onError(handler: ErrorHandler) {
    this.onErrorHandlers.push(handler);
  }
}

export const Virheet = new VirheStore();
