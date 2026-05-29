import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cheader } from './cheader';

describe('Cheader', () => {
  let component: Cheader;
  let fixture: ComponentFixture<Cheader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cheader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cheader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
