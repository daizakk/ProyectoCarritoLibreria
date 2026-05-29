import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cadmin } from './cadmin';

describe('Cadmin', () => {
  let component: Cadmin;
  let fixture: ComponentFixture<Cadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cadmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cadmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
