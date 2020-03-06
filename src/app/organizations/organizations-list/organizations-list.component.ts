import { Component, OnInit } from '@angular/core';
import {OrganizationsService} from '../organizations.service';
import {Organization} from '../organization';

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
})
export class OrganizationsListComponent implements OnInit {

  organizations: Organization[];

  constructor(private organizationsService: OrganizationsService) { }

  ngOnInit() {
    this.organizationsService.getAllOrganizations().subscribe((organizations) => {
      this.organizations = organizations;
      this.organizations.forEach((organization) => {
        this.organizationsService.getMembersIdsFor(organization.id).subscribe((membersIds) => {
          organization.members = membersIds;
        });
      });
    });
  }

}
