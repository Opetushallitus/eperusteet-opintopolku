import { RawLocation } from 'vue-router';

// Sopii suoraan b-breadcrumb items propiin
export interface MurupolkuOsa {
  text: string;
  to?: RawLocation;
  active: boolean;
}
