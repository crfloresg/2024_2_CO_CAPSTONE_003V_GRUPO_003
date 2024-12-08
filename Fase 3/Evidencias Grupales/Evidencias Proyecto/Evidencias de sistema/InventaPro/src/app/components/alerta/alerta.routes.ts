import { Routes } from "@angular/router";
import { CAlerta } from "./c-alerta/c-alerta.component";
import { AlertaComponent } from "./alerta.component";

export const ALERTA_ROUTES: Routes = [
  { path: '', component: AlertaComponent },
  { path: 'create', component: CAlerta },
]