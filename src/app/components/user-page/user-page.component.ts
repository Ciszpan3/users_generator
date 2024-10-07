import { Component, DestroyRef, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../users.service';
import { DatePipe } from '@angular/common';
import { UserWithMoreInfo } from '../user/user.model';
import { ModalComponent } from "../modal/modal.component";

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
  private usersService = inject(UsersService)
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
  }
}
