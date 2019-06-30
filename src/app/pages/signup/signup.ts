import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { FunctionsService } from '../../providers/functions.service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { username: '', password: '', password2: '' };
  submitted = false;
  retorno;
  constructor(
    public router: Router,
    public userData: UserData,
    public funcSer: FunctionsService
  ) { }

  async onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.retorno = await this.userData.signup(this.signup.username, this.signup.password, this.signup.password2);
      debugger;
      if (this.retorno === 'ok') {
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    }
  }  

  voltarLogin() {
    this.router.navigateByUrl('/login');
  }
}
