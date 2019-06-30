import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class IonicAppService {

  constructor(public db: AngularFireDatabase) {
    console.log("Firebase Provider");
  }

  save(course: any) {
    this.db.list('couses')
           .push(course)
           .then(r => console.log(r));
  }

}
