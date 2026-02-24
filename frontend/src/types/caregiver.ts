export interface Document {
  foto?: string;
  tipoDoc: string;
  enlaceUrl: string;
  fechaSubida?: string;
}

export interface AddressCaregiver {
  calle?: string;
  ciudad?: string;
  numero?: string;
  distrito?: string;
}

export interface Caregiver {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  cvu_alias: string | null;
  addressCaregiver: AddressCaregiver;
  documents: Document[];
  estado: { id: number; descripcion: string };
}

export interface CaregiversResponse {
  total: number;
  content: Caregiver[];
}