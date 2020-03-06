import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Organization} from '../organization';
import {User} from '../../users/user';
import {OrganizationsService} from '../organizations.service';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
})
export class OrganizationDetailsComponent implements OnInit {

  organization: Organization;
  members: User[];

  constructor(private route: ActivatedRoute, private organizationsService: OrganizationsService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { organization: Organization }) => {
        this.organization = data.organization;
        this.organizationsService.getMembersFor(this.organization.id).subscribe((members) => this.members = members);
    });
  }

}
