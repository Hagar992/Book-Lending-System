import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookManagement } from './admin-book-management';

describe('AdminBookManagement', () => {
  let component: AdminBookManagement;
  let fixture: ComponentFixture<AdminBookManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBookManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
