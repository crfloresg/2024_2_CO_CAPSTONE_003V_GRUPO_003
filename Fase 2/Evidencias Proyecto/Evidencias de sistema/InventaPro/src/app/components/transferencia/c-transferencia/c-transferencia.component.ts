import { Component, inject } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { Bodega } from '../../../interfaces/bodega';
import { UiService } from '../../../services/ui.service';
import { BodegasService } from '../../../services/bodegas.service';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Inventario } from '../../../interfaces/inventario';
import { InventariosService } from '../../../services/inventarios.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { Solicitud } from '../../../interfaces/solicitud';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { TransferenciaCreate, TransferenciasDetallesCreate } from '../../../interfaces/transferencia';
import { TransferenciasService } from '../../../services/transferencias.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-c-transferencia',
  standalone: true,
  imports: [
    FormsModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzToolTipModule,
    NzFlexModule,
    NzFormModule,
    NzTypographyModule,
    RouterLink
  ],
  templateUrl: './c-transferencia.component.html',
  styleUrl: './c-transferencia.component.scss'
})
export class CTransferenciaComponent {

  uiService = inject(UiService);
  bodegasService = inject(BodegasService);
  inventariosService = inject(InventariosService);
  solicitudesService = inject(SolicitudesService);
  transferenciasService = inject(TransferenciasService);
  router = inject(Router);

  bodegas: Bodega[] = [];
  selectedBodegaId = 0;
  loadingBodegas = true;

  solicitudes: Solicitud[] = [];
  loadingSolicitudes = false;

  inventario: inventarioTransferencia[] = [];
  displayedInventario: inventarioTransferencia[] = []; 

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  obs = undefined;

  creating = false;

  async ngOnInit() {
    await this.getBodega();
    await this.getTransferencias();
  }

  async selectBodega(bodegaId: number){
    await this.getSolicitudes();
  } 

  statusBodega(){
    const error: NzStatus = 'error';
    const def: NzStatus = '';
    if(this.selectedBodegaId == 0 || this.selectedBodegaId == undefined){
      return error;
    }
    return def;
  }

  async getBodega(){
    this.loadingBodegas = true;
    try {
      const req = await this.bodegasService.getAll();
      this.bodegas = req.filter(x => x.bodegaId != 1 );
      this.loadingBodegas = false;
    } catch (error) {
      this.loadingBodegas = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getSolicitudes(){
    this.loadingSolicitudes = true;
    try {
      const req = await this.solicitudesService.getAllByIdBodegaForTransferencia(this.selectedBodegaId);

      const arrayTemp = JSON.parse(JSON.stringify(this.inventario));

      req.forEach(x => {
        const invTemp = arrayTemp.find((y: any) => y.productoId == x.productoId);
        if(invTemp != undefined){
          invTemp.cantidadSolicitada = x.cantidad;
        }
      });

      this.displayedInventario = JSON.parse(JSON.stringify(arrayTemp));
      this.loadingSolicitudes = false;
    } catch (error) {
      this.loadingSolicitudes = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getTransferencias(){
    this.loadingTableData = true;
    try {
      const req = await this.inventariosService.getByIdBodega(1);

      req.forEach( x => {
        const tempInventario: inventarioTransferencia = {
          productoId: x.productoId,
          nombre: x.nombre,
          codigo: x.codigo || '',
          categoria: x.categoria || '',
          unidadMedida: x.unidadMedida || '',
          cantidadSolicitada: 0,
          lotesInventario: []
        }; 

        x.lotesInventario.forEach( y => {
          const tempLote = {
            loteId: y.loteId,
            productoId: y.productoId,
            cantidadEnBodega: y.cantidad,
            precioCompra: y.precioCompra,
            cantidadAEnviar: 0 
          };
          tempInventario.lotesInventario.push(tempLote);
        });

        this.inventario.push(tempInventario);

      });

      this.displayedInventario = JSON.parse(JSON.stringify(this.inventario));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  setCantidad(event: any, loteId: number, productoId: number){
    const tempInvt = this.inventario.find(x => x.productoId == productoId);
    const tempInvt2 = this.displayedInventario.find(x => x.productoId == productoId);
    if(tempInvt && tempInvt2){
      const tempLote = tempInvt.lotesInventario.find(x => x.loteId == loteId);
      const tempLote2 = tempInvt2.lotesInventario.find(x => x.loteId == loteId);
      if(tempLote && tempLote2){
        if(Number(event.target.value) > 0){
          if(
            Number(event.target.value) <= tempLote.cantidadEnBodega && 
            Number(event.target.value) <= tempLote2.cantidadEnBodega
          ){
            tempLote.cantidadAEnviar = Number(event.target.value) || 0;
            tempLote2.cantidadAEnviar = Number(event.target.value) || 0;
          }else{
            tempLote.cantidadAEnviar = tempLote.cantidadEnBodega;
            tempLote2.cantidadAEnviar = tempLote2.cantidadEnBodega;
          }
        }else{
          tempLote.cantidadAEnviar = 0;
          tempLote2.cantidadAEnviar = 0;
        }
      }
    }
  }

  valid() {
    if (!this.selectedBodegaId || this.obs === '' || this.obs === undefined) {
      return false;
    }
    const cantidad = this.inventario.reduce((total, tempInv) => 
      total + tempInv.lotesInventario.reduce((subTotal, tempLote) => 
        subTotal + (tempLote.cantidadAEnviar || 0), 0
      ), 0);
    return cantidad > 0;
  }
  
  async create(){
    this.creating = true;
    try {

      const newTransferencia: TransferenciaCreate = {
        bodegaDestinoId: this.selectedBodegaId,
        observaciones: this.obs!,
        transferenciasDetalles: []
      };

      this.inventario.forEach(x => {
        x.lotesInventario.forEach(y => {
          if(y.cantidadAEnviar && y.cantidadAEnviar >= 0){
            const detalle: TransferenciasDetallesCreate = {
              cantidadDespachada: y.cantidadAEnviar,
              precioCompra: y.precioCompra,
              productoId: y.productoId
            }
            newTransferencia.transferenciasDetalles.push(detalle);
          }
        })
      });

      await this.transferenciasService.create(newTransferencia);
      this.creating = false;
      this.router.navigate(['/transferencia']);
      this.uiService.showModal('Transferencia creada exitosamente', '', 'success');
    } catch (error) {
      this.creating = false;
      this.uiService.showErrorModal('Error al crear', error);
    }
  }

}

interface inventarioTransferencia {
  productoId: number;
  nombre: string;
  codigo?: string;
  categoria?: string;
  unidadMedida?: string;
  cantidadSolicitada?: number;
  lotesInventario: {
    loteId: number;
    productoId: number;
    cantidadEnBodega: number;
    precioCompra: number;
    cantidadAEnviar?: number;
  }[]; 
}