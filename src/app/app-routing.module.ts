import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PatternComponent} from './pattern/pattern.component';

const routes: Routes = [
    {
        path: 'pattern/:pattern',
        component: PatternComponent
    },
    { path: '', redirectTo: '/pattern/baggi', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
