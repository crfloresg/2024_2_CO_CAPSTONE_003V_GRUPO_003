import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Compra } from '../../interfaces/compra';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ComprasService } from '../../services/compras.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { ActivatedRoute, Router } from '@angular/router';
import { RCompraComponent } from './r-compra/r-compra.component';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule,
    DatePipe,
    NzDividerModule,
    NzInputModule,
    NzPopoverModule,
    NzFlexModule
  ],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.scss'
})
export class CompraComponent {

  uiService = inject(UiService);
  authService = inject(AuthService);
  modalService = inject(NzModalService);
  comprasService = inject(ComprasService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  env = environment.api;

  compras: Compra[] = [];
  displayedCompras: Compra[] = [];

  async ngOnInit(){
    await this.getCompras();
  }

  async getCompras(){
    this.loadingTableData = true;
    try {
      this.compras = await this.comprasService.getAll();
      this.displayedCompras = JSON.parse(JSON.stringify(this.compras));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.displayedCompras = this.compras.filter(
      (item) =>
        item.compraId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.bodegaId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.observacion?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
      );
  }

  add(){
    this.router.navigate(['create'], { relativeTo: this.route })
  }

  detalle(compraId: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Detalle compra',
      nzContent: RCompraComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: compraId},
      nzStyle: { 
        'width': 'max-content',
        'max-width': '90vw',
        'max-height': '90vh', 
        'overflow-y': 'auto',
       },
    });
  }

  async delete(data: Compra){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>cancelar la compra #${data.compraId}</b>?`,
      { ok: 'Si', cancel: 'No' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.comprasService.cancel(data.compraId);
          this.uiService.showModal(
            'Transferencia cancelada exitosamente',
            '',
            'success'
          );
          await this.getCompras();
        } catch (error) {
          this.uiService.showErrorModal('Error al cancelar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }



}
