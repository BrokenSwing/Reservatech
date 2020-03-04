import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrganizationsListComponent} from './organizations-list/organizations-list.component';
import {OrganizationDetailsComponent} from './organization-details/organization-details.component';
import {OrganizationResolverService} from './organization-resolver.service';

const routes: Routes = [
  {
    path: 'organizations',
    component: OrganizationsListComponent
  },
  {
    path: 'organizations/:id',
    component: OrganizationDetailsComponent,
    resolve: {
      organization: OrganizationResolverService,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
