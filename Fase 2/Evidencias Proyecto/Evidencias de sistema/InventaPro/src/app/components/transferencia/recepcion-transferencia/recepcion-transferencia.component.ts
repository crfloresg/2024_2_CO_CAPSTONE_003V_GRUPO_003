import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TransferenciasService } from '../../../services/transferencias.service';
import { UiService } from '../../../services/ui.service';
import { RecepcionCreate, RecepcionDetalleCreate, Transferencia, TransferenciasDetalles } from '../../../interfaces/transferencia';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recepcion-transferencia',
  standalone: true,
  imports: [
    NzButtonModule,
    FormsModule,
    NzTableModule,
    NzTypographyModule,
    NzInputModule,
    NzFlexModule,
    NzFormModule,
    NzInputNumberModule,
    RouterLink
  ],
  templateUrl: './recepcion-transferencia.component.html',
  styleUrl: './recepcion-transferencia.component.scss'
})
export class RecepcionTransferenciaComponent {

  transferenciasService = inject(TransferenciasService);
  uiService = inject(UiService);
  router = inject(Router);

  buscar = {
    transferenciaId: undefined,
    secret: undefined
  }

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = false;

  transferencia: auxTransferencia = {
    transferenciaId: 0,
    bodegaDestinoId: 0,
    fechaEnvio: '',
    observaciones: '',
    transferenciasDetalles: []
  }

  displayedDetalle: auxDetalle[] = [];

  creating = false;

  async getTransferencia(){
    this.loadingTableData = true;
    try {
      this.displayedDetalle = [];
      this.transferencia.transferenciasDetalles = [];
      const req = await this.transferenciasService.getOneForRecepcion(this.buscar.transferenciaId!, this.buscar.secret!);
      
      this.transferencia.transferenciaId = req.transferenciaId;
      this.transferencia.fechaEnvio = req.fechaEnvio;
      this.transferencia.observaciones = req.observaciones;
      this.transferencia.bodegaDestinoId = req.bodegaDestinoId;

      req.transferenciasDetalles.forEach(x => {
        const tempDetalle = {
          detalleId: x.detalleId,
          productoId: x.productoId,
          cantidadDespachada: x.cantidadDespachada,
          cantidadRecibida: x.cantidadRecibida,
          precioCompra: x.precioCompra,
          producto: x.producto,
          cantidadDmg: undefined,
          cantidadPerdida: undefined,
        };
        this.transferencia.transferenciasDetalles.push(tempDetalle);
      });
      
      
      this.displayedDetalle = JSON.parse(JSON.stringify(this.transferencia.transferenciasDetalles));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  setRecibida(event: any, productoId: number, precioCompra: number){
    const tempDetalle1 = this.transferencia.transferenciasDetalles.find(x => x.productoId == productoId && x.precioCompra == precioCompra);
    const tempDetalle2 = this.displayedDetalle.find(x => x.productoId == productoId && x.precioCompra == precioCompra);
    if(Number(event.target.value) > 0 && tempDetalle1 && tempDetalle2){
      tempDetalle1.cantidadRecibida = Number(event.target.value);
      tempDetalle2.cantidadRecibida = Number(event.target.value);
    }else if(tempDetalle1 && tempDetalle2){
      tempDetalle1.cantidadRecibida = 0;
      tempDetalle2.cantidadRecibida = 0;
    }
  }
  
  setDmg(event: any, productoId: number, precioCompra: number){
    const tempDetalle1 = this.transferencia.transferenciasDetalles.find(x => x.productoId == productoId && x.precioCompra == precioCompra);
    const tempDetalle2 = this.displayedDetalle.find(x => x.productoId == productoId && x.precioCompra == precioCompra);
    if(Number(event.target.value) > 0 && tempDetalle1 && tempDetalle2){
      tempDetalle1.cantidadDmg = Number(event.target.value);
      tempDetalle2.cantidadDmg = Number(event.target.value);
    }else if(tempDetalle1 && tempDetalle2){
      tempDetalle1.cantidadDmg = 0;
      tempDetalle2.cantidadDmg = 0;
    }
  }

  setPerdida(event: any, productoId: number, precioCompra: number){
    const tempDetalle1 = this.transferencia.transferenciasDetalles.find(x => x.productoId == productoId && x.precioCompra == precioCompra);
    const tempDetalle2 = this.displayedDetalle.find(x => x.productoId == productoId && x.precioCompra == precioCompra);
    if(Number(event.target.value) > 0 && tempDetalle1 && tempDetalle2){
      tempDetalle1.cantidadPerdida = Number(event.target.value);
      tempDetalle2.cantidadPerdida = Number(event.target.value);
    }else if(tempDetalle1 && tempDetalle2){
      tempDetalle1.cantidadPerdida = 0;
      tempDetalle2.cantidadPerdida = 0;
    }
  }

  valid(){
    for (let i = 0; i < this.transferencia.transferenciasDetalles.length; i++) {
      const detalle = this.transferencia.transferenciasDetalles[i];

      if(detalle.cantidadRecibida == undefined ||
         detalle.cantidadDmg == undefined ||
          detalle.cantidadPerdida == undefined){
        return false;
      }else{
        if(detalle.cantidadRecibida + detalle.cantidadDmg + detalle.cantidadPerdida < detalle.cantidadDespachada){
          return false;
        }
      }
      
    }
    return true;
  }

  async create(){
    this.creating = true;
    try {

      const newRecepcion: RecepcionCreate = {
        transferenciaId: this.transferencia.transferenciaId,
        bodegaDestinoId: this.transferencia.bodegaDestinoId,
        detalle: []
      };

      this.transferencia.transferenciasDetalles.forEach(x => {
        const newDetalle: RecepcionDetalleCreate = {
          detalleId: x.detalleId,
          productoId: x.productoId,
          cantidadRecibida: x.cantidadRecibida!,
          precioCompra: x.precioCompra,
          cantidadDmg: x.cantidadDmg!,
          cantidadPerdida: x.cantidadPerdida!
        };
        newRecepcion.detalle.push(newDetalle);
      });

      await this.transferenciasService.recepcion(newRecepcion);

      this.creating = false;
      this.router.navigate(['/transferencia']);
      this.uiService.showModal('Recepcionado exitosamente', '', 'success');
    } catch (error) {
      this.creating = false;
      this.uiService.showErrorModal('Error al recepcionar', error);
    }
  }

}

interface auxTransferencia {
  transferenciaId: number;
  fechaEnvio: string;
  observaciones: string;
  bodegaDestinoId: number;
  transferenciasDetalles: auxDetalle[];
}

interface auxDetalle extends TransferenciasDetalles {
  cantidadDmg?: number;
  cantidadPerdida?: number;
}

