import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
//import { GraphqlService } from '../../services/graphql.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { InformesService } from '../../services/informes.service';
import { UiService } from '../../services/ui.service';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../../services/alerta.service';
import { Alerta } from '../../interfaces/alerta';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Bodega } from '../../interfaces/bodega';
import { BodegasService } from '../../services/bodegas.service';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../interfaces/dashboard';
import { Transferencia } from '../../interfaces/transferencia';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { interval, Subscription } from 'rxjs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { getISOWeek } from 'date-fns';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NzTypographyModule,
    NzButtonModule,
    NzListModule,
    NzSelectModule,
    FormsModule,
    NzTableModule,
    NzInputNumberModule,
    NzFlexModule,
    NgxChartsModule,
    NzSpinModule,
    NzGridModule,
    NzDatePickerModule,
    NzCollapseModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  authService = inject(AuthService);
  informesService = inject(InformesService);
  uiService = inject(UiService);
  alertaService = inject(AlertaService);
  bodegasService = inject(BodegasService);
  dashboardService = inject(DashboardService);

  bodegas: Bodega[] = [];
  selectedBodegaId = 0;
  loadingBodegas = true;

  isLoadingPdf = false;
  loadingTableData = true;

  alerta: Alerta[] = [];
  displayedAlerta: Alerta[] = [];
  pageSize = 10;
  pageIndex = 1;

  informeSelected = undefined;
  informeBodegaId = 0;
  informeUsuarioId = 0;
  informeTipoPerdida = 0;

  date: Date[] | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;

  async ngOnInit() {
    this.selectedBodegaId = this.authService.getUser().bodegaId;
    this.informeBodegaId =  this.authService.getUser().bodegaId;
    this.dashboardBodegaId =  this.authService.getUser().bodegaId;

    const now = new Date();
    this.endDate = now;
    this.startDate = new Date(now);
    this.startDate.setDate(now.getDate() - 30); 

    this.date = [this.startDate, this.endDate];
    await Promise.all([
      this.getBodega(),
      this.startAlertRefresh(),
      this.startDashboardRefresh()
    ]);
    //this.graphqlService.get();
    //console.log(this.graphqlService.roles);
  }

  checkPermiso(){

  }

  async selectBodega(id: number){
    this.selectedBodegaId = id;
    this.AlertSubscription!.unsubscribe();
    this.startAlertRefresh();
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
  onChange(result: Date[]): void {
    if (result && result.length === 2) {
      this.startDate = result[0];
      this.endDate = result[1];
    }
  }

  async getInforme() {
    console.log(this.informeSelected);
    this.isLoadingPdf = true; // Show loading indicator
    
    try {
        if (this.informeSelected !== undefined) {
            let req;
            
            if (this.startDate && this.endDate) {
              // Llamar a auditoria solo si ambas fechas son válidas
              req = await this.informesService.auditoria(this.informeUsuarioId, this.startDate, this.endDate);
            } else {
              console.error("Las fechas de inicio o fin no son válidas.");
              return;
            }

            // Fetch the corresponding report based on informeSelected value
            if (this.informeSelected === 0) {
                req = await this.informesService.empleadosByBodega(this.informeBodegaId);
            } else if (this.informeSelected === 1) {
                req = await this.informesService.productosByBodega(this.informeBodegaId);
            } else if (this.informeSelected === 2) {
                req = await this.informesService.bodegas();
            } else if (this.informeSelected === 3) {
              req = await this.informesService.auditoria(this.informeUsuarioId, this.startDate, this.endDate);
            }
            

            // Check if req is defined and has the expected properties
            if (req && req.base64 && req.fileName) {
                const base64Data = req.base64;
                const fileName = req.fileName;

                // Create a download URL from the Base64 string
                const url = `data:application/pdf;base64,${base64Data}`;

                // Create a temporary anchor element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName; // Set the filename for download
                document.body.appendChild(a);
                a.click(); // Trigger the download
                document.body.removeChild(a); // Clean up

                // Optionally revoke the object URL (not necessary for data URLs)
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Invalid response from server');
            }
        }
    } catch (error) {
        console.error('Error fetching report:', error);
        this.uiService.showErrorModal('Error al cargar datos', error);
    } finally {
        this.isLoadingPdf = false; // Hide loading indicator
    }
  }

  async getAllAlertas(){
    if(this.authService.hasPermission('r_alarmas_global') || this.authService.hasPermission('r_alarmas_bodega')){
      this.loadingTableData = true;
      try {
        this.alerta = await this.alertaService.getAllAlertas(this.selectedBodegaId);
        this.displayedAlerta = JSON.parse(JSON.stringify(this.alerta));
        this.loadingTableData = false;
      } catch (error) {
        this.loadingTableData = false;
        this.uiService.showErrorModal('Error al cargar datos', error);
      }
    }
    
  }

  validInforme(){
    if(this.informeSelected == undefined){ return false }
    if(this.informeSelected == 0 || this.informeSelected == 1){
      if(this.informeBodegaId == 0) { return false }
    }
    if(this.informeSelected == 3){
      if(this.informeUsuarioId == 0){ return false }
    }
    return true;
  }

  logOut(){
    this.authService.logOut();
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }





  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Productos';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad';
  
  perdidas: Dashboard[] = [];
  solicitudes: Dashboard[] = [];
  Transferencia: Dashboard[] = [];

  loadingDashboard = false;
  private dashboardSubscription: Subscription | null = null;
  private AlertSubscription: Subscription | null = null;
  private firstLoad = true;
  dashboardBodegaId = 0;

  ngOnDestroy() {
    // Clean up the subscription to stop the interval when leaving the component
    if (this.dashboardSubscription) {
      this.dashboardSubscription.unsubscribe();
    }
    if (this.AlertSubscription) {
      this.AlertSubscription.unsubscribe();
    }
  }

  selectBodegaDashboard(id: number){
    this.dashboardBodegaId = id;
    this.dashboardSubscription!.unsubscribe();
    this.startDashboardRefresh();
  }

  async getDashboard() {
    if (!this.startDate || !this.endDate) {
      console.error('Las fechas de inicio o fin no son válidas.');
      return;
    }
    try {
      this.loadingDashboard = true;
      
      this.perdidas = await this.dashboardService.getPerdidas(this.dashboardBodegaId,this.startDate,this.endDate);
      this.solicitudes = await this.dashboardService.getSolicitados(this.dashboardBodegaId,this.startDate,this.endDate);
      this.Transferencia = await this.dashboardService.getTransferidos(this.dashboardBodegaId,this.startDate,
        this.endDate
      );
    } catch (error) {
      this.uiService.showErrorModal('Error al cargar datos', error);
    } finally {
      this.loadingDashboard = false;
      this.firstLoad = false;
    }
  }

  startDashboardRefresh() {
    if(this.authService.hasPermission('r_dashboard_global') || this.authService.hasPermission('r_dashboard_bodega')){
      this.getDashboard();

      // Set up the interval to refresh every 5 minutes (300000ms)
      this.dashboardSubscription = interval(300000).subscribe(() => {
        this.getDashboard();
      });
    }
  }
  startAlertRefresh() {
    if(this.authService.hasPermission('r_alarmas_global') || this.authService.hasPermission('r_alarmas_bodega')){
      this.getAllAlertas();

      // Set up the interval to refresh every 5 minutes (300000ms)
      this.AlertSubscription = interval(60000).subscribe(() => {
        this.getAllAlertas();
      });
    }
  }
}