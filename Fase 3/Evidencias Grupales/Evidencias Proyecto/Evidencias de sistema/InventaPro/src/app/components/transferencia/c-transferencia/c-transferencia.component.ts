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
import { NzSpinModule } from 'ng-zorro-antd/spin';

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
    RouterLink,
    NzSpinModule
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

  //bodegas: Bodega[] = [];
  selectedBodegaId = 0;
  selectedSolicitudId = 0;
  //loadingBodegas = true;

  //solicitudes: Solicitud[] = [];
  //loadingSolicitudes = false;

  inventario: inventarioTransferencia[] = [];
  displayedInventario: inventarioTransferencia[] = []; 

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = false;
  found = false;

  obs = undefined;

  creating = false;

  async ngOnInit() {
   // await this.getBodega();
  //await this.getTransferencias();
  }

  async selectBodega(bodegaId: number){
    //await this.getSolicitudes();
    await this.getTransferencias();
  } 

  // statusBodega(){
  //   const error: NzStatus = 'error';
  //   const def: NzStatus = '';
  //   if(this.selectedBodegaId == 0 || this.selectedBodegaId == undefined){
  //     return error;
  //   }
  //   return def;
  // }

  // async getBodega(){
  //   this.loadingBodegas = true;
  //   try {
  //     const req = await this.bodegasService.getAll();
  //     this.bodegas = req.filter(x => x.bodegaId != 1 );
  //     this.loadingBodegas = false;
  //   } catch (error) {
  //     this.loadingBodegas = false;
  //     this.uiService.showErrorModal('Error al cargar datos', error);
  //   }
  // }

  // async getSolicitudes(){
  //   this.loadingSolicitudes = true;
  //   try {
  //     const req = await this.solicitudesService.getAllByIdBodegaForTransferencia(this.selectedBodegaId);

  //     const arrayTemp = JSON.parse(JSON.stringify(this.inventario));

  //     req.forEach(x => {
  //       const invTemp = arrayTemp.find((y: any) => y.productoId == x.productoId);
  //       if(invTemp != undefined){
  //         invTemp.cantidadSolicitada = x.cantidad;
  //       }
  //     });

  //     this.displayedInventario = JSON.parse(JSON.stringify(arrayTemp));
  //     this.loadingSolicitudes = false;
  //   } catch (error) {
  //     this.loadingSolicitudes = false;
  //     this.uiService.showErrorModal('Error al cargar datos', error);
  //   }
  // }

  async getTransferencias(){
    this.loadingTableData = true;
    try {

      this.selectedBodegaId = await this.transferenciasService.SolicitudDetails(this.selectedSolicitudId)

      //1 siendo bodega central
      const req = await this.inventariosService.getInventarioBySolicitud(1, this.selectedSolicitudId);

      req.forEach( x => {
        const tempInventario: inventarioTransferencia = {
          productoId: x.productoId,
          nombre: x.nombre,
          codigo: x.codigo || '',
          categoria: x.categoria || '',
          unidadMedida: x.unidadMedida || '',
          cantidadSolicitada: x.cantidadAprobada,
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
      this.found = true;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  setCantidad(event: any, loteId: number, productoId: number, cantidadAprobada: number): void {

    if(Number(event.target.value) > 0){
      const newCantidad = Number(event.target.value) || 0;
  
      const product = this.inventario.find(x => x.productoId === productoId);
      if (!product) return;
    
      const lote = product.lotesInventario.find(x => x.loteId === loteId);
      if (!lote) return;
    
      // Validate if the new cantidadAEnviar respects the limit
      if (this.isWithinLimit(productoId, loteId, newCantidad, cantidadAprobada)) {
        lote.cantidadAEnviar = newCantidad;
      } else {
        // Revert to the maximum allowed value
        const maxAllowed = cantidadAprobada - product.lotesInventario
          .filter(l => l.loteId !== loteId)
          .reduce((sum, l) => sum + (l.cantidadAEnviar || 0), 0);
    
        lote.cantidadAEnviar = Math.max(0, maxAllowed); // Set to the maximum allowed or 0
      }
    }
  }
  
  
  getMaxForLote(productoId: number, loteId: number, cantidadAprobada: number): number {
    const product = this.inventario.find(x => x.productoId === productoId);
    if (!product) return 0;
  
    const currentTotal = product.lotesInventario
      .filter(l => l.loteId !== loteId)
      .reduce((sum, l) => sum + (l.cantidadAEnviar || 0), 0);
  
    return Math.max(0, cantidadAprobada - currentTotal);
  }
  
  
  isWithinLimit(productoId: number, loteId: number, newCantidad: number, cantidadAprobada: number): boolean {
    // Find the product in the inventory
    const product = this.inventario.find(x => x.productoId === productoId);
    if (!product) return false;
  
    // Calculate the current total cantidadAEnviar, excluding the current lote
    const currentTotal = product.lotesInventario
      .filter(l => l.loteId !== loteId) // Exclude the current lote
      .reduce((sum, l) => sum + (l.cantidadAEnviar || 0), 0);
  
    // Add the new value for the current lote
    const newTotal = currentTotal + newCantidad;
  
    // Ensure the total does not exceed the cantidadAprobada
    return newTotal <= cantidadAprobada;
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
        solicitudId: this.selectedSolicitudId,
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