import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PerdidasService } from '../../services/perdidas.service';
import { UiService } from '../../services/ui.service';
import { Perdida } from '../../interfaces/perdida';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../interfaces/bodega';
import { FormsModule } from '@angular/forms';
import { BodegasService } from '../../services/bodegas.service';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../services/auth.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ColumnItem } from '../../interfaces/column-item';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-perdida',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
    NzPopoverModule,
    NzTypographyModule,
    NzFlexModule,
    DatePipe,
    NzInputModule,
    CommonModule,
    NzModalModule,
    NzDatePickerModule,
    NzRadioModule,
  ],
  templateUrl: './perdida.component.html',
  styleUrl: './perdida.component.scss'
})
export class PerdidaComponent {

  perdidasService = inject(PerdidasService);
  uiService = inject(UiService);
  bodegasService = inject(BodegasService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  perdidas: Perdida[] = [];
  displayedPerdida: Perdida[] = [];

  bodegas: Bodega[] = [];
  selectedBodegaId = 0;
  loadingBodegas = true;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  listOfColumns: ColumnItem<Perdida>[] = [
    {
      name: 'Id pérdida',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => a.perdidaId - b.perdidaId,
      listOfFilter: [],
      filterFn: null,
      width: '70px'
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => (a.producto.nombre || '').localeCompare(b.producto.nombre || ''),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Código',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => (a.producto.codigo || '').localeCompare(b.producto.codigo || ''),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => a.cantidad - b.cantidad,
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Precio producto',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => a.precioCompra - b.precioCompra,
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Fecha registro',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => (a.fechaRegistro || '').localeCompare(b.fechaRegistro || ''),
      listOfFilter: [],
      filterFn: null,
      width: '140px',
      isDateFilter: true
    },
    {
      name: 'Tipo de perdida',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => a.tipoPerdida.nombre!.localeCompare(b.tipoPerdida.nombre),
      listOfFilter: [
        { text: 'Daño', value: 1},
        { text: 'Perdida', value: 2},
        { text: 'Otro', value: 3},
      ],
      filterFn: (selectedValues: number[], item: Perdida) =>
        selectedValues.includes(item.tipoPerdidaId),
      width: '90px'
    },
    {
      name: 'Descripción',
      sortOrder: null,
      sortFn: (a: Perdida, b: Perdida) => (a.descripcion || '').localeCompare(b.descripcion || ''),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    ];

  async ngOnInit() {

    this.selectedBodegaId = this.authService.getUser().bodegaId;

    await this.getBodega();
    await this.getPerdidas();
  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getPerdidas();
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

  async getPerdidas(){
    this.loadingTableData = true;
    try {
      this.perdidas = await this.perdidasService.getAllByIdBodega(this.selectedBodegaId);
      this.displayedPerdida = JSON.parse(JSON.stringify(this.perdidas));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal(error.status == 404 ? 'No se econtraron solicitudes' : 'Error al cargar datos', error);
    }
  }

  isDateFilterModalVisible = false;
  currentColumn: ColumnItem<Perdida> | null = null;
  filterActive = false;
  dateFilterMode: 'before' | 'after' | 'between' = 'before';
  singleDate: Date | null = null;
  dateRange: [Date | null, Date | null] = [null, null];
  openDateFilterModal(column: ColumnItem<Perdida>): void {
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

    this.displayedPerdida = this.perdidas.filter((item) => {
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
  
    this.displayedPerdida = [...this.perdidas]; // Reset table data
    this.closeDateFilterModal();
    const index = this.listOfColumns.findIndex(x => x == this.currentColumn);
    this.listOfColumns[index].hasBeenDateFiltered = false;
    this.currentColumn = null
    this.filterActive =false
  }
  getColumnKey(columnName: string): keyof Perdida {
    const mapping: { [key: string]: keyof Perdida } = {
      'Fecha registro': 'fechaRegistro',
      // Add more mappings as needed
    };
    return mapping[columnName];
  }


  async add(){
    this.router.navigate(['create'], {relativeTo: this.activatedRoute})
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  
    this.displayedPerdida = this.perdidas.filter(
      (item) =>
        item.perdidaId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.producto.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.producto.codigo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.cantidad?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.precioCompra?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.fechaRegistro?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.tipoPerdida.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.descripcion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue)
      );
  }
  
}
