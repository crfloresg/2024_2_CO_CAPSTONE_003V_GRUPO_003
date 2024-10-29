import { Producto } from "./producto";

export interface Inventario extends Producto{
  lotesInventario: LotesInventario[];
  cantidad?: number;
}

export interface LotesInventario {
  loteId: number;
  productoId: number;
  bodegaId: number;
  cantidad: number;
  precioCompra: number;
}