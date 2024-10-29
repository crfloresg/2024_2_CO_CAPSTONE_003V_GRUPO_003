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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NzTypographyModule,
    NzButtonModule,
    NzListModule,
    NzSelectModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  

  authService = inject(AuthService);
  informesService = inject(InformesService);
  uiService = inject(UiService);

  isLoadingPdf = false;

  informeSelected = undefined;

  ngOnInit() {
    //this.graphqlService.get();
    //console.log(this.graphqlService.roles);
  }

  checkPermiso(){

  }

  async getInforme() {
    console.log(this.informeSelected);
    this.isLoadingPdf = true; // Show loading indicator
    try {
        if (this.informeSelected !== undefined) {
            let req;

            // Fetch the corresponding report based on informeSelected value
            if (this.informeSelected === 0) {
                req = await this.informesService.empleadosByBodega(1);
            } else if (this.informeSelected === 1) {
                req = await this.informesService.productosByBodega(1);
            } else if (this.informeSelected === 2) {
                req = await this.informesService.bodegas();
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


  logOut(){
    this.authService.logOut();
  }

}
