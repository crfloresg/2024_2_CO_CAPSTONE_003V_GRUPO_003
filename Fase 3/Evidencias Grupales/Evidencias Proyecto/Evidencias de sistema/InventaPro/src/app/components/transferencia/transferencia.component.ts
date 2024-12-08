import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Transferencia } from '../../interfaces/transferencia';
import { CommonModule, DatePipe } from '@angular/common';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../interfaces/bodega';
import { BodegasService } from '../../services/bodegas.service';
import { UiService } from '../../services/ui.service';
import { FormsModule } from '@angular/forms';
import { TransferenciasService } from '../../services/transferencias.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { RTransferenciaComponent } from './r-transferencia/r-transferencia.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ColumnItem } from '../../interfaces/column-item';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [
    FormsModule,
    NzFlexModule,
    NzButtonModule,
    NzTypographyModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzPopoverModule,
    NzSelectModule,
    DatePipe,
    NzDividerModule,
    CommonModule,
    NzModalModule,
    NzDatePickerModule,
    NzRadioModule,
  ],
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.scss'
})
export class TransferenciaComponent {

  uiService = inject(UiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  modalService = inject(NzModalService);
  transferenciasService = inject(TransferenciasService);
  bodegasService = inject(BodegasService);
  authService = inject(AuthService);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;
  loadingBodegas = true;

  displayedTransferencias: Transferencia[] = []
  transferencias: Transferencia[] = []
  bodegas: Bodega[] = [];

  selectedBodegaId = 0;

  listOfColumns: ColumnItem<Transferencia>[] = [
    {
      name: 'Id solicitud',
      sortOrder: null,
      sortFn: (a: Transferencia, b: Transferencia) => a.transferenciaId - b.transferenciaId,
      listOfFilter: [],
      filterFn: null,
      width: '90px'
    },
    {
      name: 'Observación',
      sortOrder: null,
      sortFn: (a: Transferencia, b: Transferencia) => (a?.observaciones || '').localeCompare(b.observaciones || ''),
      listOfFilter: [],
      filterFn: null,
      width: '150px'
    },
    {
      name: 'Fecha envío',
      sortOrder: null,
      sortFn: (a: Transferencia, b: Transferencia) => (a.fechaEnvio || '').localeCompare(b.fechaEnvio || ''),
      listOfFilter: [],
      filterFn: null,
      width: '120px',
      isDateFilter: true
    },
    {
      name: 'Fecha recepción',
      sortOrder: null,
      sortFn: (a: Transferencia, b: Transferencia) => (a.fechaRecepcion || '').localeCompare(b.fechaRecepcion || ''),
      listOfFilter: [],
      filterFn: null,
      width: '120px',
      isDateFilter: true
    },
    {
      name: 'Estado',
      sortOrder: null,
      sortFn: (a: Transferencia, b: Transferencia) => a.estadosTransferencia.nombre!.localeCompare(b.estadosTransferencia.nombre!),
      listOfFilter: [
        { text: 'Pendiente', value: 1},
        { text: 'En transito', value: 2},
        { text: 'Completada', value: 3},
        { text: 'Cancelada', value: 4},
        { text: 'Transferencia a terceros', value: 5},
      ],
      filterFn: (selectedValues: number[], item: Transferencia) =>
        selectedValues.includes(item.estadoTransferenciaId),
      width: '90px'
    }
    ];

  async ngOnInit() {
    this.selectedBodegaId = this.authService.getUser().bodegaId; 
    await this.getBodega();
    await this.getTransferencias();
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



  isDateFilterModalVisible = false;
  currentColumn: ColumnItem<Transferencia> | null = null;
  filterActive = false;
  dateFilterMode: 'before' | 'after' | 'between' = 'before';
  singleDate: Date | null = null;
  dateRange: [Date | null, Date | null] = [null, null];
  openDateFilterModal(column: ColumnItem<Transferencia>): void {
    this.currentColumn = column;
    this.isDateFilterModalVisible = true;
    this.dateFilterMode = 'before'; // Default mode
    this.dateRange = [null, null]; // Reset date range
    this.singleDate = null; // Reset single date
  }
  closeDateFilterModal(): void {
    this.isDateFilterModalVisible = false;
  }
  applyDateFilter(): void {
    if (!this.currentColumn) return;
  
    const index = this.listOfColumns.findIndex(x => x == this.currentColumn);
    this.listOfColumns[index].hasBeenDateFiltered = true;
    this.filterActive =true;

    this.displayedTransferencias = this.transferencias.filter((item) => {
      const itemDate = new Date((item as any)[this.getColumnKey(this.currentColumn!.name)]);
  
      if (this.dateFilterMode === 'before' && this.singleDate) {
        return itemDate <= this.singleDate;
      }
      if (this.dateFilterMode === 'after' && this.singleDate) {
        return itemDate >= this.singleDate;
      }
      if (this.dateFilterMode === 'between' && this.dateRange[0] && this.dateRange[1]) {
        return itemDate >= this.dateRange[0] && itemDate <= this.dateRange[1];
      }
      return true; // Default case to include all
    });
  
    this.closeDateFilterModal();
  }
  clearDateFilter(): void {
    if (!this.currentColumn) return;
  
    this.displayedTransferencias = [...this.transferencias]; // Reset table data
    this.closeDateFilterModal();
    const index = this.listOfColumns.findIndex(x => x == this.currentColumn);
    this.listOfColumns[index].hasBeenDateFiltered = false;
    this.currentColumn = null
    this.filterActive =false
  }
  getColumnKey(columnName: string): keyof Transferencia {
    const mapping: { [key: string]: keyof Transferencia } = {
      'Fecha envío': 'fechaEnvio',
      'Fecha recepción': 'fechaRecepcion',
      // Add more mappings as needed
    };
    return mapping[columnName];
  }


  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getTransferencias();
  }

  async getTransferencias(){
    this.loadingTableData = true;
    try {
      this.transferencias = await this.transferenciasService.getAllByBodegaId(this.selectedBodegaId);
      this.displayedTransferencias = JSON.parse(JSON.stringify(this.transferencias));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  add(){
    this.router.navigate(['create'], { relativeTo: this.route })
  }
  
  recepcion(){
    this.router.navigate(['recepcion'], { relativeTo: this.route })
  }

  detalle(transferenciaId: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Detalle transferencia',
      nzContent: RTransferenciaComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: transferenciaId},
      nzStyle: { 
        'width': '1000px',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
       },
    });
  }

  async delete(data: Transferencia){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>cancelar la transferencia #${data.transferenciaId}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.transferenciasService.cancel(data.transferenciaId);
          this.uiService.showModal(
            'Transferencia cancelada exitosamente',
            '',
            'success'
          );
          await this.getTransferencias();
        } catch (error) {
          this.uiService.showErrorModal('Error al cancelar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    this.displayedTransferencias = this.transferencias.filter(
      (item) =>
        item.transferenciaId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.estadosTransferencia?.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaEnvio?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaRecepcion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.observaciones?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
      );
  }

}
