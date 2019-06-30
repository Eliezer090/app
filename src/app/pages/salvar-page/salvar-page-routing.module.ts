import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalvarPagePage } from './salvar-page.page';

const routes: Routes = [
  {
    path: '',
    component: SalvarPagePage
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalvarPagePageModule { }
