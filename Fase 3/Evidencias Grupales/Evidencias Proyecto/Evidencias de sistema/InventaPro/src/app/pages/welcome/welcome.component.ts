import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  authService = inject(AuthService);

  constructor() { }

  async ngOnInit() { 

    const req = await this.authService.login();
    console.log('user');
    console.log(req);
    
    const req2 = await this.authService.refreshToken();
    console.log('renewed access token');
    console.log(req2);


  }  

  async test(){
    await this.authService.test();
  }

}
