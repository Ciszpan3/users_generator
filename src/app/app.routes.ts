import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: MainComponent,
        loadChildren: () => import('./users.routes').then(m => m.usersConfig)
    }
];
