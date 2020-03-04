import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsRoutingModule } from './organizations-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';


@NgModule({
  declarations: [OrganizationsListComponent, OrganizationDetailsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    OrganizationsRoutingModule
  ]
})
export class OrganizationsModule { }
