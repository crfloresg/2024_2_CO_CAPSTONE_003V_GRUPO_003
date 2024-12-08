import { Producto } from "./producto";

export interface Compra {
  compraId: number;
  bodegaId: number;
  documentoUrl: string;
  observacion: string;
  fecha: string;
  fechaCancelado?: string;
  compraDetalles: CompraDetalle[];
  distribuidor: dist;
}

export interface CompraDetalle{
  detalleId: number;
  compraId: number;
  productoId: number;
  cantidad: number;
  precioCompra: number;
  producto: Producto;
  
}

interface dist {
  idDistribuidor: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correoElectronico?: string;
  estado: number;
  fechaRegistro?: string;
  fechaModificacion?: string;
}
export interface CompraC{
  documentoB64: string;
  observacion: string;
  distribuidorId: number;
  compraDetalles: CompraDetalleC[];
}

export interface CompraDetalleC{
  productoId: number;
  cantidad: number;
  precioCompra: number;
  nombre?: string;
  codigo?: string;
}