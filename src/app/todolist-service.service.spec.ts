import { TestBed } from '@angular/core/testing';

import { TodolistServiceService } from './todolist-service.service';

describe('TodolistServiceService', () => {
  let service: TodolistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
