import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBorrowedBooks } from './user-borrowed-books';

describe('UserBorrowedBooks', () => {
  let component: UserBorrowedBooks;
  let fixture: ComponentFixture<UserBorrowedBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBorrowedBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBorrowedBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
