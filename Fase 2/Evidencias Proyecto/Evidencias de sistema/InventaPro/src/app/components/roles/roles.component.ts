import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Component, Inject, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Rol } from '../../interfaces/rol';
import { RolesService } from '../../services/roles.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CuRolesComponent } from './cu-roles/cu-roles.component';
import { AuthService } from '../../services/auth.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-roles',
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
    NzPopoverModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  uiService = inject(UiService);
  rolesService = inject(RolesService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);

  roles: Rol[] = [];
  displayedRoles: Rol[] = [];

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  isGlobal = false;

  async ngOnInit() {
    await this.getRoles();
    this.isGlobal = this.authService.hasPermission('r_roles_global');
  }

  async getRoles(){
    this.loadingTableData = true;
    try {
      this.roles = await this.rolesService.getAll();
      this.displayedRoles = JSON.parse(JSON.stringify(this.roles));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  update(id: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar rol',
      nzContent: CuRolesComponent,
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
        this.uiService.showModal('Usuario modificado exitosamente', '', 'success');
        await this.getRoles();
      }
    });
  }

  async delete(r: Rol){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>deshabilitar: ${r.descripcion}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.rolesService.delete(r.rolId);
          this.uiService.showModal(
            'Rol deshabilitado exitosamente',
            '',
            'success'
          );
          await this.getRoles();
        } catch (error) {
          this.uiService.showErrorModal('Error al deshabilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  async activate(r: Rol){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>habilitar: ${r.descripcion}</b>?`,
      { ok: 'Habilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.rolesService.activate(r.rolId);
          this.uiService.showModal(
            'Rol habilitado exitosamente',
            '',
            'success'
          );
          await this.getRoles();
        } catch (error) {
          this.uiService.showErrorModal('Error al habilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  add(){
    const modalRef = this.modalService.create({
      nzTitle: 'Crear Rol',
      nzContent: CuRolesComponent,
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
        this.uiService.showModal('Usuario creado exitosamente', '', 'success');
        await this.getRoles();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.displayedRoles = this.roles.filter(
      (item) =>
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.descripcion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.bodega?.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}
