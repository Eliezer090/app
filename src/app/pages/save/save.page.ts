import { Component, OnInit } from '@angular/core';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Router } from '@angular/router';

import { ToastrServiceProvider } from '../../providers/toastr-service/toastr-service';

@Component({
  selector: 'save',
  templateUrl: './save.page.html',
  styleUrls: ['./save.page.scss'],
})
export class SavePage implements OnInit {

  course = {
    'title': '',
    'price': '',
    'description': ''
  };

  pesq = {
    'pesquisa': ''
  };

  public courses;
  public coursesFilter;
  public caminhoImg;
  public url;

  constructor(
    public dbService: FirebaseServiceProvider,
    public router: Router,
    public toastService: ToastrServiceProvider
  ) {
    this.courses = this.dbService.getAll('courses');
    this.url = this.dbService.retornarImg('image','imagem_0');
    debugger;
    //this.caminhoImg = this.dbService.retornarImg();
    //this.coursesFilter = this.dbService.equalTo('courses','description','teste');   

  }
 
  uparImg(){ 
    this.dbService.uploudImg(1,'image','imagem');
  }
  uparImgCortada(){ 
    this.dbService.openImagePickerCrop(1,'imageCortada','imagem');
  } 
  

  ngOnInit() {
  }

  save(course) {
    this.dbService.save(course, 'courses');
    this.course.title = '';
    this.course.price = '';
    this.course.description = '';
  }



  pesquisa(textoPesq) {
    this.coursesFilter = this.dbService.pesquisa(textoPesq.pesquisa, 'courses');
  }

  gotoSingle(dados) {
    this.router.navigateByUrl('/edit', {
      queryParams: { 'course': dados }
    });
  }


}
