import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UiService } from '../../../services/ui.service';
import { AlertaService } from '../../../services/alerta.service';
import { AlertaCu } from '../../../interfaces/alerta';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-cu-productos',
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
  templateUrl: './c-alerta.component.html',
  styleUrl: './c-alerta.component.scss'
})
export class CAlerta {

  uiService = inject(UiService);
  alertasService = inject(AlertaService);

  isLoadingCU = false;
  isLoadingAlerta = true;

  alerta: AlertaCu = {
    alertaId: 0,
    ProductoId: 0,
    minimo: 0
  }

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  async ngOnInit() {
    this.id = this.nzModalData.id;

    if(this.id != 0){
      await this.getAlerta();
    }else{ this.isLoadingAlerta = false; }
  }

  async getAlerta(){
    this.isLoadingAlerta = true;
    try {
      const req = await this.alertasService.getAlertById(this.id!);
      this.alerta.ProductoId = req.productoId;
      this.alerta.alertaId = this.id!;
      this.alerta.minimo = req.minimo;
      this.isLoadingAlerta = false;
    } catch (error) {
      this.isLoadingAlerta = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async cu(){
    this.isLoadingCU
    try {
      const req = await this.alertasService.CuPost(this.alerta);
      console.log(this.alerta)
      this.#modal.destroy({ success: true });
      this.isLoadingCU = false;
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al editar alerta', error);
    }
  }

  close(){
    this.#modal.destroy({ success: true });
    
  }

}