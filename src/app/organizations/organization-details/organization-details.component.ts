import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Organization} from '../organization';
import {User} from '../../users/user';
import {OrganizationsService} from '../organizations.service';
import {Event} from '../../events/event';
import * as moment from 'moment';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
})
export class OrganizationDetailsComponent implements OnInit {

  organization: Organization;
  members: User[];
  events: (Event & { beginningDisplay: string })[];

  constructor(private route: ActivatedRoute, private organizationsService: OrganizationsService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { organization: Organization }) => {
        this.organization = data.organization;
        this.organizationsService.getMembersFor(this.organization.id).subscribe((members) => this.members = members);
        this.organizationsService.getEventsFor(this.organization.id)
          .subscribe((events) => this.events = events.map(e => ({
            ...e,
            beginningDisplay: moment(e.beginning, undefined, 'fr').calendar(),
          })));
    });
  }

}
