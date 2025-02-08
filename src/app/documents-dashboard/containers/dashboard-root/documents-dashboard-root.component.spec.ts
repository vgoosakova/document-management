import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardRootComponent} from './documents-dashboard-root.component';
import {provideRouter} from '@angular/router';
import {provideStore} from '@ngxs/store';

describe('DocumentsDashboardRootComponent', () => {
  let component: DocumentsDashboardRootComponent;
  let fixture: ComponentFixture<DocumentsDashboardRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardRootComponent],
      imports: [],
      providers: [provideRouter([]), provideStore([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
