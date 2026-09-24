import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDesktop } from './navbar-desktop.component';

describe('NavbarDesktop', () => {
  let component: NavbarDesktop;
  let fixture: ComponentFixture<NavbarDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarDesktop],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarDesktop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
