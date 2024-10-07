import { Component, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { UsersService } from './users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnDefaultComponent } from './shared/btn-default/btn-default.component';
import { BtnBgDirective } from './directives/btn-bg.directive';
import { ModalComponent } from './components/modal/modal.component';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent, ReactiveFormsModule, BtnDefaultComponent, BtnBgDirective, ModalComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('appAnimation' ,[
      transition(':enter', [
        animate('2s cubic-bezier(.98,.06,.24,1.51)', keyframes([
          style({ opacity: 0, transform: 'translateX(-400px) scale(.3)', offset: 0 }),
          style({ opacity: .5, transform: 'translateX(-200px) scale(1.2)', offset: 0.5 }),
          style({ opacity: 1, transform: 'translateX(0) scale(1)', offset: 1 })
        ]))
      ]),
      transition(':leave', [
        animate('2s cubic-bezier(.98,.06,.24,1.51)', keyframes([
          style({ opacity: 1, transform: 'translateY(0) rotate(0deg)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0) rotate(180deg) scale(.9)', offset: 0.25 }),
          style({ opacity: .5, transform: 'translateY(100px) rotate(180deg) translateX(100px) scale(.7)', offset: 0.5 }),
          style({ opacity: .5, transform: 'translateY(200px) rotate(180deg) translateX(-100px) scale(.5)', offset: 0.75 }),
          style({ opacity: 0, transform: 'translateY(400px) rotate(180deg) translateX(0) scale(.3)', offset: 1 }),
        ]))
      ])
    ]),
    trigger('userListAnim', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-100px) scale(0.6)' }),
          stagger(300, [ // 100ms opóźnienia dla każdego następnego elementu
            animate('.3s cubic-bezier(.98,.06,.24,1.51)', keyframes([
              style({ opacity: 0, transform: 'translateX(-100px) scale(0.6)', offset: 0 }),
              style({ opacity: .5, transform: 'translateX(-50px) scale(0.8)', offset: 0.5 }),
              style({ opacity: 1, transform: 'translateX(0px) scale(1)', offset: 1 }),
            ]))
          ])
        ], {optional: true})
      ]),
    ])
  ]
})
export class AppComponent {
  private usersService = inject(UsersService)
  private router = inject(Router)
  @ViewChild('container') container!: ElementRef
  users = computed(() => this.usersService.allInfo())
  hoverInfo = computed(() => this.usersService.prevHoveredValues())
  genButtonValue = signal<'User' | 'Users'>('User')
  isAppVisible = signal<boolean>(true)
  isGen = computed(() => this.usersService.isGenerating())
  form = new FormGroup({
    numberOfUsers: new FormControl(1, [Validators.max(2)])
  })

  trackByUser(index: number, user: any) {
    return user.uuid;
  }

  constructor(){
    effect(() => {
      const allUsers = this.users()
      const prevValues = this.hoverInfo()
    })
  }

  visibleHidden = () => {
    console.log('app is not visible')
    this.isAppVisible.set(false)
    this.container.nativeElement.classList.remove('animationed')
  }

  ngOnInit() {
    this.form.valueChanges.subscribe({
      next: (val) => console.log(val)
    })
  }
  ngAfterViewInit() {
    const target = this.container.nativeElement
    target.addEventListener('animationend', () => {
      target.classList.add('animationed')
    })
  }

  onGenerateUser() {
    this.usersService.generateNewUser(this.form.controls.numberOfUsers.value || 1)
  }

  onInput() {
    const inputValue = this.form.controls.numberOfUsers.value || 1
    if(inputValue > 1) {
      this.genButtonValue.set('Users')
    } else {
      this.genButtonValue.set('User')
    }
    if(inputValue > 9) {
      this.form.controls.numberOfUsers.setValue(9)
    }
    if(inputValue < 1) {
      this.form.controls.numberOfUsers.setValue(1)
    }
  }
}
