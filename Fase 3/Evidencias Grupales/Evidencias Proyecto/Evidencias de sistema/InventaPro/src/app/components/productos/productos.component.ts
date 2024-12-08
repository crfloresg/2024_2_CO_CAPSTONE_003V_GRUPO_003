import { Component, inject } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UiService } from '../../services/ui.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CuProductosComponent } from './cu-productos/cu-productos.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ColumnItem } from '../../interfaces/column-item';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzModalModule,
    NzDividerModule,
    NzInputModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);
  productosService = inject(ProductosService);

  productos: Producto[] = [];
  displayedProductos: Producto[] = [];

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  listOfColumns: ColumnItem<Producto>[] = [{
    name: 'Id producto',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => a.productoId - b.productoId,
    listOfFilter: [],
    filterFn: null,
    width: '60px'
  },
  {
    name: 'Nombre',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => a.nombre.localeCompare(b.nombre),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Código',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => (a?.codigo || '').localeCompare(b.codigo || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Categoría',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => (a?.categoria || '').localeCompare(b.categoria || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Unidad de medida',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => (a?.unidadMedida || '').localeCompare(b.unidadMedida || ''),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Precio Venta',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => (a.precioVenta || 0) - (b.precioVenta || 0),
    listOfFilter: [],
    filterFn: null,
    width: '100px'
  },
  {
    name: 'Estado',
    sortOrder: null,
    sortFn: (a: Producto, b: Producto) => a.estadoDesc!.localeCompare(b.estadoDesc!),
    listOfFilter: [
      { text: 'Habilitado', value: 1},
      { text: 'Deshabilitado', value: 0},
    ],
    filterFn: (selectedValues: number[], item: Producto) =>
      selectedValues.includes(item.estado),
    width: '90px'
  }];

  async ngOnInit() {
    await this.getAll();
  }

  async getAll(){
    this.loadingTableData = true;
    try {
      this.productos = await this.productosService.getAll();
      this.productos.forEach(x => {x.estadoDesc = x.estado == 1 ? 'Habilitado' : 'Deshabilitado'});
      this.displayedProductos = JSON.parse(JSON.stringify(this.productos));
      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  update(id: number){
    const modalRef = this.modalService.create({
      nzTitle: 'Modificar producto',
      nzContent: CuProductosComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: id },
      nzStyle: { width: 'fit-content' },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal('Producto modificado exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }

  async delete(data: Producto){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>deshabilitar: ${data.nombre}</b>?`,
      { ok: 'Deshabilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.productosService.delete(data.productoId);
          this.uiService.showModal(
            'Producto deshabilitado exitosamente',
            '',
            'success'
          );
          await this.getAll();
        } catch (error) {
          this.uiService.showErrorModal('Error al deshabilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  async activate(data: Producto){
    let loading = false;
    this.uiService.showConfirmModal(
      'Alerta!',
      `Estas seguro que deseas <b>habilitar: ${data.nombre}</b>?`,
      { ok: 'Habilitar', cancel: 'Cancelar' },
      loading,
      async () => {
        loading = true;
        try {
          this.loadingTableData = true;
          await this.productosService.activate(data.productoId);
          this.uiService.showModal(
            'Producto habilitado exitosamente',
            '',
            'success'
          );
          await this.getAll();
        } catch (error) {
          this.uiService.showErrorModal('Error al habilitar', error);
          this.loadingTableData = false;
        } finally {
          loading = false;
        }
      }
    );
  }

  add(){
    const modalRef = this.modalService.create({
      nzTitle: 'Crear Producto',
      nzContent: CuProductosComponent,
      nzMask: true,
      nzMaskClosable: false,
      nzClosable: true,
      nzCentered: true,
      nzFooter: null,
      nzData: { id: 0 },
      nzStyle: { width: 'fit-content' },
    });

    modalRef.afterClose.subscribe(async (result) => {
      if (result) {
        this.uiService.showModal('Producto creado exitosamente', '', 'success');
        await this.getAll();
      }
    });
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    this.displayedProductos = this.productos.filter(
      (item) =>
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.estadoDesc?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.productoId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.codigo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.categoria?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.unidadMedida?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.precioVenta?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}
