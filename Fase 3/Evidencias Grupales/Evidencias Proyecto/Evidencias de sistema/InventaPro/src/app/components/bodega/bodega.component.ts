import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { BodegasService } from '../../services/bodegas.service';
import { Bodega } from '../../interfaces/bodega';
import { CuBodegaComponent } from './cu-bodega/cu-bodega.component';
import { ColumnItem } from '../../interfaces/column-item';

@Component({
  selector: 'app-bodega',
  standalone: true,
  imports: [
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzModalModule,
    NzInputModule,
  ],
  templateUrl: './bodega.component.html',
  styleUrl: './bodega.component.scss'
})
export class BodegaComponent {

  bodegasService = inject(BodegasService);
  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  bodegas: Bodega[] = [];
  displayedBodegas: Bodega[] = [];

  listOfColumns: ColumnItem<Bodega>[] = [{
    name: 'Id bodega',
    sortOrder: null,
    sortFn: (a: Bodega, b: Bodega) => a.bodegaId - b.bodegaId,
    listOfFilter: [],
    filterFn: null,
    width: '50px'
  },
  {
    name: 'Nombre',
    sortOrder: null,
    sortFn: (a: Bodega, b: Bodega) => a.nombre.localeCompare(b.nombre),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Dirección',
    sortOrder: null,
    sortFn: (a: Bodega, b: Bodega) => a.direccion.localeCompare(b.direccion),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Estado',
    sortOrder: null,
    sortFn: (a: Bodega, b: Bodega) => a.estado!.localeCompare(b.estado!),
    listOfFilter: [
      { text: 'Habilitado', value: 1},
      { text: 'Deshabilitado', value: 0},
    ],
    filterFn: (selectedValues: number[], item: Bodega) =>
      selectedValues.includes(item.estadoBodegaId),
    width: '90px'
  }];

  async ngOnInit() {
    await this.getAllBodegas();
  }

  async getAllBodegas() {
    this.loadingTableData = true;
    try {
      this.bodegas = await this.bodegasService.getAllForCrud();
      this.bodegas.forEach(x => {x.estado = x.estadoBodegaId == 1 ? 'Habilitado' : 'Deshabilitado'});
      this.displayedBodegas = JSON.parse(JSON.stringify(this.bodegas));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  update(id: number) {
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar bodega',
      nzContent: CuBodegaComponent,
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
        this.uiService.showModal(
          'Bodega modificada exitosamente',
          '',
          'success'
        );
        await this.getAllBodegas();
      }
    });
  }

  async delete(u: Bodega) {
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>deshabilitar: ${u.nombre}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.bodegasService.delete(u.bodegaId);
          this.uiService.showModal(
            'Bodega deshabilitada exitosamente',
            '',
            'success'
          );
          await this.getAllBodegas();
        } catch (error) {
          this.uiService.showErrorModal('Error al deshabilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  async activate(u: Bodega) {
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>habilitar: ${u.nombre}</b>?`,
      { ok: 'Habilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.bodegasService.activate(u.bodegaId);
          this.uiService.showModal('Bodega activada exitosamente', '', 'success');
          await this.getAllBodegas();
        } catch (error) {
          this.uiService.showErrorModal('Error al activar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  add() {
    const modalRef = this.modalService.create({
      nzTitle: 'Crear bodega',
      nzContent: CuBodegaComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: 0 },
      nzStyle: { width: 'fit-content' },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal('Bodega creado exitosamente', '', 'success');
        await this.getAllBodegas();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  
    this.displayedBodegas = this.bodegas.filter(
      (item) =>
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.estado?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.bodegaId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.direccion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue)
    );
  }

}