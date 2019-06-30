import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';


@Component({
  selector: 'edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  course = {
    'title': '',
    'price': '',
    'description': ''
  };

  constructor(
    public dbService: FirebaseServiceProvider,
    public router: Router
  ) {
    this.course = router.getCurrentNavigation().extras.queryParams.course
  }

  ngOnInit() {

  }

  update(course){
    this.dbService.update(course,'courses').then(d => {
      
      this.router.navigateByUrl('/save');    
    });
  }

  remove(course){
    this.dbService.remove(course,'courses').then(d => {
      this.router.navigateByUrl('/save');    
    });
  }

}
