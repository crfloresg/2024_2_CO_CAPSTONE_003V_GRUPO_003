import { Routes } from "@angular/router";
import { CompraComponent } from "./compra.component";
import { CCompraComponent } from "./c-compra/c-compra.component";

export const COMPRAS_ROUTES: Routes = [
  { path: '', component: CompraComponent },
  { path: 'create', component: CCompraComponent },
]