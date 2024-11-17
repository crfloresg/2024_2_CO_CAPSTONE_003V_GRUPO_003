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
import { NzInputModule } from 'ng-zorro-antd/input';
import { Router, ActivatedRoute } from '@angular/router';

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
    NzPopoverModule,
    NzInputModule
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
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  solicitudes: Solicitud[] = [];
  displayedSolicitudes: Solicitud[] = [];
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
      this.displayedSolicitudes = JSON.parse(JSON.stringify(this.solicitudes));
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
    this.router.navigate(['create', 0, this.selectedBodegaId], {relativeTo: this.activatedRoute});
  }

  update(id: number){
    this.router.navigate(['create', id, this.selectedBodegaId], {relativeTo: this.activatedRoute});
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.displayedSolicitudes = this.solicitudes.filter(
      (item) =>
        item.solicitudId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaSolicitud?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaAprobacion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaRechazo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaCompletada?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaModificacion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.observaciones?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}
