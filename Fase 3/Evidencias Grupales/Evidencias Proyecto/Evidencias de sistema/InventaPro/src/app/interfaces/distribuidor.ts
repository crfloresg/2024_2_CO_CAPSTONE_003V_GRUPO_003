export interface Distribuidor {
  distribuidorId: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correoElectronico?: string;
  estado: number;
  fechaRegistro?: string;
  fechaModificacion?: string;

  estadoDesc?: string;
}

export interface DistribuidorCU {
  distribuidorId: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correoElectronico?: string;
}