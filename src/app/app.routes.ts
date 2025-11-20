import { Routes } from '@angular/router';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { SignalFormComponent } from './signal-form/signal-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'reactive', pathMatch: 'full' },
    { path: 'reactive', component: ReactiveFormComponent },
    { path: 'signal', component: SignalFormComponent }
];
