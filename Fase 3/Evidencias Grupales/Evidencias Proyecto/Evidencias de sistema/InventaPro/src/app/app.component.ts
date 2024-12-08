import { NzModalModule } from 'ng-zorro-antd/modal';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { LoginComponent } from './components/login/login.component';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ResultComponent } from './components/result/result.component';
import { UiService } from './services/ui.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    LoginComponent,
    NzSpinModule,
    NzFlexModule,
    NzButtonModule,
    NzGridModule, 
    NzTypographyModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UiService]
})
export class AppComponent {
  
  authService = inject(AuthService);

  isCollapsed = false;
  isLoading = true;

  isLoggedIn = false;
  loggedInSub!: Subscription;


  constructor(){
    this.loggedInSub = this.authService.loggedIn$.subscribe( x => {
      if(x) { this.isLoggedIn = true }
      else { this.isLoggedIn = false }
    })
  }

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();
    this.isLoading = false;;
  }

  logOut(){
    this.authService.logOut();
  }


}
