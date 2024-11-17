import { Component, inject, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RutValidatorDirective } from '../../../directives/rut-validator.directive';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BodegasService } from '../../../services/bodegas.service';
import { UiService } from '../../../services/ui.service';
import { AuthService } from '../../../services/auth.service';
import { BodegaCU } from '../../../interfaces/bodega';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-cu-bodega',
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
  templateUrl: './cu-bodega.component.html',
  styleUrl: './cu-bodega.component.scss'
})
export class CuBodegaComponent {

  bodegasService = inject(BodegasService);
  uiService = inject(UiService);
  authService = inject(AuthService);

  bodega: BodegaCU = 
  {
    bodegaId: 0,
    nombre: '',
    direccion: ''
  }

  isLoadingBodega = true;
  isLoadingCU = false;

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  constructor(private modalService: NzModalService) {}

  async ngOnInit() {
    this.id = this.nzModalData.id;
    this.bodega.bodegaId = this.id;
    if (this.id != 0) {
      await this.getBodegas();
    } else {
      this.isLoadingBodega = false;
    }
  }

  async getBodegas(){
    try {
      const req = await this.bodegasService.getById(this.id!);
      this.bodega.nombre = req.nombre;
      this.bodega.direccion = req.direccion;
      this.isLoadingBodega = false;
    } catch (error) {
      this.isLoadingBodega = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async cu() {
    this.isLoadingCU = true;
    try {
      const req = await this.bodegasService.CU(this.bodega);
      this.isLoadingCU = false;
      this.#modal.destroy({ success: true });
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

}
