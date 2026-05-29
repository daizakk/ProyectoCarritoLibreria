import { TestBed } from '@angular/core/testing';

import { ProductsFacade } from './fproduct';

describe('ProductsFacade', () => {
  let service: ProductsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
