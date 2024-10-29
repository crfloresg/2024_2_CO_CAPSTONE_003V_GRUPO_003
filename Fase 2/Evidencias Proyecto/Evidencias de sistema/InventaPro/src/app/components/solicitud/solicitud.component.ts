import { Component, inject } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { BodegasService } from '../../services/bodegas.service';
import { AuthService } from '../../services/auth.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UiService } from '../../services/ui.service';
import { Solicitud } from '../../interfaces/solicitud';
import { Bodega } from '../../interfaces/bodega';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CuSolicitudComponent } from './cu-solicitud/cu-solicitud.component';
import { DatePipe } from '@angular/common';
import { AdSolicitudComponent } from './ad-solicitud/ad-solicitud.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzModalModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule,
    NzSpinModule,
    DatePipe,
    NzPopoverModule
  ],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss'
})
export class SolicitudComponent {

  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);
  bodegasService = inject(BodegasService);
  solicitudesService = inject(SolicitudesService);

  solicitudes: Solicitud[] = [];
  bodegas: Bodega[] = [];

  selectedBodegaId = 0;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;
  loadingBodegas = true;

  async ngOnInit() {
    await this.getBodega();
    this.selectedBodegaId = this.authService.getUser().bodegaId;
    await this.getAll();
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

  async getAll(){
    this.loadingTableData = true;
    try {
      this.solicitudes = await this.solicitudesService.getAllByIdBodega(this.selectedBodegaId);
      this.loadingTableData = false;
    } catch (error: any) {
      this.solicitudes = [];
      this.loadingTableData = false;
      this.uiService.showErrorModal(error.status == 404 ? 'No se econtraron solicitudes' : 'Error al cargar datos', error);
    }
  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getAll();
  }

  add(){
    const modalRef = this.modalService.create({
      nzTitle: 'Crear Solicitud',
      nzContent: CuSolicitudComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: 0, bodegaId: this.selectedBodegaId },
      nzStyle: { 
        'width': 'max-content',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
       },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal('Solicitud creada exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }

  update(id: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar Solicitud',
      nzContent: CuSolicitudComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: id, bodegaId: this.selectedBodegaId },
      nzStyle: { 
        'width': 'max-content',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
       },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal('Solicitud modificado exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }

  async delete(data: Solicitud){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>cancelar la solicitud #${data.solicitudId}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.solicitudesService.cancelar(data.solicitudId);
          this.uiService.showModal(
            'Solicitud cancelada exitosamente',
            '',
            'success'
          );
          await this.getAll();
        } catch (error) {
          this.uiService.showErrorModal('Error al cancelar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  check(data: Solicitud){
    const modalRef = this.modalService.create({
      nzTitle: 'Solicitud',
      nzContent: AdSolicitudComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { 
        idSolicitud: data.solicitudId,
        idBodega: data.bodegaId
      },
      nzStyle: { 
        'width': 'max-content',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
      },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal(result.success == true ? 'Solicitud aceptada exitosamente' : 'Solicitud rechazada exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }

  obs(data: Solicitud){
    const modalRef = this.modalService.create({
      nzTitle: 'Observacion',
      nzContent: data.observaciones,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { 
        idSolicitud: data.solicitudId,
        idBodega: data.bodegaId
      },
      nzStyle: { 
        'width': 'max-content',
        'min-width': '200px',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
      },
    });
  }

}
