import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usersinfo } from './usersinfo';

describe('Usersinfo', () => {
  let component: Usersinfo;
  let fixture: ComponentFixture<Usersinfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usersinfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usersinfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
