import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RolesComponent } from './components/roles/roles.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component:LoginComponent, canActivate: [guestGuard] },
  { path: 'productos', component:ProductosComponent, canActivate: [authGuard]},
  { path: 'usuarios', component:UsuariosComponent, canActivate: [authGuard]},
  { path: 'roles', component: RolesComponent, canActivate: [authGuard]},
  { path: 'inventario', component: InventarioComponent, canActivate: [authGuard]},
  { path: 'solicitud', component: SolicitudComponent, canActivate: [authGuard]}
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
