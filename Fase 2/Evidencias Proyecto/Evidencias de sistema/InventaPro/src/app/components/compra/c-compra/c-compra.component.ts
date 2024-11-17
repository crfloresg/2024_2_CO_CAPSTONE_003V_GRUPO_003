import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Producto } from '../../../interfaces/producto';
import { ProductosService } from '../../../services/productos.service';
import { UiService } from '../../../services/ui.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CompraC, CompraDetalleC } from '../../../interfaces/compra';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { Router, RouterLink } from '@angular/router';
import { ComprasService } from '../../../services/compras.service';
import { Distribuidor } from '../../../interfaces/distribuidor';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-c-compra',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzTypographyModule,
    NzButtonModule,
    NzFlexModule,
    NzIconModule,
    NzGridModule,
    NzToolTipModule,
    NzFormModule,
    NzUploadModule,
    RouterLink,
    NzSpinModule
  ],
  templateUrl: './c-compra.component.html',
  styleUrl: './c-compra.component.scss'
})
export class CCompraComponent {

  productosService = inject(ProductosService);
  uiService = inject(UiService);
  router = inject(Router);
  comprasService = inject(ComprasService);

  productos: Producto[] = [];
  distribuidores: Distribuidor[] = [];
  displayedProductosSelect: Producto[] = [];
  displayedCompra: CompraC = {
    compraDetalles: [],
    documentoB64: '',
    observacion: '',
    distribuidorId: 0
  };


  selectedProducto: any = null;
  selectedDist: any = null;

  readonly nzFilterOption = (): boolean => true;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  loadingProductos = true;

  loadingDist = true;

  fileList: NzUploadFile[] = [];
  base64Data: string | null = null;

  creating = false;

  async ngOnInit() {
    await this.getDistribuidores();
    await this.getProductos();
  }

  async getProductos(){
    this.loadingProductos = true;
    try {
      this.productos = await this.productosService.getAll();
      if(this.displayedCompra.compraDetalles.length>0){
        const test = this.productos.filter(
          x => !this.displayedCompra.compraDetalles.some(
            y => y.productoId == x.productoId
          )
        );
        this.displayedProductosSelect = JSON.parse(JSON.stringify(test));
      }else{
        this.displayedProductosSelect = JSON.parse(JSON.stringify(this.productos));
      }
      this.loadingProductos = false;
    } catch (error) {
      this.loadingProductos = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  agregar(){
    const tempProducto = this.productos.find(x => x.productoId == this.selectedProducto);
    const tempCompraDetalle: CompraDetalleC = {
      nombre: tempProducto?.nombre,
      codigo: tempProducto?.codigo,
      cantidad: 0,
      precioCompra: 0,
      productoId: tempProducto!.productoId!,
    };
    const aux = JSON.parse(JSON.stringify(this.displayedCompra));
    aux.compraDetalles.push(tempCompraDetalle);
    this.displayedCompra = JSON.parse(JSON.stringify(aux));


    this.displayedProductosSelect.splice(this.displayedProductosSelect.findIndex(x => x.productoId == this.selectedProducto), 1);


    this.selectedProducto = null;
  }

  remove(productoId: number){
    const aux = JSON.parse(JSON.stringify(this.displayedCompra));
    const index = aux.compraDetalles.findIndex((x: any) => x.productoId == productoId);
    aux.compraDetalles.splice(index, 1);
    this.displayedCompra = JSON.parse(JSON.stringify(aux));
    this.displayedProductosSelect.unshift(this.productos.find(x => x.productoId == productoId)!);
  }

  search(value: string) {
    const filterValue = value
      .trim()
      .toLowerCase();

    this.displayedProductosSelect = this.productos.filter(
      (item) =>
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.productoId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.codigo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.categoria?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.unidadMedida?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.precioVenta?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.type !== 'application/pdf') {
      this.uiService.showModal('Error', 'Solo se admite formato pdf', 'warning');
      return false;
    }

    this.fileList = [file];
    const reader = new FileReader();

    reader.onload = () => {
      this.base64Data = reader.result as string;
      this.displayedCompra.documentoB64 = this.base64Data;  
    };
    reader.readAsDataURL(file as any);

    return false;
  };

  onRemove = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.base64Data = null;
    return true;
  };

  valid(){
    if(
      this.displayedCompra.observacion == '' || 
      this.displayedCompra.compraDetalles.length == 0 ||
      this.base64Data == null ||
      this.displayedCompra.distribuidorId == 0
    ){
      return false
    }

    for (let i = 0; i < this.displayedCompra.compraDetalles.length; i++) {
      const element = this.displayedCompra.compraDetalles[i];
      if(element.cantidad == 0 || element.precioCompra == 0){
        return false;
      }
      
    }

    return true;
  }

  cantidadStatus(productoId: number) {

    let tempProducto = this.displayedCompra.compraDetalles.find(x => x.productoId == productoId)!;

    const error: NzStatus = 'error';
    const def: NzStatus = '';
    if (
      (tempProducto.cantidad == undefined ||
        tempProducto.cantidad! <= 0)
    ) {
      return error;
    }
    return def;
  }

  precioStatus(productoId: number) {

    let tempProducto = this.displayedCompra.compraDetalles.find(x => x.productoId == productoId)!;

    const error: NzStatus = 'error';
    const def: NzStatus = '';
    if (
      (tempProducto.precioCompra == undefined ||
        tempProducto.precioCompra! <= 0)
    ) {
      return error;
    }
    return def;
  }

  async create(){
    this.creating = true;
    try {
      const req = await this.comprasService.create(this.displayedCompra);
      this.creating = false;
      this.router.navigate(['/compras'])
      this.uiService.showModal('Compra registrada exitosamente', '', 'success');
    } catch (error) {
      this.creating = false;
      this.uiService.showErrorModal('Error al registrar compra', error);
    }
  }


  async getDistribuidores(){
    this.loadingDist = true;
    try {
      this.distribuidores = await this.comprasService.getOptions();
      this.loadingDist = false;
    } catch (error) {
      this.loadingDist = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }  
  }

}