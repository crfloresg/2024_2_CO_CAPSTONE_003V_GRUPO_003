import { SolicitudesService } from './../../../services/solicitudes.service';
import { Component, inject, Input } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Producto } from '../../../interfaces/producto';
import { DetallesSolicitudesInventario, Solicitud, SolicitudCU } from '../../../interfaces/solicitud';
import { UiService } from '../../../services/ui.service';
import { BodegasService } from '../../../services/bodegas.service';
import { InventariosService } from '../../../services/inventarios.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ColumnItem } from '../../../interfaces/column-item';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-ad-solicitud',
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
    NzInputNumberModule
  ],
  templateUrl: './ad-solicitud.component.html',
  styleUrl: './ad-solicitud.component.scss'
})
export class AdSolicitudComponent {

  uiService = inject(UiService);
  solicitudesService = inject(SolicitudesService);
  inventariosService = inject(InventariosService);

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
    }];

  observacion = undefined;
  solicitudDetalle: DetallesSolicitudesInventario[] = [];

  pageSize = 10;
  pageIndex = 1;
  loadingSolicitud = true;
  loadingInventario = true;
  loadingAD = false;

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
    
      this.solicitudDetalle = req.detallesSolicitudesInventario;

      req.detallesSolicitudesInventario.forEach(x => {
        let tempProducto: ProductoAux = x.producto;
        tempProducto.cantidadSolicitada = x.cantidad;
        tempProducto.cantidadBodega = 0;
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

  setCantidad(event: any, productoId: number){
    let producto = this.productos.find(x => x.productoId == productoId);
    let producto2 = this.displayedProductos.find(x => x.productoId == productoId);
    if(producto && producto2){
      if(Number(event.target.value) > 0){
        
        producto.cantidadAprobada = Number(event.target.value);
        producto2.cantidadAprobada = Number(event.target.value);

        if(producto.cantidadAprobada > (producto.cantidadBodega ?? 0)){
          producto.cantidadAprobada = producto.cantidadBodega ?? 0;
          producto2.cantidadAprobada = producto.cantidadBodega ?? 0;
        }

      }else{
        producto.cantidadAprobada = 0;
        producto2.cantidadAprobada = 0;
      }
    }
  }


  auxAccept = false;
  auxDeny = false

  async accept(accept: boolean){
    this.loadingAD = true;
    this.#modal.updateConfig({
      nzClosable: false,
      nzMaskClosable: false
    });
    try {
      accept == true ? this.auxAccept = true : this.auxDeny = true;

      let detalle: {detalleId: number, cantidad: number}[] = [];
      this.solicitudDetalle.forEach(element => {
        let det : {detalleId: number, cantidad: number} = {detalleId: element.detalleId, cantidad: this.productos.find(x => x.productoId == element.productoId)?.cantidadAprobada || 0};
        detalle.push(det);
      });

      await this.solicitudesService.acceptDeny({solicitudId: this.idSolicitud!, accept: accept, observacion: this.observacion!, detalles: detalle})      
      this.#modal.destroy({ success: accept });
    } catch (error) {
      this.uiService.showErrorModal(accept == true ? 'Error al aceptar' : 'Error al rechazar', error);
    }finally {
      this.loadingAD = false;
      // Re-enable dismissal
      this.#modal.updateConfig({
        nzClosable: true,
        nzMaskClosable: true
      });
    }
  }


  valid(invalid: boolean | null, rechaza: boolean){

    if(invalid){return false;}

    if(this.loadingAD && this.auxAccept){return false;}

    if(!rechaza){
      for (let i = 0; i < this.productos.length; i++) {
        const element = this.productos[i];
        if(element.cantidadAprobada == undefined){ return false; }
      }
    }
    

    return true;
  }

}

interface ProductoAux extends Producto{
  cantidadBodega?: number;
  cantidadSolicitada?: number;
  cantidadAprobada?: number;
  checked?: boolean;
}
