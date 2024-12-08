export interface Producto {
  productoId: number;
  nombre: string;
  codigo?: string;
  categoria?: string;
  unidadMedida?: string;
  precioVenta?: number;
  estado: number;
  inventarios?: {
    cantidad: number;
  }[];

  estadoDesc: string;
}

export interface ProductoCU {
  productoId: number;
  nombre: string;
  codigo?: string;
  categoria?: string;
  unidadMedida?: string;
  precioVenta?: number;
  estado: number;
}