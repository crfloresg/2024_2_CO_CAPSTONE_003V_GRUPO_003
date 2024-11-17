import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PerdidasService } from '../../services/perdidas.service';
import { UiService } from '../../services/ui.service';
import { Perdida } from '../../interfaces/perdida';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Bodega } from '../../interfaces/bodega';
import { FormsModule } from '@angular/forms';
import { BodegasService } from '../../services/bodegas.service';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../services/auth.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-perdida',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
    NzPopoverModule,
    NzTypographyModule,
    NzFlexModule,
    DatePipe
  ],
  templateUrl: './perdida.component.html',
  styleUrl: './perdida.component.scss'
})
export class PerdidaComponent {

  perdidasService = inject(PerdidasService);
  uiService = inject(UiService);
  bodegasService = inject(BodegasService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  perdidas: Perdida[] = [];
  displayedPerdida: Perdida[] = [];

  bodegas: Bodega[] = [];
  selectedBodegaId = 0;
  loadingBodegas = true;

  pageSize = 10;
  pageIndex = 1;
  loadingTableData = true;

  async ngOnInit() {

    this.selectedBodegaId = this.authService.getUser().bodegaId;

    await this.getBodega();
    await this.getPerdidas();
  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    await this.getPerdidas();
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

  async getPerdidas(){
    this.loadingTableData = true;
    try {
      this.perdidas = await this.perdidasService.getAllByIdBodega(this.selectedBodegaId);
      this.displayedPerdida = JSON.parse(JSON.stringify(this.perdidas));
      this.loadingTableData = false;
    } catch (error: any) {
      this.loadingTableData = false;
      this.uiService.showErrorModal(error.status == 404 ? 'No se econtraron solicitudes' : 'Error al cargar datos', error);
    }
  }

  async add(){
    this.router.navigate(['create'], {relativeTo: this.activatedRoute})
  }

}
