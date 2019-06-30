import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SalvarPagePage } from './salvar-page.page';
import { SalvarPagePageModule } from './salvar-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalvarPagePageModule
  ],
  declarations: [SalvarPagePage]
})
export class SalvarPageModule {}
