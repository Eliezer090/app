import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvarPagePage } from './salvar-page.page';

describe('SalvarPagePage', () => {
  let component: SalvarPagePage;
  let fixture: ComponentFixture<SalvarPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvarPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvarPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
