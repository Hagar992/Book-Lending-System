import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBorrowedBooks } from './admin-borrowed-books';

describe('AdminBorrowedBooks', () => {
  let component: AdminBorrowedBooks;
  let fixture: ComponentFixture<AdminBorrowedBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBorrowedBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBorrowedBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
