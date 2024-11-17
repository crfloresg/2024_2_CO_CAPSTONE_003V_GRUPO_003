import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzCheckboxModule,
    NzButtonModule,
    NzTypographyModule,
    NzFlexModule,
    NzModalModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  REMEMBER_KEY = 'Remember';

  isLoading = false;

  user = {
    email: '',
    password: ''
  };

  remember = false;

  authService = inject(AuthService);
  router = inject(Router);
  uiService = inject(UiService);

  ngOnInit() {
    this.user.email = localStorage.getItem(this.REMEMBER_KEY) || '';
    if(this.user.email.length > 0){
      this.remember = true;
    }

  }

  async login(){
    
    try {
      this.isLoading = true;
      const req = await this.authService.login(this.user.email, this.user.password);
      if(this.remember){
        localStorage.setItem(this.REMEMBER_KEY, this.user.email)
      }
      this.router.navigate(['inicio'], {replaceUrl: true});
      this.isLoading = false;
    } catch (error: any) {
      this.isLoading = false;
      this.uiService.showErrorModal('Error al iniciar sesión', error);
    }
  }



}
