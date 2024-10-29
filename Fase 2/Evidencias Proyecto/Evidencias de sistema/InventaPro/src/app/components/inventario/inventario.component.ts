import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { UiService } from '../../services/ui.service';
import { Inventario } from '../../interfaces/inventario';
import { InventariosService } from '../../services/inventarios.service';
import { AuthService } from '../../services/auth.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { BodegasService } from '../../services/bodegas.service';
import { Bodega } from '../../interfaces/bodega';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CuSolicitudComponent } from '../solicitud/cu-solicitud/cu-solicitud.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventario',
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
    RouterLink
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent {

  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);
  bodegasService = inject(BodegasService);
  inventariosService = inject(InventariosService);
  

  inventario: Inventario[] = [];
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
      this.inventario = await this.inventariosService.getByIdBodega(this.selectedBodegaId);
      // this.inventario.forEach((x, index) => {
      //   let sum = 0;
      //   x.lotesInventario.forEach(y => {
      //     sum = y.cantidad + sum;
      //   });
      //   this.inventario[index].cantidad = sum;
      // });
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    this.expandSet = new Set<number>();
    await this.getAll();
  }

  update(id: number){
    // const modalRef = this.modalService.create({
    //   nzTitle: 'Modificar producto',
    //   nzContent: CuProductosComponent,
    //   nzMask: true,
    //   nzMaskClosable: false,
    //   nzClosable: true,
    //   nzCentered: true,
    //   nzFooter: null,
    //   nzData: { id: id },
    //   nzStyle: { width: 'fit-content' },
    // });

    // modalRef.afterClose.subscribe(async (result) => {
    //   if (result) {
    //     this.uiService.showModal('Producto modificado exitosamente', '', 'success');
    //     await this.getAll();
    //   }
    // });
  }

  async delete(data: Inventario){
    // let loading = false;
    // this.uiService.showConfirmModal(
    //   'Alerta!',
    //   `Estas seguro que deseas <b>deshabilitar: ${data.nombre}</b>?`,
    //   { ok: 'Deshabilitar', cancel: 'Cancelar' },
    //   loading,
    //   async () => {
    //     loading = true;
    //     try {
    //       this.loadingTableData = true;
    //       await this.productosService.delete(data.productoId);
    //       this.uiService.showModal(
    //         'Producto deshabilitado exitosamente',
    //         '',
    //         'success'
    //       );
    //       await this.getAll();
    //     } catch (error) {
    //       this.uiService.showErrorModal('Error al deshabilitar', error);
    //       this.loadingTableData = false;
    //     } finally {
    //       loading = false;
    //     }
    //   }
    // );
  }

  async activate(data: Inventario){
    // let loading = false;
    // this.uiService.showConfirmModal(
    //   'Alerta!',
    //   `Estas seguro que deseas <b>habilitar: ${data.nombre}</b>?`,
    //   { ok: 'Habilitar', cancel: 'Cancelar' },
    //   loading,
    //   async () => {
    //     loading = true;
    //     try {
    //       this.loadingTableData = true;
    //       await this.productosService.activate(data.productoId);
    //       this.uiService.showModal(
    //         'Producto habilitado exitosamente',
    //         '',
    //         'success'
    //       );
    //       await this.getAll();
    //     } catch (error) {
    //       this.uiService.showErrorModal('Error al habilitar', error);
    //       this.loadingTableData = false;
    //     } finally {
    //       loading = false;
    //     }
    //   }
    // );
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
      nzData: { id: 0, bodegaId: this.selectedBodegaId},
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

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
