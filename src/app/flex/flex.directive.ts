import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core';

@Directive({ selector: '[appFlex]' })
export class FlexDirective implements OnInit {
  @Input('appFlex') flex: string;

  constructor(private $el: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.$el.nativeElement, '-webkit-box-flex', this.flex);
    this.renderer.setElementStyle(this.$el.nativeElement, '-moz-box-flex', this.flex);
    this.renderer.setElementStyle(this.$el.nativeElement, '-webkit-flex', this.flex);
    this.renderer.setElementStyle(this.$el.nativeElement, '-ms-flex', this.flex);
    this.renderer.setElementStyle(this.$el.nativeElement, 'flex', this.flex);
  }
}
