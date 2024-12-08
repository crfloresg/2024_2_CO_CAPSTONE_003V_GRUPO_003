import { Bodega } from "./bodega";
import { Producto } from "./producto";

export interface Solicitud {
  solicitudId: number;
  bodegaId: number;
  estadoSolicitudId: number;
  fechaSolicitud?: string;
  fechaAprobacion?: string;
  fechaRechazo?: string;
  fechaCompletada?: string;
  fechaModificacion?: string;
  usuarioSolicitanteId: number;
  usuarioAprobadorId?: number;
  observaciones?: string;

  bodega: Bodega;
  detallesSolicitudesInventario: DetallesSolicitudesInventario[];
  estadoSolicitudInventario: EstadoSolicitudInventario
}

export interface DetallesSolicitudesInventario {
  detalleId: number;
  solicitudId: number;
  productoId: number;
  cantidad: number;
  producto: Producto;
  cantidadAprobada?: number;
}

export interface EstadoSolicitudInventario {
  estadoSolicitudId: number;
  nombre: string;
}

export interface SolicitudCU {
  solicitudId: number;
  bodegaId: number;
  detallesSolicitudesInventario: DetallesSolicitudesInventarioCU[];
}

export interface DetallesSolicitudesInventarioCU {
  productoId: number;
  cantidad: number;
}