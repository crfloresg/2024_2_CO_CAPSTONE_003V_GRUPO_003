import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UiService } from '../../../services/ui.service';
import { ProductosService } from '../../../services/productos.service';
import { ProductoCU } from '../../../interfaces/producto';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-cu-productos',
  standalone: true,
  imports: [
    NzSpinModule,
    NzInputModule,
    NzCheckboxModule,
    NzTableModule,
    FormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './cu-productos.component.html',
  styleUrl: './cu-productos.component.scss'
})
export class CuProductosComponent {

  uiService = inject(UiService);
  productosService = inject(ProductosService);

  isLoadingCU = false;
  isLoadingProducto = true;

  producto: ProductoCU = {
    productoId: 0,
    nombre: '',
    codigo: undefined,
    categoria: undefined,
    unidadMedida: undefined,
    precioVenta: undefined,
    estado: 1,
  }

  readonly #modal = inject(NzModalRef);
  @Input() id?: number;
  readonly nzModalData: { id: number } = inject(NZ_MODAL_DATA);

  async ngOnInit() {
    this.id = this.nzModalData.id;

    if(this.id != 0){
      await this.getProducto();
    }else{ this.isLoadingProducto = false; }
  }

  async getProducto(){
    this.isLoadingProducto = true;
    try {
      const req = await this.productosService.getById(this.id!);
      this.producto.nombre = req.nombre;
      this.producto.codigo = req.codigo;
      this.producto.categoria = req.categoria;
      this.producto.unidadMedida = req.unidadMedida;
      this.producto.precioVenta = req.precioVenta;
      this.producto.productoId = this.id!;
      this.isLoadingProducto = false;
    } catch (error) {
      this.isLoadingProducto = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  async cu(){
    this.isLoadingCU
    try {
      const req = await this.productosService.CuPost(this.producto);
      this.#modal.destroy({ success: true });
      this.isLoadingCU = false;
    } catch (error) {
      this.isLoadingCU = false;
      this.uiService.showErrorModal('Error al cargar datos', error);
    }
  }

  close(){
    this.#modal.destroy({ success: true });
    
  }

}
