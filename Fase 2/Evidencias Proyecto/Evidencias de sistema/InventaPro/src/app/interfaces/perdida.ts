import { Bodega } from "./bodega";
import { Producto } from "./producto";

export interface Perdida{
  perdidaId: number;
  productoId: number;
  producto: Producto;

  bodegaId: number;
  bodega: Bodega;

  cantidad: number;
  tipoPerdidaId: number;
  tipoPerdida: TipoPerdida;

  descripcion: string;
  fechaRegistro: string;
  usuarioId: number;
  precioCompra: number;
}

export interface TipoPerdida {
    tipoPerdidaId: number;
    nombre: string;
}

export interface PerdidaCreate{
  perdidas: {
    productoId: number;
    bodegaId: number;
    cantidad: number;
    tipoPerdida: number;
    descripcion: string;
    precioCompra: number;
  }[];
}