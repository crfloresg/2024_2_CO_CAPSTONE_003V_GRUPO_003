import { Producto } from "./producto";

export interface Transferencia {
  transferenciaId: number;
  bodegaOrigenId: number;
  bodegaDestinoId: number;
  estadoTransferenciaId: number;
  estadosTransferencia: EstadosTransferencia;
  fechaEnvio: string;
  fechaRecepcion: string;
  observaciones: string;
  transferenciasDetalles: TransferenciasDetalles[];
}

interface EstadosTransferencia {
  estadoTransferenciaId: number;
  nombre: string;
}

export interface TransferenciasDetalles {
  detalleId: number;
  productoId: number;
  cantidadDespachada: number;
  cantidadRecibida?: number;
  precioCompra: number;
  producto?: Producto;
}




export interface TransferenciaCreate {
  bodegaDestinoId: number;
  observaciones: string;
  solicitudId: number;
  transferenciasDetalles: TransferenciasDetallesCreate[];
}

export interface TransferenciasDetallesCreate {
  productoId: number;
  cantidadDespachada: number;
  precioCompra: number;
}




export interface RecepcionCreate {
  transferenciaId: number;
  bodegaDestinoId: number;
  detalle: RecepcionDetalleCreate[];
}

export interface RecepcionDetalleCreate{
  detalleId: number;
  productoId: number;
  cantidadRecibida: number;
  precioCompra: number;
  cantidadDmg: number;
  cantidadPerdida: number;
}