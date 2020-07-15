import { RawLocation } from 'vue-router';

// Sopii suoraan b-breadcrumb items propiin
export interface MurupolkuOsa {
  label: string | object;
  location?: RawLocation;
}
