import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { AngularFireAuth } from '@angular/fire/auth'
import { FunctionsService } from '../../providers/functions.service';

import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '', password2: '' };
  submitted = false;
  //user: firebase.User;
  username: string = ""
  password: string = ""
  retorno

  constructor(
    public userData: UserData,
    public router: Router,
    public afAuth: AngularFireAuth,
    public funcSer: FunctionsService,
    public googlePlus: GooglePlus,
    public user: firebase.User
  ) { }

  loginG() {
    //Não utilizada foi usado o  método signInWithGoogle()
    this.googlePlus.login({
      'webClientId': '334623829924-usr9bj9vpg84usr8958bju36i63cglrl.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(suc => {
          debugger;
        }).catch(ns => {
          debugger;
        })
    })
  }
   

  async onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.retorno = await this.userData.login(this.login.username, this.login.password);
      if (this.retorno === 'ok') {
        this.router.navigateByUrl('/app/tabs/schedule');
      } else {
        console.log(this.retorno);
      }
    }
  }

  async resetPass(form: NgForm) {
    if (this.login.username === '') {
      return this.funcSer.alertOk('Favor informar um E-mail!', '', 'Deve ser informado um e-mail no campo acima!');
    }
    await this.userData.resetPassword(this.login.username);
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
  /*
    cadastrar() {
      this.router.navigateByUrl('/save');
    }
  */
  async signInWithGoogle() {
    //loginGoogle
    var retorno = await this.userData.signInWithGoogle();

    if (retorno.user) {
      this.user.updateProfile({ displayName: this.retorno.user.displayName, photoURL: this.retorno.user.photoURL });
    } else {
      debugger;
    }

  }
}
