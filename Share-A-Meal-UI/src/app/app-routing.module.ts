import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { MealDetailComponent } from './meal-detail/meal-detail.component';
import { RegisterScreenComponent } from './register-screen/register-screen.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'meal-detail', component: MealDetailComponent, pathMatch: 'full', canActivate: [AuthService] },
  { path: 'login', component: LoginScreenComponent, pathMatch: 'full'},
  { path: 'register', component: RegisterScreenComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
