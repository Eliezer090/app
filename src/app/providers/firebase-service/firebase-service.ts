import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ToastrServiceProvider } from '../toastr-service/toastr-service';
import * as firebase from 'firebase';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {
  private dbRef;
  public db;
  constructor(
    public AngularFire: AngularFireDatabase,
    private toastService: ToastrServiceProvider,
    private webview: WebView,
    public imagePicker: ImagePicker,
    public cropService: Crop
  ) {
    this.db = AngularFire;
  }
  private result;

  tabela(table: string) {
    this.dbRef = this.db.list(table);
  }
  public img;

  getAll(table: string) {
    this.tabela(table);
    return this.dbRef.snapshotChanges().map(data => {
      //this.retornarImg(function (url) {
        debugger;
        return data.map(d => ({ key: d.key, ...d.payload.val()/*, img: url*/ }));
     // });
    });
  }

  equalTo(table: string, campo: string, valor: string) {
    this.result = this.db.list(table, ref => ref.orderByChild(campo).equalTo(valor)).valueChanges();
    return this.result;
  }

  save(dados: any, table: string) {
    this.tabela(table);
    return this.dbRef.push(dados).then(() => {
      this.toastService.show('Registro salvo com sucesso!', 3000);
    }).catch((error) => {
      this.toastService.show('Falha ao salvar as infomações!', 3000);
    });
  }

  pesquisa(palavra: string, table: string) {
    return this.equalTo(table, 'description', palavra);
  }

  update(dados, table: string) {
    this.tabela(table);
    return this.dbRef.update(dados.key, dados).then(() => {
      this.toastService.show('Dados atualizados com sucesso!', 3000);
    }).catch((error) => {
      this.toastService.show('Falha na atualização das informações!', 3000);
    });
  }

  remove(dados, table: string) {
    this.tabela(table);
    return this.dbRef.remove(dados.key).then(() => {
      this.toastService.show('Registro removido com sucesso!', 3000);
    }).catch((error) => {
      this.toastService.show('Falha na remoção do registro!', 3000);
    });
  }


  /*
    Uploud de Imgem
  */

  uploudImg(qtde, pasta, nomeImg) {
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if (result == true) {
          this.imagePicker.getPictures({
            maximumImagesCount: qtde
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i], pasta, nomeImg + '_' + i);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }
  uploadImage(imageURI, pasta, nomeImg) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child(pasta).child(nomeImg);
      this.encodeImageUri(imageURI, function (image64) {
        imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            resolve(snapshot.downloadURL)
          }, err => {
            reject(err);
          })
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImageToFirebase(image, pasta, nomeImg) {
    image = this.webview.convertFileSrc(image);
    //uploads img to firebase storage
    this.uploadImage(image, pasta, nomeImg)
      .then(photoURL => {
        this.toastService.show('Imagem eviada com sucesso!', 3000);
      })
  }

  openImagePickerCrop(qtde, pasta, nomeImg) {
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if (result == true) {
          this.imagePicker.getPictures({
            maximumImagesCount: qtde
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], { quality: 75 }).then(
                  newImage => {
                    this.uploadImageToFirebase(newImage, pasta, nomeImg + '_' + i);
                  },
                  error => console.error("Error cropping image", error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }


  /*
  Retornar imagem
  */
  getImage(pasta: string,imagem: string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(pasta).child(imagem);
    console.log(imageRef.getDownloadURL());
    return  imageRef.getDownloadURL();
  }

  retornarImg(pasta:string,imagem: string) {
    let storageRef = firebase.storage().ref();
    let refEst = storageRef.child(pasta).child(imagem);
    return refEst.getDownloadURL().then(function (url) {
      return url;
    }).catch(function (error) {
      debugger;
      if(error.serverResponse_.includes('Not Found') || error.message_.includes('not exist')){
        console.log("Imagem não Encontrada!");
      }else{
        console.log(error.message_);        
      }      
    });
  }

}
