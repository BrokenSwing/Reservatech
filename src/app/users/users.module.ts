import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { UserOrganizationsListComponent } from './user-organizations-list/user-organizations-list.component';
import { OrganizationCreateComponent } from './organization-create/organization-create.component';
import {AppCommonModule} from '../app-common/app-common.module';


@NgModule({
  declarations: [UserProfileComponent, UserOrganizationsListComponent, OrganizationCreateComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppCommonModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
