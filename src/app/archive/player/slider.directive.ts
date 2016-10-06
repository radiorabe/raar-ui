import {Directive, Input, Output, Renderer, ElementRef, EventEmitter, ContentChildren,
        QueryList, ViewContainerRef} from '@angular/core'

@Directive({
    selector: '[slider]',
    host: {
      '(mousedown)': 'startSliding($event)',
      '(touchstart)': 'startSliding($event)'
    }
})
export class SliderDirective {

  @Output('slidingStart') startSlidingEvent = new EventEmitter<number>();
  @Output('sliding') slidingEvent = new EventEmitter<number>();
  @Output('slidingStop') stopSlidingEvent = new EventEmitter<number>();

  private lastMove: number = new Date().getTime();
  private dragTimer: number;

  constructor(private el: ElementRef, private renderer: Renderer, private _view: ViewContainerRef) {
  }
  ngAfterViewInit() {

  }
  startSliding(e: any) {
    // deny dragging and selecting
    document.ondragstart = () => false;
    document.body.onselectstart = () => false;

    document.onmousemove = this.handleSliding.bind(this);
    document.ontouchmove = this.handleSliding.bind(this);
    document.onmouseup = this.stopSliding.bind(this);
    document.ontouchend = this.stopSliding.bind(this);

    this.renderer.setElementClass(this.el.nativeElement, 'sliding', true);

    this.startSlidingEvent.emit(this.calculatePercent(e));

    return this.stopEvent(e);
  }

  handleSliding(e: any) {
    if (this.isTouchDevice() && e.touches) {
      e = e.touches[0];
    }

    // be nice to CPU/externalInterface
    const d = new Date().getTime();
    if (d - this.lastMove > 20) {
      this.slidingEvent.emit(this.calculatePercent(e));
    } else {
      window.clearTimeout(this.dragTimer);
      this.dragTimer = window.setTimeout(() => {
        this.slidingEvent.emit(this.calculatePercent(e))
      }, 20);
    }
    this.lastMove = d;

    return this.stopEvent(e);
  }

  stopSliding(e: any) {
    document.onmousemove = null;
    document.ontouchmove = null;
    document.onmouseup = null;
    document.ontouchend = null;

    this.renderer.setElementClass(this.el.nativeElement, 'sliding', false);
    this.stopSlidingEvent.emit(this.calculatePercent(e));

    return this.stopEvent(e);
  };

  calculatePercent(e: any): number {
    const parent = this.el.nativeElement.parentNode;
    var percent = (parseInt(e.clientX, 10) - this.getOffX(parent)) / parent.offsetWidth * 100;
    percent = Math.max(0, Math.min(100, percent));
    this.renderer.setElementStyle(this.el.nativeElement, 'left', percent + '%');
    return percent;
  }

  getOffX(element: any): number {
    // http://www.xs4all.nl/~ppk/js/findpos.html
    var curleft = 0;
    if (element.offsetParent) {
      while (element.offsetParent) {
        curleft += element.offsetLeft;
        element = element.offsetParent;
      }
    }
    else if (element.x) {
      curleft += element.x;
    }
    return curleft;
  };

  stopEvent(e: any) {
    if (typeof e.preventDefault !== 'undefined') {
      e.preventDefault();
    } else {
      e.stopPropagation = true;
      e.returnValue = false;
    }
    return false;
  }

  isTouchDevice(): boolean {
    return !!navigator.userAgent.match(/ipad|ipod|iphone/i);
  }
}
