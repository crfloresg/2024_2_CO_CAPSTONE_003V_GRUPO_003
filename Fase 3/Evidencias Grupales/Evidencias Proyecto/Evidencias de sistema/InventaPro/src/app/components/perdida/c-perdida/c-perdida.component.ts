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
import { InventariosService } from '../../../services/inventarios.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TipoPerdida, PerdidaCreate } from '../../../interfaces/perdida';
import { PerdidasService } from '../../../services/perdidas.service';
import { Router, RouterLink } from '@angular/router';
import { Bodega } from '../../../interfaces/bodega';
import { BodegasService } from '../../../services/bodegas.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ColumnItem } from '../../../interfaces/column-item';

@Component({
  selector: 'app-c-perdida',
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
    NzFormModule,
    NzGridModule,
    NzSelectModule,
    NzTypographyModule,
    RouterLink,
    NzModalModule
  ],
  templateUrl: './c-perdida.component.html',
  styleUrl: './c-perdida.component.scss'
})
export class CPerdidaComponent {

  uiService = inject(UiService);
  modalService = inject(NzModalService);
  authService = inject(AuthService);
  inventariosService = inject(InventariosService);
  perdidasService = inject(PerdidasService);
  router = inject(Router);
  bodegasService = inject(BodegasService);

  productos: ProductoAux[] = [];
  displayedProductos: ProductoAux[] = [];

  solicitud: SolicitudCU = {
    solicitudId: 0,
    bodegaId: this.authService.getUser().bodegaId,
    detallesSolicitudesInventario: [],
  };

  creating = false;

  obs = undefined;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;
  loadingSolicitud = true;

  idTipoPerdida  = 0;
  loadingTipoPerdida = true;
  tiposPerdida: TipoPerdida[] = []; 

  selectedBodegaId = 2;
  bodegas: Bodega[] = [];
  loadingBodegas = true;


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
      name: 'Precio Compra',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a.precioCompra || 0) - (b.precioCompra || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad bodega',
      sortOrder: null,
      sortFn: (a: ProductoAux, b: ProductoAux) => (a.cantidadEnBodega ?? 0) - (b.cantidadEnBodega || 0),
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    },
    {
      name: 'Cantidad perdída',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      width: '100px'
    }];


  async ngOnInit() {

    this.selectedBodegaId = this.authService.getUser().bodegaId;

    await this.getBodega();
    await this.getTipoPerdida();
    await this.getAll();

  }

  async selectBodega(bodegaId: number){
    
    await this.getAll();
  } 

  statusBodega(){
    const error: NzStatus = 'error';
    const def: NzStatus = '';
    if(this.selectedBodegaId == 0 || this.selectedBodegaId == undefined){
      return error;
    }
    return def;
  }

  async getBodega(){
    this.loadingBodegas = true;
    try {
      const req = await this.bodegasService.getAll();
      this.bodegas = req;
      this.loadingBodegas = false;
    } catch (error) {
      this.loadingBodegas = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getAll() {
    this.loadingTableData = true;
    try {
      this.productos = [];
      this.displayedProductos = [];

      const req = await this.inventariosService.getByIdBodega(this.selectedBodegaId);

      req.forEach(x => {
        x.lotesInventario.forEach(y => {
          const newProducto: ProductoAux = {
            cantidadEnBodega: y.cantidad,
            cantidad: 0,
            categoria: x.categoria || '',
            checked: false,
            codigo: x.codigo!,
            loteId: y.loteId,
            nombre: x.nombre,
            precioCompra: y.precioCompra,
            productoId: y.productoId,
          };
          this.productos.push(newProducto);
        });
      });

      this.displayedProductos = JSON.parse(JSON.stringify(this.productos));

      this.loadingTableData = false;
    } catch (error) {
      this.loadingTableData = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async getTipoPerdida() {
    this.loadingTipoPerdida = true;
    try {
      this.tiposPerdida = await this.perdidasService.getTipoPerdida();
      this.loadingTipoPerdida = false;
    } catch (error) {
      this.loadingTipoPerdida = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  onItemChecked(check: boolean, loteId: number) {
    
    const producto = this.productos.find(x => x.loteId == loteId);
    const producto2 = this.displayedProductos.find(x => x.loteId == loteId);
    if(check){
      producto!.checked = true;
      producto2!.checked = true;
    }else{
      producto!.checked = false;
      producto2!.checked = false;
    }
  }

  setCantidad(event: any, loteId: number){
    let producto = this.productos.find(x => x.loteId == loteId);
    let producto2 = this.displayedProductos.find(x => x.loteId == loteId);
    if(Number(event.target.value) > 0 &&  producto && producto2){
      if(Number(event.target.value) > producto.cantidadEnBodega){
        producto.cantidad = producto.cantidadEnBodega;
        producto2.cantidad = producto2.cantidadEnBodega;
      }else{
        producto.cantidad = Number(event.target.value);
        producto2.cantidad = Number(event.target.value);
      }
    }else if(producto && producto2){
      producto.cantidad = 0;
      producto2.cantidad = 0;
    }
  }

  inputStatus(loteId: number) {

    let producto = this.productos.find(x => x.loteId == loteId)!;

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

  inputValid(loteId: number) {

    let producto = this.productos.find(x => x.loteId == loteId);

    if(producto){
      if (producto.checked == true) {
        return true;
      }
    }
    return false;
  }

  valid() {

    if(!this.obs || this.obs == '' || this.idTipoPerdida == 0){
      return false;
    }

    let once = 0;
    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      
      if(element.checked){
        if(element.cantidad == undefined){
          return false;
        }else if(element.cantidad <= 0){
          return false;
        }else{
          once += 1;
        }
      }
    }

    if(once == 0){
      return false;
    }

    return true;
  }

  async create() {
    this.creating = true;
    try {
      
      const tempPerdidaCreate: PerdidaCreate = {
        perdidas: []
      }

      this.productos.forEach(element => {
        if(element.cantidad > 0){
          const aux = {
            productoId: element.productoId,
            bodegaId: this.selectedBodegaId,
            cantidad: element.cantidad,
            tipoPerdida: this.idTipoPerdida,
            descripcion: this.obs!,
            precioCompra: element.precioCompra
          };
          tempPerdidaCreate.perdidas.push(aux);
        }
      });

      await this.perdidasService.create(tempPerdidaCreate);
      this.router.navigate(['/perdida']);
      this.uiService.showModal('Perdida registrada exitosamente', '', 'success');
      this.creating = false;
    } catch (error) {
      this.creating = false;
      this.uiService.showErrorModal('Error al crear', error);
    }
  }

  isResumenVisible = false;
  displayedResumen: PerdidaCreate | null = {
    perdidas: []
  };

  resumen(){
    this.isResumenVisible = !this.isResumenVisible;  
    if(this.isResumenVisible){
      this.displayedResumen = null;
      const tempPerdidaCreate: PerdidaCreate = {
        perdidas: []
      }

      this.productos.forEach(element => {
        if(element.cantidad > 0){
          const aux = {
            productoId: element.productoId,
            bodegaId: this.selectedBodegaId,
            cantidad: element.cantidad,
            tipoPerdida: this.idTipoPerdida,
            descripcion: this.obs!,
            precioCompra: element.precioCompra
          };
          tempPerdidaCreate.perdidas.push(aux);
        }
      });
      this.displayedResumen = JSON.parse(JSON.stringify(tempPerdidaCreate));
    }else{
      this.displayedResumen = null;
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
      .toLowerCase();

    this.displayedProductos = this.productos.filter(
      (item) =>
        item.cantidad?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.productoId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.codigo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.categoria?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }
}

interface ProductoAux {
  checked: boolean;
  cantidadEnBodega:number;
  cantidad: number;
  nombre: string;
  codigo: string;
  categoria: string;
  precioCompra: number;
  productoId: number;
  loteId: number;
}