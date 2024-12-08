import { Component, inject } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    NzTypographyModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  authService = inject(AuthService);
}
