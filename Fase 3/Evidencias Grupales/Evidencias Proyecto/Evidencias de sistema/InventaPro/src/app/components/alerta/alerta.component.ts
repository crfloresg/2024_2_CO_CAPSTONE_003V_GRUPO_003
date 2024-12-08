import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PerdidasService } from '../../services/perdidas.service';
import { UiService } from '../../services/ui.service';
import { Alerta } from '../../interfaces/alerta';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../interfaces/bodega';
import { FormsModule } from '@angular/forms';
import { BodegasService } from '../../services/bodegas.service';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../services/auth.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertaService } from '../../services/alerta.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CAlerta } from './c-alerta/c-alerta.component';
import { ColumnItem } from '../../interfaces/column-item';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzModalModule,
    NzDividerModule,
    NzInputModule,
    NzSelectModule,
    FormsModule
  ],
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.scss'
})
export class AlertaComponent{
  uiService = inject(UiService);
  bodegasService = inject(BodegasService);
  alertaService = inject(AlertaService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  modalService = inject(NzModalService);

  alerta: Alerta[] = [];
  displayedAlerta: Alerta[] = [];

  bodegas: Bodega[] = [];
  selectedBodegaId = 0;
  loadingBodegas = true;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  listOfColumns: ColumnItem<Alerta>[] = [
    {
      name: 'Id alerta',
      sortOrder: null,
      sortFn: (a: Alerta, b: Alerta) => a.alertaId - b.alertaId,
      listOfFilter: [],
      filterFn: null,
      width: '90px'
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: Alerta, b: Alerta) => (a?.nombreProducto || '').localeCompare(b.nombreProducto || ''),
      listOfFilter: [],
      filterFn: null,
      width: '150px'
    },
    {
      name: 'Código',
      sortOrder: null,
      sortFn: (a: Alerta, b: Alerta) => (a.codigo || '').localeCompare(b.codigo || ''),
      listOfFilter: [],
      filterFn: null,
      width: '120px'
    },
    {
      name: 'Cantidad Actual',
      sortOrder: null,
      sortFn: (a: Alerta, b: Alerta) => a.cantidadTotal - b.cantidadTotal,
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Stock Minimo',
      sortOrder: null,
      sortFn: (a: Alerta, b: Alerta) => a.minimo - b.minimo,
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    ];

  async ngOnInit() {
    this.selectedBodegaId = this.authService.getUser().bodegaId;
    await this.getBodega();
    await this.getAllAlerta();
  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getAllAlerta();
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

  async getAllAlerta(){
    this.loadingTableData = true;
    try {
      this.alerta = await this.alertaService.getAll(this.selectedBodegaId);
      this.displayedAlerta = JSON.parse(JSON.stringify(this.alerta));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async delete(data: Alerta){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>deshabilitar: ${data.nombreProducto}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.alertaService.delete(data.alertaId);
          this.uiService.showModal(
            'Alerta deshabilitado exitosamente',
            '',
            'success'
          );
          await this.getAllAlerta();
        } catch (error) {
          this.uiService.showErrorModal('Error al deshabilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  async activate(data: Alerta){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>habilitar: ${data.nombreProducto}</b>?`,
      { ok: 'Habilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.alertaService.activate(data.alertaId);
          this.uiService.showModal(
            'Alerta habilitado exitosamente',
            '',
            'success'
          );
          await this.getAllAlerta();
        } catch (error) {
          this.uiService.showErrorModal('Error al habilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  update(id: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar Alerta',
      nzContent: CAlerta,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: id },
      nzStyle: { width: 'fit-content' },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal('Alerta modificada exitosamente', '', 'success');
        await this.getAllAlerta();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.displayedAlerta = this.alerta.filter(
      (item) =>
        item.nombreProducto?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.codigo?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.cantidadTotal?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.stock?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}

