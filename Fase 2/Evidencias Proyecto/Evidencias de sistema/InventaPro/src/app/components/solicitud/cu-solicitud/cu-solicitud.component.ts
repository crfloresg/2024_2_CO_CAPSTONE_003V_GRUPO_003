import { Component, inject, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UiService } from '../../../services/ui.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../../services/auth.service';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../interfaces/producto';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { SolicitudCU, DetallesSolicitudesInventarioCU } from '../../../interfaces/solicitud';

@Component({
  selector: 'app-cu-solicitud',
  standalone: true,
  imports: [
    NzTableModule,
    NzCheckboxModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    FormsModule,
    NzFlexModule,
  ],
  templateUrl: './cu-solicitud.component.html',
  styleUrl: './cu-solicitud.component.scss',
})
export class CuSolicitudComponent {
  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);
  solicitudesService = inject(SolicitudesService);
  productosService = inject(ProductosService);

  productos: ProductoAux[] = [];
  displayedProductos: ProductoAux[] = [];

  solicitud: SolicitudCU = {
    solicitudId: 0,
    bodegaId: this.authService.getUser().bodegaId,
    detallesSolicitudesInventario: [],
  };

  isLoadingCU = false;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;
  loadingSolicitud = true;

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  @Input() bodegaId?: number;
  readonly nzModalData: { id: number; bodegaId: number } =
    inject(NZ_MODAL_DATA);

  async ngOnInit() {
    this.id = this.nzModalData.id;
    this.bodegaId = this.nzModalData.bodegaId;
    this.solicitud.solicitudId = this.id;

    await this.getAll();

    if (this.id != 0) {
      await this.getSolicitud();
    } else {
      this.loadingSolicitud = false;
    }
  }

  async getAll() {
    this.loadingTableData = true;
    try {
      this.productos = await this.solicitudesService.getOpciones(
        this.bodegaId!
      );
      this.productos.forEach((element) => {
        element.checked = false;
        if (element.inventarios?.length == 0) {
          element.inventarios = [{ cantidad: 0 }];
        }
      });
      this.displayedProductos = JSON.parse(JSON.stringify(this.productos));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getSolicitud() {
    this.loadingSolicitud = true;
    try {
      this.solicitud = await this.solicitudesService.getOneByIdSolicitud(
        this.id!
      );

      this.displayedProductos = [];

      for (
        let index = 0;
        index < this.solicitud.detallesSolicitudesInventario.length;
        index++
      ) {
        const element = this.solicitud.detallesSolicitudesInventario[index];
        const prodIndex = this.productos.findIndex(
          (x) => x.productoId == element.productoId
        );

        if (prodIndex != -1) {
          const tempProd = this.productos[prodIndex];

          console.log(tempProd);

          tempProd.checked = true;
          tempProd.cantidad = element.cantidad;

          this.displayedProductos.push(tempProd);
          this.productos.splice(prodIndex, 1);
        }
      }

      this.displayedProductos = this.displayedProductos.concat(this.productos);

      this.loadingSolicitud = false;
    } catch (error) {
      this.loadingSolicitud = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  onItemChecked(check: boolean, productoId: number) {
    console.log(check, productoId);
  }

  inputStatus(index: number) {
    const error: NzStatus = 'error';
    const def: NzStatus = '';
    if (
      (this.displayedProductos[index].cantidad == undefined ||
        this.displayedProductos[index].cantidad! <= 0) &&
      this.displayedProductos[index].checked == true
    ) {
      return error;
    }
    return def;
  }

  inputValid(index: number) {
    if (this.displayedProductos[index].checked == true) {
      return true;
    }
    return false;
  }

  valid() {
    for (let index = 0; index < this.displayedProductos.length; index++) {
      const element = this.displayedProductos[index];
      if (
        element.checked == true &&
        this.displayedProductos[index].cantidad != undefined &&
        this.displayedProductos[index].cantidad! > 0
      ) {
        return false;
      }
    }
    return true;
  }

  async cu() {
    this.isLoadingCU = true;
    try {
      this.createDetalle();
      const req = await this.solicitudesService.CuPost(this.solicitud);
      this.isLoadingCU = false;
      this.#modal.destroy({ success: true });
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  createDetalle() {
    this.solicitud.detallesSolicitudesInventario = [];
    this.displayedProductos.forEach((element) => {
      if (element.checked == true && element.cantidad! > 0) {
        const tempDetalle: DetallesSolicitudesInventarioCU = {
          cantidad: element.cantidad!,
          productoId: element.productoId,
        };
        this.solicitud.detallesSolicitudesInventario.push(tempDetalle);
      }
    });
  }
}

interface ProductoAux extends Producto{
  cantidad?: number;
  checked?: boolean;
}