import { Component, inject, Input } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PermisosService } from '../../../services/permisos.service';
import { UiService } from '../../../services/ui.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Permiso } from '../../../interfaces/permiso';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Rol } from '../../../interfaces/rol';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RolesService } from '../../../services/roles.service';
import { AuthService } from '../../../services/auth.service';
import { Bodega } from '../../../interfaces/bodega';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-cu-roles',
  standalone: true,
  imports: [
    NzSpinModule,
    NzInputModule,
    NzCheckboxModule,
    NzTableModule,
    FormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './cu-roles.component.html',
  styleUrl: './cu-roles.component.scss'
})
export class CuRolesComponent {

  permisosService = inject(PermisosService);
  uiService = inject(UiService);
  rolesService = inject(RolesService);
  authService = inject(AuthService);

  isLoadingPermiso = true;
  isLoadingCU = false;
  isLoadingRol = true;
  isLoadingOpciones = true;
  isGlobal = false;
  displayedPermisos: PermisoConCheck[] = [];
  nuevoRol: Rol = {
    rolId: 0,
    bodegaId: 0,
    descripcion: '',
    nombre: '',
    estado: 1,
    permisos: []
  }

  bodegas: Bodega[] = [];

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  constructor(private modalService: NzModalService) {}

  async ngOnInit() {
    this.id = this.nzModalData.id;

    await this.getAllPermisos();

    if(this.id != 0){
      await this.getRol();
    }else {
      this.isLoadingRol = false;
    }

    if(this.authService.hasPermission('cu_roles_global')){
      this.isGlobal = true;
      await this.getOpciones();
    }else{
      this.isLoadingOpciones = false;
    }
    
  }

  async getOpciones(){
    try {
      const req = await this.rolesService.getOpciones();
      this.bodegas = req;
      this.isLoadingOpciones = false;
    } catch (error) {
      this.isLoadingOpciones = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getRol(){
    this.isLoadingRol = true;
    try {
      const req = await this.rolesService.getById(this.id!);
      this.nuevoRol = req;

      if(this.nuevoRol.permisos!.length > 0){
        this.nuevoRol.permisos!.forEach(element => {
          var x = this.displayedPermisos.findIndex(x => x.permisoId == element.permisoId);
          this.displayedPermisos[x].checked = true;
        });
      }
      
      this.isLoadingRol = false;
    } catch (error) {
      this.isLoadingRol = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getAllPermisos(){
    this.isLoadingPermiso = true;
    try {
      const req = await this.permisosService.getAll();
      this.displayedPermisos = req;
      for (let index = 0; index < this.displayedPermisos.length; index++) {
        this.displayedPermisos[index].checked = false;
        
      }
      this.isLoadingPermiso = false;
    } catch (error) {
      this.isLoadingPermiso = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async cu(){
    this.isLoadingCU = true;
    try {
      if(!this.isGlobal){
        this.nuevoRol.bodegaId = this.authService.getUser().bodegaId;
      }
      const req = await this.rolesService.CuPost(this.nuevoRol);
      this.#modal.destroy({ success: true });
      this.isLoadingCU = false;
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  checkbox(checked: boolean, data: PermisoConCheck){
    if(checked){
      let auxPermiso: Permiso = {
        nombre: data.nombre,
        permisoId: data.permisoId,
        descripcion: data.descripcion
      }
      this.nuevoRol.permisos?.push(auxPermiso);
    } else {
      let index = this.nuevoRol.permisos!.findIndex(x => x.permisoId == data.permisoId);
      this.nuevoRol.permisos?.splice(index, 1);
    }
  }

  close(){
    this.#modal.destroy({ success: true });
    
  }

}

interface PermisoConCheck extends Permiso{
  checked?: boolean;
}
