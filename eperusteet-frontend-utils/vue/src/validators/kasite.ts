import { requiredLokalisoituTeksti } from '@shared/validators/required';
import { Kieli } from '@shared/tyypit';

export function kasiteValidator(kielet: Kieli[] = []) {
  return {
    termi: {
      ...requiredLokalisoituTeksti(kielet),
    },
    selitys: {
      ...requiredLokalisoituTeksti(kielet),
    },
  };
}
