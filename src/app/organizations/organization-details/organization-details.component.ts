import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Organization} from '../organization';
import {User} from '../../users/user';
import {OrganizationsService} from '../organizations.service';
import {Event} from '../../events/event';
import * as moment from 'moment';
import {AuthService} from '../../auth.service';
import {OrganizationModel} from '../../users/organization-create/organization-model';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
})
export class OrganizationDetailsComponent implements OnInit {

  organization: Organization;
  members: User[];
  events: (Event & { beginningDisplay: string })[];

  model: OrganizationModel = new OrganizationModel('', '');
  editing = false;
  submitting = false;
  status?: { success: boolean, msg: string} = null;

  constructor(
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private authService: AuthService
  ) { }

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

  isMember() {
    return this.authService.isConnected() && this.members && this.members.map(m => m.id).includes(this.authService.getUserInfo().userId);
  }

  switchEdit() {
    this.model = new OrganizationModel(this.organization.name, this.organization.description);
    this.editing = !this.editing;
    if (!this.editing) {
      this.status = null;
    }
  }

  save() {
    this.submitting = true;
    this.organizationsService.patchOne(this.organization.id, this.model.name, this.model.description)
      .subscribe((organization) => {
        this.editing = false;
        this.submitting = false;
        this.organization = organization;
        this.status = { success: true, msg: 'Informations mises à jour.' };
      }, (err) => {
        this.submitting = false;
        if (err.status === 400) {
          this.status = { success: false, msg: 'Les informations rentrées ne sont pas valides' };
        } else {
          this.status = { success: false, msg: 'Le serveur rencontre des problèmes. Ré-essayez plus tard.' };
        }
      });
  }

}
