import { Routes } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { BookSearchComponent } from './components/book-search/book-search.component';
import { UserCheckoutsComponent } from './components/user-checkouts/user-checkouts.component';
import { AdminCheckoutsComponent } from './components/admin-checkouts/admin-checkouts.component';
import { authGuardGuard } from './auth-guard.guard';

export const routes: Routes = [
    {
        path:'',
        component: LibraryComponent,
        title: 'Library: Open'
    },
    {
        path:'login',
        component: LoginComponent,
        title: 'Login'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
    },
    {
        path: 'bookDetails/:id',
        component: BookDetailsComponent,
        title: 'Details'
    },
    {
        path: 'bookSearch',
        component: BookSearchComponent,
        title: 'Book Search'
    },
    {
        path: 'userCheckouts',
        component: UserCheckoutsComponent,
        title: 'Your Books'
    },
    {
        path: 'adminCheckouts',
        component: AdminCheckoutsComponent,
        title: 'All Checkouts',
        canActivate: [authGuardGuard]
    }
];
