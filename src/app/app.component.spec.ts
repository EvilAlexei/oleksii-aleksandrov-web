import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
    }).overrideComponent(AppComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('Search functionality', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it ('should have input', () => {
      const input = fixture.debugElement.query(By.css('input[name="users-search"]'));
      expect(input).toBeTruthy();
    })

    it ('should call searchUsers on form submit', () => {
      const form = fixture.debugElement.query(By.css('form.search'));
      const fnSearchUsers = spyOn(component, 'searchUsers');

      form.triggerEventHandler('submit', null);

      expect(fnSearchUsers).toHaveBeenCalled();
    })

    it('should show error message on error', () => {
      let errorMsg = fixture.debugElement.query(By.css('.mat-error'));

      expect(component.error).toBeFalse()
      expect(errorMsg).toBeNull();

      component.error = true;
      fixture.detectChanges();

      errorMsg = fixture.debugElement.query(By.css('.mat-error'));

      expect(errorMsg).toBeTruthy();
    })
  })
});
