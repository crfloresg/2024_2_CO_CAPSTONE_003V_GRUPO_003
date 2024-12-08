export interface Alerta{
  alertaId: number;
  productoId: number;
  nombreProducto: string;
  codigo: string;
  
  bodegaId: number;
  NombreBodega: string;

  cantidadTotal: number;
  tipoAlerta: TipoAlerta;
  estadoAlerta: EstadoAlerta;
  estado: number;
  stock: number;
  minimo: number;
  stockMin: number;
}

export interface TipoAlerta {
    tipoAlertaId: number;
    nombre: string;
}

export interface EstadoAlerta {
    estadoAlertaId: number;
    nombre: string;
}

export interface UpdateAlerta{
  alerta: {
    productoId: number;
    bodegaId: number;
    cantidad: number;
    tipoPerdida: number;
    descripcion: string;
    precioCompra: number;
  }[];
}

export interface AlertaCu {
  alertaId: number;
  ProductoId: number;
  minimo: number;
}