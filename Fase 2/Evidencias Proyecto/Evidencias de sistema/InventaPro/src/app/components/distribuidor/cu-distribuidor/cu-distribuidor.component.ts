import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RutValidatorDirective } from '../../../directives/rut-validator.directive';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DistribuidoresService } from '../../../services/distribuidores.service';
import { UiService } from '../../../services/ui.service';
import { AuthService } from '../../../services/auth.service';
import { DistribuidorCU } from '../../../interfaces/distribuidor';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-cu-distribuidor',
  standalone: true,
  imports: [
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    NzSelectModule,
    RutValidatorDirective,
    NzToolTipModule,
    NzIconModule
  ],
  templateUrl: './cu-distribuidor.component.html',
  styleUrl: './cu-distribuidor.component.scss'
})
export class CuDistribuidorComponent {

  distribuidoresService = inject(DistribuidoresService);
  uiService = inject(UiService);
  authService = inject(AuthService);

  distribuidor: DistribuidorCU = 
  {
    distribuidorId: 0,
    nombre: '',
  }

  isLoadingDistribuidores = true;
  isLoadingCU = false;

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  constructor(private modalService: NzModalService) {}

  async ngOnInit() {
    this.id = this.nzModalData.id;
    this.distribuidor.distribuidorId = this.id;
    if (this.id != 0) {
      await this.getBodegas();
    } else {
      this.isLoadingDistribuidores = false;
    }
  }

  async getBodegas(){
    try {
      const req = await this.distribuidoresService.getById(this.id!);
      
      this.distribuidor.distribuidorId = req.distribuidorId;
      this.distribuidor.nombre = req.nombre;
      this.distribuidor.direccion = req.direccion;
      this.distribuidor.telefono = req.telefono;
      this.distribuidor.correoElectronico = req.correoElectronico;

      this.isLoadingDistribuidores = false;
    } catch (error) {
      this.isLoadingDistribuidores = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async cu() {
    this.isLoadingCU = true;
    try {
      const req = await this.distribuidoresService.CU(this.distribuidor);
      this.isLoadingCU = false;
      this.#modal.destroy({ success: true });
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

}
