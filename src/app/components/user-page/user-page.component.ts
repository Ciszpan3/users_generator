import { Component, DestroyRef, ElementRef, ViewChild, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users.service';
import { DatePipe } from '@angular/common';
import { UserWithMoreInfo } from '../user/user.model';
import { ModalComponent } from "../modal/modal.component";
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [DatePipe, ModalComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('userContainer') userContainer!: ElementRef;
  private activatedRoute = inject(ActivatedRoute)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private usersService = inject(UsersService)
  private modalService = inject(ModalService)
  userId = signal<string>('')
  user = signal<UserWithMoreInfo | undefined>(undefined)

  ngOnInit() {
    const sub = this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.userId.set(param.get('id')!)
      }
    })
    
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe()
    })
  }
  
  ngAfterViewInit() {
    this.user.set(this.usersService.allInfo().find(u => u.uuid === this.userId()))
    this.userContainer.nativeElement.addEventListener('animationend', () => {
      this.userContainer.nativeElement.classList.add('animated')
    })
    // this.container.nativeElement.addEventListener('click', (e: FocusEvent) => {
    //   const target = e.target as HTMLElement
    //   console.log(target)
    // })
  }
}
