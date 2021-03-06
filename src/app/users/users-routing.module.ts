import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AuthGuard} from '../auth.guard';
import {UserOrganizationsListComponent} from './user-organizations-list/user-organizations-list.component';
import {OrganizationCreateComponent} from './organization-create/organization-create.component';


const routes: Routes = [
  {
    path: 'me',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'me/organizations',
    component: UserOrganizationsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'me/organizations/new',
    component: OrganizationCreateComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
