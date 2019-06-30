import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'salvar-page',
  templateUrl: './salvar-page.page.html',
  styleUrls: ['./salvar-page.page.scss'],
})
export class SalvarPagePage implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

}
