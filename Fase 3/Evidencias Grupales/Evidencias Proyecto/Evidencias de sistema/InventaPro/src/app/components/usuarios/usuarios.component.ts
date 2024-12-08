import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UiService } from '../../services/ui.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateUsuarioComponent } from './create-usuario/create-usuario.component';
import { AuthService } from '../../services/auth.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ColumnItem } from '../../interfaces/column-item';

@Component({
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent {
  usuariosService = inject(UsuariosService);
  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  usuarios: Usuario[] = [];
  displayedUssuarios: Usuario[] = [];

  listOfColumns: ColumnItem<Usuario>[] = [
    {
      name: 'Id usuario',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.usuarioId - b.usuarioId,
      listOfFilter: [],
      filterFn: null,
      width: '70px'
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.nombre.localeCompare(b.nombre),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Run',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.run.localeCompare(b.run),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Apellido',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.apellido.localeCompare(b.apellido),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Email',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.email.localeCompare(b.email),
      listOfFilter: [],
      filterFn: null,
      width: '160px'
    },
    {
      name: 'Rol',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.rol.nombre.localeCompare(b.rol.nombre),
      listOfFilter: [],
      filterFn: null,
      width: '150px'
    },
    {
      name: 'Bodega',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.bodega.nombre.localeCompare(b.bodega.nombre),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Estado',
      sortOrder: null,
      sortFn: (a: Usuario, b: Usuario) => a.estado!.localeCompare(b.estado!),
      listOfFilter: [
        { text: 'Habilitado', value: 1},
        { text: 'Deshabilitado', value: 0},
      ],
      filterFn: (selectedValues: number[], item: Usuario) =>
        selectedValues.includes(item.estadoUsuarioId),
      width: '90px'
    },
  ];

  async ngOnInit() {
    await this.getAllUsuarios();
  }

  async getAllUsuarios() {
    this.loadingTableData = true;
    try {
      this.usuarios = await this.usuariosService.getAll();
      this.usuarios.forEach(x => x.estado = x.estadoUsuarioId == 1 ? 'Habilitado' : 'Deshabilitado');
      this.displayedUssuarios = JSON.parse(JSON.stringify(this.usuarios));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  update(id: number) {
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar usuario',
      nzContent: CreateUsuarioComponent,
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
          'Usuario modificado exitosamente',
          '',
          'success'
        );
        await this.getAllUsuarios();
      }
    });
  }

  async delete(u: Usuario) {
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>deshabilitar: ${u.email}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.usuariosService.delete(u.usuarioId);
          this.uiService.showModal(
            'Usuario deshabilitado exitosamente',
            '',
            'success'
          );
          await this.getAllUsuarios();
        } catch (error) {
          this.uiService.showErrorModal('Error al deshabilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  async activate(u: Usuario) {
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>habilitar: ${u.email}</b>?`,
      { ok: 'Habilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.usuariosService.activate(u.usuarioId);
          this.uiService.showModal('Usuario activar exitosamente', '', 'success');
          await this.getAllUsuarios();
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
      nzTitle: 'Crear usuario',
      nzContent: CreateUsuarioComponent,
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
        await this.getAllUsuarios();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  
    this.displayedUssuarios = this.usuarios.filter(
      (item) =>
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.estado?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.run?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.apellido?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.email?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.rol.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue) ||
        item.bodega.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").includes(filterValue)
    );
  }
  

}
