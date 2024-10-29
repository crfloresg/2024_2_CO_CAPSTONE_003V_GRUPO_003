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