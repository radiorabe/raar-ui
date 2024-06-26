import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ViewChild,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "sd-slider",
  templateUrl: "slider.html",
  providers: [],
})
export class SliderComponent {
  @Input() value: number = 0;
  @Output() startSlidingEvent = new EventEmitter<number>();
  @Output() slidingEvent = new EventEmitter<number>();
  @Output() stopSlidingEvent = new EventEmitter<number>();

  @ViewChild("handle", { static: true }) handleElement: ElementRef;
  @ViewChild("current", { static: true }) currentElement: ElementRef;

  private lastMove: number = new Date().getTime();
  private dragTimer: number;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  startSliding(e: any) {
    // deny dragging and selecting
    document.ondragstart = () => false;

    document.onmousemove = this.handleSliding.bind(this);
    document.ontouchmove = this.handleSliding.bind(this);
    document.onmouseup = this.stopSliding.bind(this);
    document.ontouchend = this.stopSliding.bind(this);

    this.startSlidingEvent.emit(this.updateValue(e));

    return this.stopEvent(e);
  }

  onClick(e: Event) {
    this.slidingEvent.emit(this.updateValue(e));
    return this.stopEvent(e);
  }

  get percent(): number {
    return Math.max(0, Math.min(100, this.value));
  }

  private handleSliding(e: Event | Touch) {
    if (this.isTouchDevice() && e instanceof TouchEvent) {
      e = e.touches[0];
    }

    // be nice to CPU/externalInterface
    const d = new Date().getTime();
    if (d - this.lastMove > 20) {
      this.slidingEvent.emit(this.updateValue(e));
    } else {
      window.clearTimeout(this.dragTimer);
      this.dragTimer = window.setTimeout(() => {
        this.slidingEvent.emit(this.updateValue(e));
      }, 20);
    }
    this.lastMove = d;

    return this.stopEvent(e);
  }

  private stopSliding(e: Event) {
    document.onmousemove = () => {}; // eslint-disable-line
    document.ontouchmove = () => {}; // eslint-disable-line
    document.onmouseup = () => {}; // eslint-disable-line
    document.ontouchend = () => {}; // eslint-disable-line

    this.stopSlidingEvent.emit(this.updateValue(e));

    return this.stopEvent(e);
  }

  private updateValue(e: Event | Touch): number {
    this.value = this.calculatePercent(e);
    this.updateView();
    return this.value;
  }

  private calculatePercent(e: any): number {
    const parent = this.el.nativeElement;
    var percent =
      ((parseInt(e.clientX, 10) - this.getOffX(parent)) / parent.offsetWidth) *
      100;
    return Math.max(0, Math.min(100, percent));
  }

  private getOffX(element: any): number {
    // http://www.xs4all.nl/~ppk/js/findpos.html
    var curleft = 0;
    if (element.offsetParent) {
      while (element.offsetParent) {
        curleft += element.offsetLeft;
        element = element.offsetParent as HTMLElement;
      }
    } else if (element.x) {
      curleft += element.x;
    }
    return curleft;
  }

  private updateView() {
    this.renderer.setStyle(
      this.handleElement.nativeElement,
      "left",
      this.percent + "%",
    );
    this.renderer.setStyle(
      this.currentElement.nativeElement,
      "width",
      this.percent + "%",
    );
  }

  private stopEvent(e: any) {
    if (typeof e.preventDefault !== "undefined") {
      e.preventDefault();
    } else {
      e.stopPropagation = true;
      e.returnValue = false;
    }
    return false;
  }

  private isTouchDevice(): boolean {
    return /ipad|ipod|iphone/i.test(navigator.userAgent);
  }
}
