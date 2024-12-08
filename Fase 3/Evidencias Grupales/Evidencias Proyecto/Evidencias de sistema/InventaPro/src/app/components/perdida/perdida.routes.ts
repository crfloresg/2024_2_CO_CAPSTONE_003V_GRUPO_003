import { Routes } from "@angular/router";
import { CPerdidaComponent } from "./c-perdida/c-perdida.component";
import { PerdidaComponent } from "./perdida.component";

export const PERDIDA_ROUTES: Routes = [
  { path: '', component: PerdidaComponent },
  { path: 'create', component: CPerdidaComponent },
]