import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Compra } from '../../interfaces/compra';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ComprasService } from '../../services/compras.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ActivatedRoute, Router } from '@angular/router';
import { RCompraComponent } from './r-compra/r-compra.component';
import { environment } from '../../../environments/environment.development';
import { ColumnItem } from '../../interfaces/column-item';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule,
    DatePipe,
    NzDividerModule,
    NzInputModule,
    NzPopoverModule,
    NzFlexModule,
    CommonModule,
    NzModalModule,
    NzDatePickerModule,
    NzRadioModule,
  ],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.scss'
})
export class CompraComponent {

  uiService = inject(UiService);
  authService = inject(AuthService);
  modalService = inject(NzModalService);
  comprasService = inject(ComprasService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  env = environment.api;

  compras: Compra[] = [];
  displayedCompras: Compra[] = [];

  listOfColumns: ColumnItem<Compra>[] = [
    {
      name: 'Id solicitud',
      sortOrder: null,
      sortFn: (a: Compra, b: Compra) => a.compraId - b.compraId,
      listOfFilter: [],
      filterFn: null,
      width: '70px'
    },
    {
      name: 'Distribuidor',
      sortOrder: null,
      sortFn: (a: Compra, b: Compra) => (a?.distribuidor.nombre || '').localeCompare(b.distribuidor.nombre || ''),
      listOfFilter: [],
      filterFn: null,
      width: '150px'
    },
    {
      name: 'Observación',
      sortOrder: null,
      sortFn: (a: Compra, b: Compra) => (a.observacion || '').localeCompare(b.observacion || ''),
      listOfFilter: [],
      filterFn: null,
      width: '120px'
    },
    {
      name: 'Fecha ingreso',
      sortOrder: null,
      sortFn: (a: Compra, b: Compra) => (a.fecha || '').localeCompare(b.fecha || ''),
      listOfFilter: [],
      filterFn: null,
      width: '130px',
      isDateFilter: true
    },
    {
      name: 'Fecha cancelado',
      sortOrder: null,
      sortFn: (a: Compra, b: Compra) => (a.fechaCancelado || '').localeCompare(b.fechaCancelado || ''),
      listOfFilter: [],
      filterFn: null,
      width: '130px',
      isDateFilter: true
    }
    ];

  async ngOnInit(){
    await this.getCompras();
  }

  async getCompras(){
    this.loadingTableData = true;
    try {
      this.compras = await this.comprasService.getAll();
      this.displayedCompras = JSON.parse(JSON.stringify(this.compras));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }


  isDateFilterModalVisible = false;
  currentColumn: ColumnItem<Compra> | null = null;
  filterActive = false;
  dateFilterMode: 'before' | 'after' | 'between' = 'before';
  singleDate: Date | null = null;
  dateRange: [Date | null, Date | null] = [null, null];
  openDateFilterModal(column: ColumnItem<Compra>): void {
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

    this.displayedCompras = this.compras.filter((item) => {
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
  
    this.displayedCompras = [...this.compras]; // Reset table data
    this.closeDateFilterModal();
    const index = this.listOfColumns.findIndex(x => x == this.currentColumn);
    this.listOfColumns[index].hasBeenDateFiltered = false;
    this.currentColumn = null
    this.filterActive =false
  }
  getColumnKey(columnName: string): keyof Compra {
    const mapping: { [key: string]: keyof Compra } = {
      'Fecha ingreso': 'fecha',
      'Fecha cancelado': 'fechaCancelado',
      // Add more mappings as needed
    };
    return mapping[columnName];
  }


  add(){
    this.router.navigate(['create'], { relativeTo: this.route })
  }

  detalle(compraId: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Detalle compra',
      nzContent: RCompraComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: compraId},
      nzStyle: { 
        'width': '1000px',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
       },
    });
  }

  async delete(data: Compra){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>cancelar la compra #${data.compraId}</b>?`,
      { ok: 'Si', cancel: 'No' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.comprasService.cancel(data.compraId);
          this.uiService.showModal(
            'Transferencia cancelada exitosamente',
            '',
            'success'
          );
          await this.getCompras();
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

    this.displayedCompras = this.compras.filter(
      (item) =>
        item.compraId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fecha?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.distribuidor.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.observacion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaCancelado?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
      );
  }


}
