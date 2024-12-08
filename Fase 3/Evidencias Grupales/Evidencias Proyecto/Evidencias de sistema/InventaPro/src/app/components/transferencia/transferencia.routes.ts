import { Routes } from "@angular/router";
import { TransferenciaComponent } from './transferencia.component';
import { CTransferenciaComponent } from "./c-transferencia/c-transferencia.component";
import { RecepcionTransferenciaComponent } from "./recepcion-transferencia/recepcion-transferencia.component";

export const TRANSFERENCIA_ROUTES: Routes = [
  { path: '', component: TransferenciaComponent },
  { path: 'create', component: CTransferenciaComponent },
  { path: 'recepcion', component: RecepcionTransferenciaComponent },
]