import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth'
import { FunctionsService } from './functions.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase';
import { FirebaseAuth } from 'angularfire2';



@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';  
  retorno;
  valid = false;
  constructor(
    public events: Events,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    public funcSer: FunctionsService,
    public afstore: AngularFirestore,
    public google: GooglePlus
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  signInWithGoogle() {
    return this.google.login({
      'webClientId': '334623829924-usr9bj9vpg84usr8958bju36i63cglrl.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      return firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(suc => {
          return suc;          
          //this.user.updateProfile({ displayName: suc.user.displayName, photoURL: suc.user.photoURL });
        }).catch(ns => {
          return ns;          
        })
    }).catch(np => {
      return np;
    })    
  }

  signOut(): Promise<any> {
    if (this.afAuth.auth.currentUser.providerData.length) {
      for (var i = 0; i < this.afAuth.auth.currentUser.providerData.length; i++) {
        var provider = this.afAuth.auth.currentUser.providerData[i];

        if (provider.providerId == firebase.auth.GoogleAuthProvider.PROVIDER_ID) { // Se for o gooogle
          // o disconnect limpa o oAuth token e tambem esquece qual conta foi selecionada para o login
          return this.google.disconnect()
            .then(() => {
              return this.signOutFirebase();
            });
        } /*else if (provider.providerId == firebase.auth.FacebookAuthProvider.PROVIDER_ID) { // Se for facebook
          return this.facebook.logout()
            .then(() => {
              return this.signOutFirebase();
            })
        } else if (provider.providerId == firebase.auth.TwitterAuthProvider.PROVIDER_ID) { // Se for twitter
          return this.twitter.logout()
            .then(() => {
              return this.signOutFirebase();
            })
        }*/
      }
    }

    return this.signOutFirebase();
  }


  private signOutFirebase() {
    return this.afAuth.auth.signOut();
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(username, password);
      if (res.user) {
        return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
          this.setUsername(username);
          this.events.publish('user:login');
          return "ok";
        });
      }
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        this.funcSer.alertOk('E-mail inválido!', '', 'E-mail inválido, favor inserrir um e-mail válido.');
      } else if (err.code === "auth/user-not-found") {
        this.funcSer.alertOk('E-mail não localizado!', '', 'Desculpe mas esse e-mail não foi localizado.');
      } else if (err.code === 'auth/wrong-password') {
        this.funcSer.alertOk('Senha incorreta', '', 'Senha incorreta, favor revise a mesma.');
      } else {
        console.dir(err);
      }
    }
  }

  async signup(username: string, password: string, password2: string): Promise<any> {
    if (password !== password2) {
      return this.funcSer.alertOk('Passwords não conferem!', '', 'Passwords não conferem, favor revise os mesmos.');
    }
    var code, msg, passou = true;
    await this.afAuth.auth.createUserWithEmailAndPassword(username, password).catch(function (error) {
      code = error.code;
      msg = error.message;
      passou = false;
    });

    if (code === 'auth/invalid-email') {
      return this.funcSer.alertOk('E-mail inválido!', '', 'E-mail inválido, favor inserrir um e-mail válido.');
    } else if (code === 'auth/weak-password') {
      return this.funcSer.alertOk('Senha muito curta!', '', 'Senha deve conter 6 caracteres ou mais!');
    } else if (code === 'auth/email-already-in-use') {
      return this.funcSer.alertOk('E-mail já em uso!', '', 'O e-mail informado já está cadastrado!');
    } else if (passou && code === undefined) {
      return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
        this.setUsername(username);
        this.events.publish('user:signup');
        return 'ok';
      });
    } else {
      console.log('user-data_Code:' + code + '_Msg:' + msg);
    }
  }

  async resetPassword(email: string) {
    var passou, code;
    var res = await this.afAuth.auth.sendPasswordResetEmail(email).then(function () {
      // Password reset email sent.
      passou = true;
    }).catch(function (error) {
      //Falha ao enviar
      code = error.code;
      passou = false;
      console.log('Erro ao enviar e-mail: ' + error.code + error.message);
    });;

    if (passou) {
      return this.funcSer.alertOk('E-mail enviado!', '', 'Foi enviado um e-mail para redefinição de senha, favor verifique sua caixa de e-mail.');
    } else if (code === 'auth/invalid-email') {
      return this.funcSer.alertOk('E-mail inválido!', '', 'E-mail inválido, favor inserrir um e-mail válido.');
    } else {
      return this.funcSer.alertOk('Falha ao enviar E-mail!', '', 'Desculpe mas houve uma falha ao enviar o e-mail de recoperação de senha, tente novamente mais tarde. ');
    }
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
