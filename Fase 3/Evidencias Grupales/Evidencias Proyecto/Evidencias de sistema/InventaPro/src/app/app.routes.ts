import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RolesComponent } from './components/roles/roles.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { AlertaComponent } from './components/alerta/alerta.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { CompraComponent } from './components/compra/compra.component';
import { BodegaComponent } from './components/bodega/bodega.component';
import { DistribuidorComponent } from './components/distribuidor/distribuidor.component';
import { InicioComponent } from './components/inicio/inicio.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component:LoginComponent, canActivate: [guestGuard] },
  { path: 'productos', component:ProductosComponent, canActivate: [authGuard]},
  { path: 'usuarios', component:UsuariosComponent, canActivate: [authGuard]},
  { path: 'roles', component: RolesComponent, canActivate: [authGuard]},
  { path: 'inventario', component: InventarioComponent, canActivate: [authGuard]},
  { path: 'solicitud', loadChildren: () => import('./components/solicitud/solicitud.routes').then(m => m.SOLICITUD_ROUTES), canActivateChild: [authGuard] },
  { path: 'transferencia', loadChildren: () => import('./components/transferencia/transferencia.routes').then(m => m.TRANSFERENCIA_ROUTES), canActivateChild: [authGuard] },
  { path: 'perdida', loadChildren: () => import('./components/perdida/perdida.routes').then(m => m.PERDIDA_ROUTES), canActivateChild: [authGuard] },
  { path: 'alerta', component: AlertaComponent, canActivate: [authGuard]},
  { path: 'bodega', component: BodegaComponent, canActivate: [authGuard]},
  { path: 'distribuidor', component: DistribuidorComponent, canActivate: [authGuard]},
  { path: 'inicio', component: InicioComponent, canActivate: [authGuard]},
  { path: 'compras', loadChildren: () => import('./components/compra/compras.routes').then(m => m.COMPRAS_ROUTES), canActivateChild: [authGuard] },
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
