import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DistribuidoresService } from '../../services/distribuidores.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { Distribuidor } from '../../interfaces/distribuidor';
import { CuDistribuidorComponent } from './cu-distribuidor/cu-distribuidor.component';
import { ColumnItem } from '../../interfaces/column-item';

@Component({
  selector: 'app-distribuidor',
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
  templateUrl: './distribuidor.component.html',
  styleUrl: './distribuidor.component.scss'
})
export class DistribuidorComponent {

  distribuidoresService = inject(DistribuidoresService); 
  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  distribuidores: Distribuidor[] = [];
  displayedDistribuidores: Distribuidor[] = [];

  listOfColumns: ColumnItem<Distribuidor>[] = [{
    name: 'Id distribuidor',
    sortOrder: null,
    sortFn: (a: Distribuidor, b: Distribuidor) => a.distribuidorId - b.distribuidorId,
    listOfFilter: [],
    filterFn: null,
    width: '70px'
  },
  {
    name: 'Nombre',
    sortOrder: null,
    sortFn: (a: Distribuidor, b: Distribuidor) => a.nombre.localeCompare(b.nombre),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Dirección',
    sortOrder: null,
    sortFn: (a: Distribuidor, b: Distribuidor) => (a?.direccion || '').localeCompare(b.direccion || ''),
    listOfFilter: [],
    filterFn: null,
    width: '150px'
  },
  {
    name: 'Teléfono',
    sortOrder: null,
    sortFn: (a: Distribuidor, b: Distribuidor) =>
      (a?.telefono || '').localeCompare(b?.telefono || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Email',
    sortOrder: null,
    sortFn: (a: Distribuidor, b: Distribuidor) =>
      (a?.correoElectronico || '').localeCompare(b?.correoElectronico || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Estado',
    sortOrder: null,
    sortFn: (a: Distribuidor, b: Distribuidor) => a.estadoDesc!.localeCompare(b.estadoDesc!),
    listOfFilter: [
      { text: 'Habilitado', value: 1},
      { text: 'Deshabilitado', value: 0},
    ],
    filterFn: (selectedValues: number[], item: Distribuidor) =>
      selectedValues.includes(item.estado),
    width: '90px'
  }];

  async ngOnInit() {
    await this.getAll();
  }

  async getAll() {
    this.loadingTableData = true;
    try {
      this.distribuidores = await this.distribuidoresService.getAll();
      this.distribuidores.forEach(x => {x.estadoDesc = x.estado == 1 ? 'Habilitado' : 'Deshabilitado'});
      this.displayedDistribuidores = JSON.parse(JSON.stringify(this.distribuidores));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  update(id: number) {
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar distribuidor',
      nzContent: CuDistribuidorComponent,
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
          'Distribuidor modificado exitosamente',
          '',
          'success'
        );
        await this.getAll();
      }
    });
  }

  async delete(u: Distribuidor) {
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
          await this.distribuidoresService.delete(u.distribuidorId);
          this.uiService.showModal(
            'Distribuidor deshabilitado exitosamente',
            '',
            'success'
          );
          await this.getAll();
        } catch (error) {
          this.uiService.showErrorModal('Error al deshabilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  async activate(u: Distribuidor) {
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
          await this.distribuidoresService.activate(u.distribuidorId);
          this.uiService.showModal('Distribuidor activado exitosamente', '', 'success');
          await this.getAll();
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
      nzTitle: 'Crear distribuidor',
      nzContent: CuDistribuidorComponent,
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
        this.uiService.showModal('Distribuidor creado exitosamente', '', 'success');
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
  
    this.displayedDistribuidores = this.distribuidores.filter(
      (item) =>
        item.distribuidorId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.estadoDesc?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.direccion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.telefono?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.correoElectronico?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue)
    );
  }

}
