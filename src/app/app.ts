import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('SIDESP');

  private auth = inject(AuthService);

  constructor() {
    if (this.auth.token()) {
      this.auth.me().subscribe({ error: () => this.auth.clear() });
    }
  }
}
