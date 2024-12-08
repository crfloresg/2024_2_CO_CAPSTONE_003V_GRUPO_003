import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UiService } from '../../../services/ui.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { InventariosService } from '../../../services/inventarios.service';
import { ColumnItem } from '../../../interfaces/column-item';
import { Producto } from '../../../interfaces/producto';
import { InformesService } from '../../../services/informes.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-r-solicitud',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzFlexModule,
    NzSpinModule,
    NzInputModule,
    NzFormModule,
    FormsModule,
    NzTypographyModule,
  ],
  templateUrl: './r-solicitud.component.html',
  styleUrl: './r-solicitud.component.scss'
})
export class RSolicitudComponent {

  uiService = inject(UiService);
  solicitudesService = inject(SolicitudesService);
  inventariosService = inject(InventariosService);
  informesService = inject(InformesService);
  authService = inject(AuthService);

  productos: ProductoAux[] = [];
  displayedProductos: ProductoAux[] = [];

  listOfColumns: ColumnItem<ProductoAux>[] = [
    {
      name: 'Id producto',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => a.productoId - b.productoId,
      listOfFilter: [],
      filterFn: null,
      width: '90px'
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => a.nombre.localeCompare(b.nombre),
      listOfFilter: [],
      filterFn: null,
      width: '170px'
    },
    {
      name: 'Código',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a?.codigo || '').localeCompare(b.codigo || ''),
      listOfFilter: [],
      filterFn: null,
      width: '120px'
    },
    {
      name: 'Categoría',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a?.categoria || '').localeCompare(b.categoria || ''),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Unidad de medida',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a?.unidadMedida || '').localeCompare(b.unidadMedida || ''),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Precio Venta',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a.precioVenta || 0) - (b.precioVenta || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad bodega',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a.cantidadBodega ?? 0) - (b.cantidadBodega || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad solicitada',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a.cantidadSolicitada ?? 0) - (b.cantidadSolicitada || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad aprobada',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a.cantidadAprobada ?? 0) - (b.cantidadAprobada || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    }];

  observacion = undefined;

  pageSize = 10;
  pageIndex = 1;
  loadingSolicitud = true;
  loadingInventario = true;
  loadingAD = false;
  estadoSol = 0;

  readonly #modal = inject(NzModalRef);
  @Input() idSolicitud?: number;
  @Input() bodegaId?: number;
  readonly nzModalData: { idSolicitud: number, idBodega: number } = inject(NZ_MODAL_DATA);

  async ngOnInit() {
    this.idSolicitud = this.nzModalData.idSolicitud;
    this.bodegaId = this.nzModalData.idBodega;
    await this.getOneByIdSolicitud();
    await this.getIventario();
  }

  async getOneByIdSolicitud(){
    this.loadingSolicitud = true;
    try {
      const req = await this.solicitudesService.getOneByIdSolicitud(this.idSolicitud!);
    
      this.estadoSol = req.estadoSolicitudId;

      req.detallesSolicitudesInventario.forEach(x => {
        let tempProducto: ProductoAux = x.producto;
        tempProducto.cantidadSolicitada = x.cantidad;
        tempProducto.cantidadBodega = 0;
        tempProducto.cantidadAprobada = x.cantidadAprobada;
        this.productos.push(x.producto);
      });

      this.displayedProductos = JSON.parse(JSON.stringify(this.productos));

      this.loadingSolicitud = false;
    } catch (error) {
      this.loadingSolicitud = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getIventario(){
    this.loadingInventario = true;
    try {
      const req = await this.inventariosService.getByIdBodega(this.bodegaId!);
      req.forEach(x => {
        const index = this.productos.findIndex(y => y.productoId == x.productoId);
        if(index != -1){
          this.productos[index].cantidadBodega = x.cantidad;
        }
      });
      this.displayedProductos = JSON.parse(JSON.stringify(this.productos));
      this.loadingInventario = false;
    } catch (error) {
      this.loadingInventario = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  auxAccept = false;
  auxDeny = false



  downloading = false;
  async download(){
    this.downloading = true;
    try {
      const req = await this.informesService.solicitudDetalle(this.nzModalData.idSolicitud);
      const base64Data = req.base64;
      const fileName = req.fileName;

      const url = `data:application/pdf;base64,${base64Data}`;

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      this.downloading = false;
    } catch (error: any) {
      this.downloading = false;
      this.uiService.showErrorModal('Error al generar informe', error);
    }
  }

}


interface ProductoAux extends Producto{
  cantidadBodega?: number;
  cantidadSolicitada?: number;
  checked?: boolean;
  cantidadAprobada?: number;
}
