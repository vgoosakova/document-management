import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {Store} from '@ngxs/store';
import {provideRouter} from '@angular/router';
import {of} from 'rxjs';
import {Logout} from '../../auth/state/auth.actions';
import {AuthState} from '../../auth/state/auth.state';

const storeMock = {
  dispatch: jasmine.createSpy('dispatch'),
  select: jasmine.createSpy('select').and.callFake((selector) => {
    if (selector === AuthState.user) {
      return of({fullName: 'Test User'});
    }
    return of(null);
  })
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{provide: Store, useValue: storeMock}, provideRouter([])]
    }).compileComponents();

    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name when user is logged in', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const userElement = fixture.nativeElement.querySelector('.header__username');
    expect(userElement.textContent).toContain('Test User');
  });

  it('should dispatch Logout action when logout button is clicked', () => {
    const logoutButton = fixture.nativeElement.querySelector('.logout-button');
    logoutButton.click();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new Logout());
  });
});

