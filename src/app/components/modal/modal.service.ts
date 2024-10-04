import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpen = signal<boolean>(false);
  isModalOpen = this.isOpen.asReadonly()

  openModal() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
  }
}
