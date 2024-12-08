import { Component, inject, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UiService } from '../../../services/ui.service';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../../services/auth.service';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../interfaces/producto';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { SolicitudCU, DetallesSolicitudesInventarioCU } from '../../../interfaces/solicitud';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../../interfaces/bodega';
import { BodegasService } from '../../../services/bodegas.service';
import { ColumnItem } from '../../../interfaces/column-item';
import { NzAffixModule } from 'ng-zorro-antd/affix';

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
    NzIconModule,
    NzTypographyModule,
    NzSelectModule,
    NzModalModule
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
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

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

  bodegasService = inject(BodegasService);
  bodegas: Bodega[] = [];
  loadingBodegas = true;

  id: any;
  bodegaId: any;

  listOfColumns: ColumnItem<ProductoAux>[] = [
  {
    name: 'Seleccionar',
    sortOrder: null,
    sortFn: null,
    listOfFilter: [],
    filterFn: null,
    width: '60px'
  },
  {
    name: 'Id producto',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => a.productoId - b.productoId,
    listOfFilter: [],
    filterFn: null,
    width: '60px'
  },
  {
    name: 'Nombre',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => a.nombre.localeCompare(b.nombre),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Código',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => (a?.codigo || '').localeCompare(b.codigo || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Categoría',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => (a?.categoria || '').localeCompare(b.categoria || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Unidad de medida',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => (a?.unidadMedida || '').localeCompare(b.unidadMedida || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Precio Venta',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => (a.precioVenta || 0) - (b.precioVenta || 0),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Cantidad bodega',
    sortOrder: null,
    sortFn: (a: ProductoAux, b: ProductoAux) => (a.inventarios![0].cantidad ?? 0) - (b.inventarios![0].cantidad || 0),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  }];

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('solicitudId')!;
    this.bodegaId = Number(this.activatedRoute.snapshot.paramMap.get('bodegaId')!);

    this.solicitud.solicitudId = this.id;
    await this.getBodega();
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
      let tempProductos = JSON.parse(JSON.stringify(this.productos));

      for (
        let index = 0;
        index < this.solicitud.detallesSolicitudesInventario.length;
        index++
      ) {
        const element = this.solicitud.detallesSolicitudesInventario[index];
        const prodIndex = tempProductos.findIndex(
          (x: any) => x.productoId == element.productoId
        );

        if (prodIndex != -1) {
          const tempProd = tempProductos[prodIndex];

          let p = this.productos.find(x => x.productoId == element.productoId)!;
          p.checked = true;
          p.cantidad = element.cantidad;

          tempProd.checked = true;
          tempProd.cantidad = element.cantidad;

          this.displayedProductos.push(tempProd);
          tempProductos.splice(prodIndex, 1);
        }
      }

      this.displayedProductos = this.displayedProductos.concat(tempProductos);

      this.loadingSolicitud = false;
    } catch (error) {
      this.loadingSolicitud = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
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

  async selectBodega(id: number){
    if(this.activatedRoute.snapshot.paramMap.get('solicitudId')! == '0' && this.authService.hasPermission('cu_solicitudes_global')){
      this.solicitud.bodegaId = id;
      this.bodegaId = id;
      await this.getAll();
    }
  }

  onItemChecked(check: boolean, productoId: number) {
    
    const producto = this.productos.find(x => x.productoId == productoId);
    const producto2 = this.displayedProductos.find(x => x.productoId == productoId);
    if(check){
      producto!.checked = true;
      producto2!.checked = true;
    }else{
      producto!.checked = false;
      producto2!.checked = false;
    }
  }

  setCantidad(event: any, productoId: number){
    let producto = this.productos.find(x => x.productoId == productoId);
    let producto2 = this.displayedProductos.find(x => x.productoId == productoId);
    if(producto && producto2){
      if(Number(event.target.value) > 0){
        producto.cantidad = Number(event.target.value);
        producto2.cantidad = Number(event.target.value);
      }else{
        producto.cantidad = 0;
        producto2.cantidad = 0;
      }
    }
  }

  inputStatus(productoId: number) {

    let producto = this.productos.find(x => x.productoId == productoId)!;

    const error: NzStatus = 'error';
    const def: NzStatus = '';
    if (
      (producto.cantidad == undefined ||
        producto.cantidad! <= 0) &&
        producto.checked == true
    ) {
      return error;
    }
    return def;
  }

  inputValid(productoId: number) {

    let producto = this.productos.find(x => x.productoId == productoId);

    if(producto){
      if (producto.checked == true) {
        return true;
      }
    }
    return false;
  }

  valid() {

    let unchecked = 0

    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      
      if(element.checked){
        if(element.cantidad == undefined){
          return false;
        }else if(element.cantidad <= 0){
          return false;
        }
      }else {
        unchecked += 1;
      }

    }

    if(unchecked == this.productos.length){
      return false;
    }

    return true;
  }

  async cu() {
    this.isLoadingCU = true;
    try {
      this.createDetalle();
      const req = await this.solicitudesService.CuPost(this.solicitud);
      this.isLoadingCU = false;
      this.router.navigate(['/solicitud'])
      this.uiService.showModal('Solicitud creada exitosamente', '', 'success');
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  createDetalle() {
    this.solicitud.detallesSolicitudesInventario = [];
    this.productos.forEach((element) => {
      if (element.checked == true && element.cantidad! > 0) {
        const tempDetalle: DetallesSolicitudesInventarioCU = {
          cantidad: element.cantidad!,
          productoId: element.productoId,
        };
        this.solicitud.detallesSolicitudesInventario.push(tempDetalle);
      }
    });
  }

  isResumenVisible = false;
  displayedDetallesSolicitudesInventario: DetallesSolicitudesInventarioCU[] | null = [];
  resumen(){
    this.isResumenVisible = !this.isResumenVisible;  
    if(this.isResumenVisible){
      this.createDetalle();
      this.displayedDetallesSolicitudesInventario = null;
      this.displayedDetallesSolicitudesInventario = JSON.parse(JSON.stringify(this.solicitud.detallesSolicitudesInventario));
    }else{
      this.displayedDetallesSolicitudesInventario = null;
    }
  }
  getProductoNombre(productoId: number): string {
    return this.productos.find(x => x.productoId === productoId)?.nombre || '';
  }
  getProductoCodigo(productoId: number): string {
    return this.productos.find(x => x.productoId === productoId)?.codigo || '';
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    this.displayedProductos = this.productos.filter(
      (item) =>
        item.cantidad?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.productoId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.codigo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.categoria?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.unidadMedida?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.precioVenta?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}

interface ProductoAux extends Producto{
  cantidad?: number;
  checked?: boolean;
}