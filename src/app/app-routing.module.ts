import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { MatchedTypesComponent } from './matched-types/matched-types.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: "full", canActivate: [AuthGuard] },
  { path: 'approvedMatches', component: MatchedTypesComponent, pathMatch: "full", canActivate: [AuthGuard], data: {name: 'APPROVED MATCHES', match: 'approved', status: 'approved'}},
  { path: 'exactMatches', component: MatchedTypesComponent, pathMatch: "full", canActivate: [AuthGuard], data: {name: 'EXACT MATCHED ITEMS', match: 'matched', status: 'exact'}},
  { path: 'possibleMatches', component: MatchedTypesComponent, pathMatch: "full", canActivate: [AuthGuard], data: {name: 'POSSIBLE MATCHED ITEMS', match: 'matched', status: 'possible'}},
  { path: 'noMatch', component: MatchedTypesComponent, pathMatch: "full", canActivate: [AuthGuard], data: {name: 'UNMATCHED ITEMS', match: 'matched', status: 'nomatch'}},
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
