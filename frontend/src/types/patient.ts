export interface Address {
 estado:string;
 provincia:string;
 ciudad:string;
 numero:string;
 piso:string;
 referencia:string;
}


export interface Patient {
  idPatient: number;
  namePatient: string;
  agePatient: number;
  dniPatient: string;
  addressPatient: string | Address; // Soporta ambos formatos de tu API
  medicalHistory: string;
  familyContactId: number;
  responsibleFamily:object;
}

export interface family{
    nameUser:string;
    email:string;
}

export interface PatientsResponse {
  ok:boolean;
  msg:string;
  total: number;
  content: Patient[];
}