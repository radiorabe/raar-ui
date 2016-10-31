import {Component, Input, Output, Renderer, ElementRef, EventEmitter, ContentChildren,
        ViewChild, QueryList, ViewContainerRef} from '@angular/core'
import {ISubscription} from 'rxjs/Subscription';


@Component({
  moduleId: module.id,
  selector: 'sd-slider',
  templateUrl: 'slider.html',
  providers: [],
})
export class SliderComponent {

  @Input() value: number = 0;
  @Output('slidingStart') startSlidingEvent = new EventEmitter<number>();
  @Output('sliding') slidingEvent = new EventEmitter<number>();
  @Output('slidingStop') stopSlidingEvent = new EventEmitter<number>();

  @ViewChild('handle') handleElement: ElementRef;
  @ViewChild('current') currentElement: ElementRef;

  private lastMove: number = new Date().getTime();
  private dragTimer: number;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  startSliding(e: any) {
    // deny dragging and selecting
    document.ondragstart = () => false;
    document.body.onselectstart = () => false;

    document.onmousemove = this.handleSliding.bind(this);
    document.ontouchmove = this.handleSliding.bind(this);
    document.onmouseup = this.stopSliding.bind(this);
    document.ontouchend = this.stopSliding.bind(this);

    this.startSlidingEvent.emit(this.updateValue(e));

    return this.stopEvent(e);
  }

  onClick(e: any) {
    this.slidingEvent.emit(this.updateValue(e))
    return this.stopEvent(e);
  }

  private handleSliding(e: any) {
    if (this.isTouchDevice() && e.touches) {
      e = e.touches[0];
    }

    // be nice to CPU/externalInterface
    const d = new Date().getTime();
    if (d - this.lastMove > 20) {
      this.slidingEvent.emit(this.updateValue(e));
    } else {
      window.clearTimeout(this.dragTimer);
      this.dragTimer = window.setTimeout(() => {
        this.slidingEvent.emit(this.updateValue(e))
      }, 20);
    }
    this.lastMove = d;

    return this.stopEvent(e);
  }

  private stopSliding(e: any) {
    document.onmousemove = null;
    document.ontouchmove = null;
    document.onmouseup = null;
    document.ontouchend = null;

    this.stopSlidingEvent.emit(this.updateValue(e));

    return this.stopEvent(e);
  }

  private updateValue(e: any): number {
    this.value = this.calculatePercent(e);
    this.updateView();
    return this.value;
  }

  private calculatePercent(e: any): number {
    const parent = this.el.nativeElement;
    var percent = (parseInt(e.clientX, 10) - this.getOffX(parent)) / parent.offsetWidth * 100;
    return Math.max(0, Math.min(100, percent));
  }

  private getOffX(element: any): number {
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
  }

  private updateView() {
    this.renderer.setElementStyle(this.handleElement.nativeElement, 'left', this.value + '%');
    this.renderer.setElementStyle(this.currentElement.nativeElement, 'width', this.value + '%');
  }

  private stopEvent(e: any) {
    if (typeof e.preventDefault !== 'undefined') {
      e.preventDefault();
    } else {
      e.stopPropagation = true;
      e.returnValue = false;
    }
    return false;
  }

  private isTouchDevice(): boolean {
    return !!navigator.userAgent.match(/ipad|ipod|iphone/i);
  }
}
