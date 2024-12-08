import { Routes } from "@angular/router";
import { CuSolicitudComponent } from "./cu-solicitud/cu-solicitud.component";
import { SolicitudComponent } from "./solicitud.component";

export const SOLICITUD_ROUTES: Routes = [
  { path: '', component: SolicitudComponent },
  { path: 'create/:solicitudId/:bodegaId', component: CuSolicitudComponent },
]