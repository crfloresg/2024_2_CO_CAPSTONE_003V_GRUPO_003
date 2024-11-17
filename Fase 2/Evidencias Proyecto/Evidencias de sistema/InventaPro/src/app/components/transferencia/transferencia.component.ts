import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Transferencia } from '../../interfaces/transferencia';
import { DatePipe } from '@angular/common';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../interfaces/bodega';
import { BodegasService } from '../../services/bodegas.service';
import { UiService } from '../../services/ui.service';
import { FormsModule } from '@angular/forms';
import { TransferenciasService } from '../../services/transferencias.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RTransferenciaComponent } from './r-transferencia/r-transferencia.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [
    FormsModule,
    NzFlexModule,
    NzButtonModule,
    NzTypographyModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzPopoverModule,
    NzSelectModule,
    DatePipe,
    NzDividerModule,
  ],
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.scss'
})
export class TransferenciaComponent {

  uiService = inject(UiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  modalService = inject(NzModalService);
  transferenciasService = inject(TransferenciasService);
  bodegasService = inject(BodegasService);
  authService = inject(AuthService);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;
  loadingBodegas = true;

  displayedTransferencias: Transferencia[] = []
  transferencias: Transferencia[] = []
  bodegas: Bodega[] = [];

  selectedBodegaId = 0;

  async ngOnInit() {
    this.selectedBodegaId = this.authService.getUser().bodegaId; 
    await this.getBodega();
    await this.getTransferencias();
  }

  async getBodega(){
    this.loadingBodegas = true;
    try {
      const req = await this.bodegasService.getAll();
      this.bodegas = req.filter(x => x.bodegaId != 1 );
      this.loadingBodegas = false;
    } catch (error) {
      this.loadingBodegas = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getTransferencias();
  }

  async getTransferencias(){
    this.loadingTableData = true;
    try {
      this.transferencias = await this.transferenciasService.getAllByBodegaId(this.selectedBodegaId);
      this.displayedTransferencias = JSON.parse(JSON.stringify(this.transferencias));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  add(){
    this.router.navigate(['create'], { relativeTo: this.route })
  }
  
  recepcion(){
    this.router.navigate(['recepcion'], { relativeTo: this.route })
  }

  detalle(transferenciaId: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Detalle transferencia',
      nzContent: RTransferenciaComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: transferenciaId},
      nzStyle: { 
        'width': 'max-content',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
       },
    });
  }

  async delete(data: Transferencia){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>cancelar la transferencia #${data.transferenciaId}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.transferenciasService.cancel(data.transferenciaId);
          this.uiService.showModal(
            'Transferencia cancelada exitosamente',
            '',
            'success'
          );
          await this.getTransferencias();
        } catch (error) {
          this.uiService.showErrorModal('Error al cancelar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.displayedTransferencias = this.transferencias.filter(
      (item) =>
        item.transferenciaId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.estadosTransferencia?.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaEnvio?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.fechaRecepcion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.observaciones?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
      );
  }

}
