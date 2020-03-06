import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { UserOrganizationsListComponent } from './user-organizations-list/user-organizations-list.component';


@NgModule({
  declarations: [UserProfileComponent, UserOrganizationsListComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
