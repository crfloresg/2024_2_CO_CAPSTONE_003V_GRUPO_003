export interface Distribuidor {
  distribuidorId: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correoElectronico?: string;
  estado: number;
  fechaRegistro?: string;
  fechaModificacion?: string;
}

export interface DistribuidorCU {
  distribuidorId: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correoElectronico?: string;
}