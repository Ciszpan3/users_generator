import { Routes } from "@angular/router";

export const usersConfig: Routes = [
    {
        path: '',
        loadComponent: () => import('./app.component').then(m => m.AppComponent)
    },
    {
        path: 'userPage/:id',
        loadComponent: () => import('./components/user-page/user-page.component').then(m => m.UserPageComponent)
    },
]