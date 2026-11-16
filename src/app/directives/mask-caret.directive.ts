import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
    selector: '[maskCaret]',
    standalone: true
})
export class MaskCaretDirective {
    private host = inject<ElementRef<HTMLElement>>(ElementRef);

    @HostListener('click')
    moveToFirstSlot(): void {
        const input = this.host.nativeElement.querySelector('input');
        if (!input) return;

        setTimeout(() => {
            const position = input.value.indexOf('_');
            if (position >= 0) {
                input.setSelectionRange(position, position);
            }
        });
    }
}