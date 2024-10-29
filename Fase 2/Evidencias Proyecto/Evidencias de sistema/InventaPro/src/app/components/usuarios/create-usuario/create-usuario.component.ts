import { Component, inject, Input } from '@angular/core';
import {
  NZ_MODAL_DATA,
  NzModalModule,
  NzModalRef,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { UsuarioCU } from '../../../interfaces/usuario';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { Rol } from '../../../interfaces/rol';
import { RolesService } from '../../../services/roles.service';
import { UiService } from '../../../services/ui.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../../interfaces/bodega';
import { BodegasService } from '../../../services/bodegas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-usuario',
  standalone: true,
  imports: [
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    NzSelectModule,
  ],
  templateUrl: './create-usuario.component.html',
  styleUrl: './create-usuario.component.scss',
})
export class CreateUsuarioComponent {
  rolesService = inject(RolesService);
  bodegasService = inject(BodegasService);
  usuariosService = inject(UsuariosService);
  uiService = inject(UiService);
  authService = inject(AuthService);

  usuario: UsuarioCU = {
    apellido: '',
    bodegaId: undefined,
    email: '',
    nombre: '',
    password: '',
    rolId: undefined,
  };

  roles: Rol[] = [];
  rolesFiltered: Rol[] = [];
  bodegas: Bodega[] = [];

  isLoadingUsuario = true;
  isLoadingOpciones = true;
  isLoadingCU = false;
  isGlobal = false;
  passwordTip = '';

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  constructor(private modalService: NzModalService) {}

  async ngOnInit() {
    this.id = this.nzModalData.id;
    this.usuario.usuarioId = this.id;
    this.isGlobal = this.authService.hasPermission('cu_usuarios_global');

    if (this.id != 0) {
      await this.getUsuario();
      this.passwordTip = 'Dejar campo vacio para mantener contraseña';
    } else {
      this.isLoadingUsuario = false;
    }

    await this.getOpciones();
  }

  async getUsuario() {
    try {
      const req = await this.usuariosService.getById(this.id!);

      this.usuario.apellido = req.apellido;
      this.usuario.bodegaId = req.bodegaId;
      this.usuario.email = req.email;
      this.usuario.nombre = req.nombre;
      this.usuario.rolId = req.rolId;
      this.isLoadingUsuario = false;
    } catch (error) {
      this.isLoadingUsuario = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getOpciones() {
    try {
      const req = await this.usuariosService.getOpciones();
      this.roles = req.roles;
      this.rolesFiltered = this.roles.filter(x => x.bodegaId == this.usuario.bodegaId);
      this.bodegas = req.bodegas;

      if (!this.isGlobal) {
        this.usuario.bodegaId = req.bodegas[0].bodegaId;
      }

      this.isLoadingOpciones = false;
    } catch (error) {
      this.isLoadingOpciones = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  selectBodega(id: number){
    this.usuario.rolId = undefined;
    this.rolesFiltered = this.roles.filter(x => x.bodegaId == id);
  }

  async cu() {
    this.isLoadingCU = true;
    try {
      const req = await this.usuariosService.CU(this.usuario);
      this.isLoadingCU = false;
      this.#modal.destroy({ success: true });
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }
}
