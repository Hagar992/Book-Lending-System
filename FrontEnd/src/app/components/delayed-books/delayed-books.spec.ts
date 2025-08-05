import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayedBooks } from './delayed-books';

describe('DelayedBooks', () => {
  let component: DelayedBooks;
  let fixture: ComponentFixture<DelayedBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayedBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayedBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
