import { Component, inject } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { BodegasService } from '../../services/bodegas.service';
import { AuthService } from '../../services/auth.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UiService } from '../../services/ui.service';
import { Solicitud } from '../../interfaces/solicitud';
import { Bodega } from '../../interfaces/bodega';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CuSolicitudComponent } from './cu-solicitud/cu-solicitud.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AdSolicitudComponent } from './ad-solicitud/ad-solicitud.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnItem } from '../../interfaces/column-item';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { RSolicitudComponent } from './r-solicitud/r-solicitud.component';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzModalModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzSpinModule,
    DatePipe,
    NzPopoverModule,
    NzInputModule,
    NzDatePickerModule,
    NzRadioModule,
    CommonModule
  ]
  ,
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss'
})
export class SolicitudComponent {

  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);
  bodegasService = inject(BodegasService);
  solicitudesService = inject(SolicitudesService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  solicitudes: Solicitud[] = [];
  displayedSolicitudes: Solicitud[] = [];
  bodegas: Bodega[] = [];

  selectedBodegaId = 0;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;
  loadingBodegas = true;

  listOfColumns: ColumnItem<Solicitud>[] = [
    {
      name: 'Id solicitud',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => a.solicitudId - b.solicitudId,
      listOfFilter: [],
      filterFn: null,
      width: '70px'
    },
    {
      name: 'Observación',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => (a?.observaciones || '').localeCompare(b.observaciones || ''),
      listOfFilter: [],
      filterFn: null,
      width: '150px'
    },
    {
      name: 'Fecha creación solicitud',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => (a.fechaSolicitud || '').localeCompare(b.fechaSolicitud || ''),
      listOfFilter: [],
      filterFn: null,
      width: '130px',
      isDateFilter: true,
    },
    {
      name: 'Fecha Modificación',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => (a.fechaModificacion || '').localeCompare(b.fechaModificacion || ''),
      listOfFilter: [],
      filterFn: null,
      width: '130px',
      isDateFilter: true,
    },
    {
      name: 'Fecha Aceptada',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => (a.fechaAprobacion || '').localeCompare(b.fechaAprobacion || ''),
      listOfFilter: [],
      filterFn: null,
      width: '130px',
      isDateFilter: true,
    },
    {
      name: 'Fecha Rechazada',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => (a.fechaRechazo || '').localeCompare(b.fechaRechazo || ''),
      listOfFilter: [],
      filterFn: null,
      width: '130px',
      isDateFilter: true,
    },
    {
      name: 'Estado',
      sortOrder: null,
      sortFn: (a: Solicitud, b: Solicitud) => a.estadoSolicitudInventario.nombre!.localeCompare(b.estadoSolicitudInventario.nombre!),
      listOfFilter: [
        { text: 'Pendiente', value: 1},
        { text: 'En preparación', value: 2},
        { text: 'Rechazada', value: 3},
        { text: 'Completada', value: 4},
        { text: 'Cancelada', value: 5},
      ],
      filterFn: (selectedValues: number[], item: Solicitud) =>
        selectedValues.includes(item.estadoSolicitudId),
      width: '90px'
    }
    ];

  async ngOnInit() {
    await this.getBodega();
    this.selectedBodegaId = this.authService.getUser().bodegaId;
    await this.getAll();
  }

  async getBodega(){
    this.loadingBodegas = true;
    try {
      this.bodegas = await this.bodegasService.getAll();
      this.loadingBodegas = false;
    } catch (error) {
      this.loadingBodegas = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getAll(){
    this.loadingTableData = true;
    try {
      this.solicitudes = await this.solicitudesService.getAllByIdBodega(this.selectedBodegaId);
      this.displayedSolicitudes = JSON.parse(JSON.stringify(this.solicitudes));
      this.loadingTableData = false;
    } catch (error: any) {
      this.solicitudes = [];
      this.loadingTableData = false;
      this.uiService.showErrorModal(error.status == 404 ? 'No se econtraron solicitudes' : 'Error al cargar datos', error);
    }
  }


  isDateFilterModalVisible = false;
  currentColumn: ColumnItem<Solicitud> | null = null;
  filterActive = false;
  dateFilterMode: 'before' | 'after' | 'between' = 'before';
  singleDate: Date | null = null;
  dateRange: [Date | null, Date | null] = [null, null];
  openDateFilterModal(column: ColumnItem<Solicitud>): void {
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

    this.displayedSolicitudes = this.solicitudes.filter((item) => {
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
  
    this.displayedSolicitudes = [...this.solicitudes]; // Reset table data
    this.closeDateFilterModal();
    const index = this.listOfColumns.findIndex(x => x == this.currentColumn);
    this.listOfColumns[index].hasBeenDateFiltered = false;
    this.currentColumn = null
    this.filterActive =false
  }
  getColumnKey(columnName: string): keyof Solicitud {
    const mapping: { [key: string]: keyof Solicitud } = {
      'Fecha creación solicitud': 'fechaSolicitud',
      'Fecha Modificación': 'fechaModificacion',
      'Fecha Aceptada': 'fechaAprobacion',
      'Fecha Rechazada': 'fechaRechazo',
      // Add more mappings as needed
    };
    return mapping[columnName];
  }
  
  
  
  


  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getAll();
  }

  add(){
    this.router.navigate(['create', 0, this.selectedBodegaId], {relativeTo: this.activatedRoute});
  }

  update(id: number){
    this.router.navigate(['create', id, this.selectedBodegaId], {relativeTo: this.activatedRoute});
  }

  async delete(data: Solicitud){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>cancelar la solicitud #${data.solicitudId}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.solicitudesService.cancelar(data.solicitudId);
          this.uiService.showModal(
            'Solicitud cancelada exitosamente',
            '',
            'success'
          );
          await this.getAll();
        } catch (error) {
          this.uiService.showErrorModal('Error al cancelar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  check(data: Solicitud){
    const modalRef = this.modalService.create({
      nzTitle: `Gestionar solicitud id: ${data.solicitudId}`,
      nzContent: AdSolicitudComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { 
        idSolicitud: data.solicitudId,
        idBodega: data.bodegaId
      },
      nzStyle: { 
        'width': '1100px',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
      },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal(result.success == true ? 'Solicitud aceptada exitosamente' : 'Solicitud rechazada exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }

  details(data: Solicitud){
    const modalRef = this.modalService.create({
      nzTitle: `Detalle de la solicitud id: ${data.solicitudId}`,
      nzContent: RSolicitudComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { 
        idSolicitud: data.solicitudId,
        idBodega: data.bodegaId
      },
      nzStyle: { 
        'width': '1100px',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
      },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal(result.success == true ? 'Solicitud aceptada exitosamente' : 'Solicitud rechazada exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    this.displayedSolicitudes = this.solicitudes.filter(
      (item) =>
        item.solicitudId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaSolicitud?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaAprobacion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaRechazo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaCompletada?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaModificacion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.estadoSolicitudInventario.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.observaciones?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}
