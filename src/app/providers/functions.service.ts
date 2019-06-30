import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class FunctionsService {

  constructor(
    public alertCtrl: AlertController
  ) { }

  async alertOk(titulo: string, subTitulo: string, mensagem: string) {
    let alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

}
