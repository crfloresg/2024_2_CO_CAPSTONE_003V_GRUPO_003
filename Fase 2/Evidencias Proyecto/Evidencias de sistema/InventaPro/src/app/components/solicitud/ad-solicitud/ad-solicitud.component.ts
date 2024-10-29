import { SolicitudesService } from './../../../services/solicitudes.service';
import { Component, inject, Input } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Producto } from '../../../interfaces/producto';
import { SolicitudCU } from '../../../interfaces/solicitud';
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

  observacion = undefined;

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
    this.bodegaId = this.nzModalData.idSolicitud;
    await this.getOneByIdSolicitud();
    await this.getIventario();
    console.log(this.productos);
  }

  async getOneByIdSolicitud(){
    this.loadingSolicitud = true;
    try {
      const req = await this.solicitudesService.getOneByIdSolicitud(this.idSolicitud!);
    
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

  auxAccept = false;
  auxDeny = false

  async accept(accept: boolean){
    this.loadingAD = true;
    try {
      accept == true ? this.auxAccept = true : this.auxDeny = true;
      await this.solicitudesService.acceptDeny({solicitudId: this.idSolicitud!, accept: accept, observacion: this.observacion!})      
      this.#modal.destroy({ success: accept });
      this.loadingAD = false;
    } catch (error) {
      this.loadingAD = false;
      this.uiService.showErrorModal(accept == true ? 'Error al aceptar' : 'Error al rechazar', error);
    }
  }

}

interface ProductoAux extends Producto{
  cantidadBodega?: number;
  cantidadSolicitada?: number;
  checked?: boolean;
}
