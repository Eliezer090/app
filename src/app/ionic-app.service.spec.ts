import { TestBed } from '@angular/core/testing';

import { IonicAppService } from './ionic-app.service';

describe('IonicAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicAppService = TestBed.get(IonicAppService);
    expect(service).toBeTruthy();
  });
});
