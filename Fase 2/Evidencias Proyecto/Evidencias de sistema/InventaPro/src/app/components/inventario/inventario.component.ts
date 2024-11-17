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
import { Router, RouterLink } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';

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
    RouterLink,
    NzInputModule
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
  router = inject(Router);

  inventario: Inventario[] = [];
  displayedInventario: Inventario[] = []; 
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
      this.displayedInventario = JSON.parse(JSON.stringify(this.inventario));
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

  add(){
    this.router.navigate(['/solicitud/create', 0, this.selectedBodegaId]);
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.displayedInventario = this.inventario.filter(
      (item) =>
        item.cantidad?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.productoId?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.codigo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.unidadMedida?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.precioVenta?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) ||
        item.categoria?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue)
    );
  }

}
