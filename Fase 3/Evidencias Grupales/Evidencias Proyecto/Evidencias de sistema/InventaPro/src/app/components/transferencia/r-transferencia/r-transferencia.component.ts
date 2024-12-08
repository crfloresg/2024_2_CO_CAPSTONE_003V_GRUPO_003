import { Component, inject, Input } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TransferenciasService } from '../../../services/transferencias.service';
import { Transferencia, TransferenciasDetalles } from '../../../interfaces/transferencia';
import { UiService } from '../../../services/ui.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DatePipe } from '@angular/common';
import { InformesService } from '../../../services/informes.service';
import { AuthService } from '../../../services/auth.service';
import { ColumnItem } from '../../../interfaces/column-item';

@Component({
  selector: 'app-r-transferencia',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    DatePipe
  ],
  templateUrl: './r-transferencia.component.html',
  styleUrl: './r-transferencia.component.scss'
})
export class RTransferenciaComponent {
  
  transferenciasService = inject(TransferenciasService);
  uiService = inject(UiService);
  informesService = inject(InformesService);
  authService = inject(AuthService);
  
  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  bodegaOrigenId = 0;

  displayedTransferencias: TransferenciasDetalles[] = [];

  downloading = false;

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  
  listOfColumns: ColumnItem<TransferenciasDetalles>[] = [
    {
      name: 'Id producto',
      sortOrder: null,
      sortFn: (a: TransferenciasDetalles, b: TransferenciasDetalles) => a.productoId - b.productoId,
      listOfFilter: [],
      filterFn: null,
      width: '90px'
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: TransferenciasDetalles, b: TransferenciasDetalles) => (a.producto?.nombre || '').localeCompare(b.producto?.nombre || ''),
      listOfFilter: [],
      filterFn: null,
      width: '120px'
    },
    {
      name: 'Código',
      sortOrder: null,
      sortFn: (a: TransferenciasDetalles, b: TransferenciasDetalles) => (a.producto?.codigo || '').localeCompare(b.producto?.codigo || ''),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Precio Compra',
      sortOrder: null,
      sortFn: (a: TransferenciasDetalles, b: TransferenciasDetalles) => (a.precioCompra || 0) - (b.precioCompra || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad despachada',
      sortOrder: null,
      sortFn: (a: TransferenciasDetalles, b: TransferenciasDetalles) => (a.cantidadDespachada ?? 0) - (b.cantidadDespachada || 0),
      listOfFilter: [],
      filterFn: null,
      width: '130px'
    },
    {
      name: 'Cantidad recibida',
      sortOrder: null,
      sortFn: (a: TransferenciasDetalles, b: TransferenciasDetalles) => (a.cantidadRecibida ?? 0) - (b.cantidadRecibida || 0),
      listOfFilter: [],
      filterFn: null,
      width: '120px'
    }
  ];


  async ngOnInit() {
    await this.get();
  }

  async get(){
    this.loadingTableData = true;
    try {
      const req = await this.transferenciasService.getOne(this.nzModalData.id);
      this.displayedTransferencias = JSON.parse(JSON.stringify(req.transferenciasDetalles));
      this.bodegaOrigenId = req.bodegaOrigenId;
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async download(){
    this.downloading = true;
    try {
      const req = await this.informesService.transferenciaDetalle(this.nzModalData.id);
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
