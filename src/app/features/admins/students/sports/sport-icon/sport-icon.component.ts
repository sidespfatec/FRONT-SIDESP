import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sport-icon',
    standalone: true,
    template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true">
      @switch (nome) {
        @case ('natacao') {
          <circle cx="18.5" cy="6.8" r="1.8" />
          <path d="M4 12.5l5.5-3.5 4 2 3.5-2" />
          <path d="M2 16c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
          <path d="M2 20c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
        }
        @case ('volei') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3c0 4.5-2.5 7.5-7.5 9" />
          <path d="M12 3c0 4.5-2.5 7.5-7.5 9" transform="rotate(120 12 12)" />
          <path d="M12 3c0 4.5-2.5 7.5-7.5 9" transform="rotate(240 12 12)" />
        }
        @case ('futsal') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 9l2.85 2.07-1.09 3.36h-3.52l-1.09-3.36z" />
          <path d="M12 9V3M14.85 11.07l5.71-1.85M13.76 14.43l3.53 4.85M10.24 14.43l-3.53 4.85M9.15 11.07L3.44 9.22" />
        }
        @case ('judo') {
          <path d="M9 3l3 3 3-3 5 3-2 6-2-1v10H8V11l-2 1-2-6z" />
          <path d="M8 15h8" />
        }
        @default {
          <path d="M7 4h10v5a5 5 0 0 1-10 0zM12 14v4M8 21h8" />
        }
      }
    </svg>
  `,
    styles: [`
    :host { display: inline-flex; }
    svg { width: 1.6rem; height: 1.6rem; }
  `]
})
export class SportIconComponent {
    @Input() nome = '';
}