import { Directive, ElementRef, Input, Renderer2, input } from '@angular/core';

@Directive({
  selector: '[appBtnBg]',
  standalone: true
})
export class BtnBgDirective {
  @Input('appBtnBg') btnBg!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const buttonElement = this.el.nativeElement.querySelector('button');
    if (buttonElement) {
      this.setBgColor(buttonElement, this.btnBg);
    }
  }

  private setBgColor(element: HTMLElement, color: string) {
    this.renderer.setStyle(element, 'backgroundColor', color);
  }
}
