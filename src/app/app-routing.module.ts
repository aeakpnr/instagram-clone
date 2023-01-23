import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component'
import { AuthGuard } from './guard/auth.guard';
import { HomeGuard } from './guard/home.guard';

const routes: Routes = [

  {path: 'login', component: AuthComponent, canActivate: [HomeGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
