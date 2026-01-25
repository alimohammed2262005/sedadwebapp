import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkisadmin } from './checkisadmin';

describe('Checkisadmin', () => {
  let component: Checkisadmin;
  let fixture: ComponentFixture<Checkisadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkisadmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkisadmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
