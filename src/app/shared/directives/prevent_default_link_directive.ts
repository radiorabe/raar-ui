import {HostListener, Directive, Input} from '@angular/core';

@Directive({
    selector: '[href]'
})
export class PreventDefaultLinkDirective {

    @Input() href: string;
    @HostListener('click', ['$event']) onClick(event: Event) { this.preventDefault(event); }

    private preventDefault(event: Event) {
        if (this.href.length === 0 || this.href === '#') {
            event.preventDefault();
        }
    }
}
