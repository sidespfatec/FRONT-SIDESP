import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDesktopAdminComponent } from './navbar-desktop-admin.component';

describe('NavbarDesktopAdminComponent', () => {
  let component: NavbarDesktopAdminComponent;
  let fixture: ComponentFixture<NavbarDesktopAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
