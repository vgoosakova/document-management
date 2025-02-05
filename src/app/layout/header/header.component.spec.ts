import {MatTooltipModule} from '@angular/material/tooltip';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthBlockComponent} from './../auth-block/auth-block.component';
import {SearchBlockComponent} from './../../rt-forms-mat-components/search-block/search-block.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgxsModule} from '@ngxs/store';
import {HeaderComponent} from './header.component';
import {UntypedFormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {Settings} from '../../../conf/settings';
import {InputBlockComponent} from 'src/app/rt-forms-mat-components/input-block/input-block.component';
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, {provide: Settings, useValue: '/'}, Settings],
      declarations: [HeaderComponent, SearchBlockComponent, AuthBlockComponent, InputBlockComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot(),
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule,
        MatTooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
