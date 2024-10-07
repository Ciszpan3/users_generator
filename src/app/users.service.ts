import { Injectable, signal } from '@angular/core';
import { MoreInfo, PrevHoverValues, User, UserWithMoreInfo } from './components/user/user.model';
import { HttpClient } from '@angular/common/http';
import { delay, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}
  isGenerating = signal<boolean>(false)
  private moreInfoUsers = signal<UserWithMoreInfo[]>([])
  private users = signal<User[]>([])
  private prevHovered = signal<PrevHoverValues[]>([])
  apiUrl = 'https://randomuser.me/api'
  allUsers = this.users.asReadonly()
  allInfo = this.moreInfoUsers.asReadonly()
  prevHoveredValues = this.prevHovered.asReadonly()

  addPrevHover(prevHoverValues: PrevHoverValues) {
    this.prevHovered.update(prevHover => [...prevHover, prevHoverValues])
  }
  updatePrevHover(prevHoverValues: PrevHoverValues) {
    if(this.prevHovered().some(prev => prev.userId === prevHoverValues.userId)) {
      this.prevHovered.update(prevHover => prevHover.map(prev => prev.userId === prevHoverValues.userId ? prevHoverValues : prev))
    } else {
      this.addPrevHover(prevHoverValues)
    }
  }

  reloadData() {
    this.moreInfoUsers.set(this.moreInfoUsers())
  }

  addUser(user: User) {
    this.users.update(users => [...users, user])
  }
  addInfo(userInfo: UserWithMoreInfo) {
    this.moreInfoUsers.update(users => [...users, userInfo])
  }
  deleteUser(user: User) {
    this.users.update(users => users.filter(u => u.uuid !== user.uuid))
    this.prevHovered.update(users => users.filter(u => u.userId !== user.uuid)) 
    this.moreInfoUsers.update(users => users.filter(u => u.uuid !== user.uuid))
  }
  updateUserHoveredValue(user: User) {
    this.moreInfoUsers.update(users => users.map(u => u.uuid === user.uuid ? { ...u, hoveredValue: user.hoveredValue } : u)) 
  }
  updateUserVisibility(user: User, visibility: 0 | 1) {
    this.moreInfoUsers.update(users => users.map(u => u.uuid === user.uuid ? { ...u, isVisible: visibility } : u)) 
  }

  generateNewUser(numberOfUsers: number) {
    this.isGenerating.set(true)
    const sub = this.httpClient.get(`${this.apiUrl}/?results=${numberOfUsers}`).pipe(map((res: any) => {
      if(res.results.length === 1) {
        return res.results[0]
      } else {
        return res.results
      }
    }), delay(2000)).subscribe((response: any) => {
      if(!Array.isArray(response)) {
        const newUser: User = {
          uuid: response.login.uuid,
          name: response.name.first + ' ' + response.name.last,
          email: response.email,
          age: response.dob.age,
          city: response.location.city,
          phone: response.phone,
          hoveredValue: '?',
          isVisible: 1
        }
        const moreInfo: MoreInfo = {
          picture: response.picture.large,
          gender: response.gender,
          country: response.location.country,
          state: response.location.state,
          username: response.login.username,
          date: response.dob.date
        }
        const allInfo = {
          ...newUser,
          ...moreInfo
        }
        this.addUser(newUser)
        this.addInfo(allInfo)
        if (sub) {
          sub.unsubscribe()
        }
      } else {
        response.forEach((user: any) => {
          const newUser: User = {
            uuid: user.login.uuid,
            name: user.name.first + ' ' + user.name.last,
            email: user.email,
            age: user.dob.age,
            city: user.location.city,
            phone: user.phone,
            hoveredValue: '?',
            isVisible: 1
          }
          const moreInfo: MoreInfo = {
            picture: user.picture.large,
            gender: user.gender,
            country: user.location.country,
            state: user.location.state,
            username: user.login.username,
            date: user.dob.date
          }
          const allInfo = {
            ...newUser,
            ...moreInfo
          }
          this.addUser(newUser)
          this.addInfo(allInfo)
        })
        if (sub) {
          sub.unsubscribe()
        }
      }
      this.isGenerating.set(false)
    })
  }
}
