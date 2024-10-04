export type User = {
    uuid: string
    name: string
    email: string
    age: number
    city: string
    phone: string
    hoveredValue: string | number
    isVisible: 0 | 1
}

export type MoreInfo = {
    picture: string
    gender: string
    country: string
    state: string
    username: string
    date: string
}

export type UserWithMoreInfo = User & MoreInfo

export type PrevHoverValues = {
    prevHover: HTMLElement | undefined
    userPrefix: string | undefined
    userId: string | undefined
}
