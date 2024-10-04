import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from './modal.service';
import { Location } from '@angular/common'


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        animate('1.5s cubic-bezier(.98,.06,.24,1.51)', keyframes([
          style({ opacity: 0, transform: 'translate(-50%, -400px) rotate(180deg) scale(.2)', offset: 0 }),
          style({ opacity: .5, transform: 'translate(-50%, -200px) rotate(180deg) scale(.4)', offset: 0.5 }),
          style({ opacity: 1, transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', offset: 1 })
        ]))
      ]),
      transition(':leave', [
        animate('3s cubic-bezier(.98,.06,.24,1.51)', keyframes([
          style({ opacity: 1, transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', offset: 0 }),
          style({ opacity: 1, transform: 'translate(-50%, -50%) rotate(-180deg) scale(1.2)', offset: 0.3 }),
          style({ opacity: .7, transform: 'translate(-50%, 100px) rotate(-180deg) scale(1)', offset: 0.5 }),
          style({ opacity: .5, transform: 'translate(-50%, 200px) rotate(-180deg) scale(.8)', offset: 0.75 }),
          style({ opacity: 0, transform: 'translate(-50%, 400px) rotate(-180deg) scale(.5)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class ModalComponent {
  @ViewChild('app_modal') modal!: ElementRef
  private modalService = inject(ModalService)
  constructor(private location: Location){}
  isOpen = computed(() => this.modalService.isModalOpen())

  ngAfterViewInit() {
    this.modal.nativeElement.addEventListener('click', (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if(target.className.includes('modal_container')) {
        console.log('closing modal')
        this.modalService.closeModal()
        setTimeout(() => this.location.back(), 2000)
      }
    })
  }
}
