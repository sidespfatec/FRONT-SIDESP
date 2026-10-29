import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDesktopAdminComponent } from './navbar-desktop-admin.component';

describe('NavbarDesktopAdminComponent', () => {
  let component: NavbarDesktopAdminComponent;
  let fixture: ComponentFixture<NavbarDesktopAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [NavbarDesktopAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarDesktopAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
