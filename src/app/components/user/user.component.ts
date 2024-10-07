import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren, computed, inject, input, signal } from '@angular/core';
import { PrevHoverValues, User } from './user.model';
import { UsersService } from '../../users.service';
import { userMap } from './userMap';
import { BtnDefaultComponent } from "../../shared/btn-default/btn-default.component";
import { BtnBgDirective } from '../../directives/btn-bg.directive';
import { Router } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

interface UserInterface {
  uuid: string
  name: string
  email: string
  age: number
  city: string
  phone: string
  hoveredValue: string | number
  isVisible: 0 | 1
  [key: string | number]: string | number;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [BtnDefaultComponent, BtnBgDirective],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  animations: [
    trigger('userAnimation' ,[
      transition('void => *', [
        animate('.3s cubic-bezier(.98,.06,.24,1.51)', keyframes([
          style({ opacity: 0, transform: 'translateX(-100px) scale(.6)', offset: 0 }),
          style({ opacity: .5, transform: 'translateX(-50px) scale(.8)', offset: 0.5 }),
          style({ opacity: 1, transform: 'translateX(0px) scale(1)', offset: 1 }),
        ]))
      ]),
      transition('* => void', [
        animate('.5s cubic-bezier(.98,.06,.24,1.51)', keyframes([
          style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
          style({ opacity: .5, transform: 'translateX(50px) scale(.8)', offset: 0.5 }),
          style({ opacity: 0, transform: 'translateX(100px) scale(.6)', offset: 1 }),
        ]))
      ])
    ])
  ]
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChildren('icon') icons!: QueryList<ElementRef>
  private usersService = inject(UsersService)
  private router = inject(Router)
  private modalService = inject(ModalService)
  user = input<User>()
  userNumber = input<number>()
  prevValues = computed(() => this.usersService.prevHoveredValues()) 
  userPrefix = signal<string | undefined>(this.prevValues()?.find(prev => prev.userId === this.user()?.uuid)?.userPrefix || '???')
  prevHover = signal<HTMLElement | undefined>(this.prevValues()?.find(prev => prev.userId === this.user()?.uuid)?.prevHover || undefined)
  @Input() visibleHidden!: () => void;

  onHover(e: FocusEvent) {
    const target = e.target as HTMLElement
    if(this.prevHover()) {
      if(this.prevHover() !== target) {
        this.prevHover()?.classList.remove('hovered')
        target.classList.remove('hovered')
      }
    }
    const targetName = target.getAttribute('name')
    this.userPrefix.set(userMap.get(targetName!))
    const user = this.usersService.allUsers()[this.userNumber()! - 1] as UserInterface
    const newUser = { ...user, hoveredValue: user[targetName!] }
    this.usersService.updateUserHoveredValue(newUser)
    target.classList.add('hovered')
    this.prevHover.set(target)

    const prevHoverValues: PrevHoverValues = {
      prevHover: this.prevHover(),
      userPrefix: this.userPrefix(),
      userId: this.user()?.uuid
    }
    this.usersService.updatePrevHover(prevHoverValues)
  }

  ngOnInit() {
    this.userPrefix.set(this.usersService.prevHoveredValues().find(prev => prev.userId === this.user()?.uuid)?.userPrefix || '???')
    this.prevHover.set(this.usersService.prevHoveredValues().find(prev => prev.userId === this.user()?.uuid)?.prevHover)
  }

  ngAfterViewInit() {
    const prevHoveredEl = this.icons.find(e => e.nativeElement.getAttribute('name') === this.prevHover()?.getAttribute('name'))
    prevHoveredEl?.nativeElement.classList.add('hovered')
    this.prevHover.set(prevHoveredEl?.nativeElement)
  }

  onDeleteUser() {
    this.usersService.updateUserVisibility(this.user()!, 0)
    setTimeout(() => {
      this.usersService.deleteUser(this.user()!);
    }, 1500)
  }

  checkMore() {
    this.visibleHidden()
    setTimeout(() => {
      this.router.navigate(['home', 'userPage', this.user()?.uuid])
      this.modalService.openModal()
    }, 1500)
  }
}
