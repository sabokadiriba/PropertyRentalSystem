import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRentRequestComponent } from './view-rent-request.component';

describe('ViewRentRequestComponent', () => {
  let component: ViewRentRequestComponent;
  let fixture: ComponentFixture<ViewRentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
