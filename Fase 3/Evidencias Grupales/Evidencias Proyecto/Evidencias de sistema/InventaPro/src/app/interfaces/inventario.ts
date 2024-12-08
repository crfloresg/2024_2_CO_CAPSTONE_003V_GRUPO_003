import { Producto } from "./producto";

export interface Inventario extends Producto{
  lotesInventario: LotesInventario[];
  cantidad?: number;
  cantidadSolicitada?: number;
  cantidadAprobada?: number;
}

export interface LotesInventario {
  loteId: number;
  productoId: number;
  bodegaId: number;
  cantidad: number;
  precioCompra: number;
}