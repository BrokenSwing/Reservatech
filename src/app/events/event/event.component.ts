import { Component, OnInit } from '@angular/core';
import { Event } from '../event';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {OrganizationsService} from '../../organizations/organizations.service';
import {EventUpdateModel} from './event-update-model';
import {EventsService} from '../events.service';
import {User} from '../../users/user';
import * as moment from 'moment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit {

  private editable = false;

  event: Event;
  editing = false;
  submitting = false;
  status?: { success: boolean, msg: string} = null;
  participants: number[] = [];
  participatingUsers: User[] = [];

  model: EventUpdateModel = new EventUpdateModel('', '');

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router,
              private organizationsService: OrganizationsService, private eventsService: EventsService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { event: Event }) => {
      this.event = data.event;
      this.model = new EventUpdateModel(this.event.name, this.event.description);

      if (this.authService.isConnected()) {
        this.organizationsService.getMembersIdsFor(this.event.organizationId).subscribe((ids) => {
          this.editable = ids.includes(this.authService.getUserInfo().userId);
        });
      }

      this.eventsService.getAllParticipantsIds(this.event.id, this.event.organizationId).subscribe(
        (participants) => this.participants = participants
      );

      this.eventsService.getAllParticipants(this.event.id, this.event.organizationId).subscribe(
        (participants) => this.participatingUsers = participants
      );

    });
  }

  canEdit() {
    return this.editable;
  }

  switchEdit() {
    this.editing = !this.editing;
  }

  save() {
    this.submitting = true;
    this.status = null;
    this.eventsService.updateEvent(this.event.id, this.event.organizationId, this.model.name, this.model.description)
      .subscribe(
        (event) => {
          this.event = event;
          this.submitting = false;
          this.editing = false;
          this.status = { success: true, msg: 'L\'événement a bien été mis à jour.' };
        },
        (err) => {
          this.submitting = false;
          if (err.status === 400) {
            this.status = { success: false, msg: err.error.error };
          } else if (err.status === 404) {
            this.status = { success: false, msg: 'Cet événement semble ne plus exister.' };
          } else {
            this.status = { success: false, msg: 'Le serveur rencontre des problèmes. Ré-essayez plus tard.' };
          }
        }
      );
  }

  deleteEvent() {
    this.submitting = true;
    this.eventsService.deleteEvent(this.event.id, this.event.organizationId)
      .subscribe(() => {
        this.router.navigate(['organizations', this.event.organizationId]);
      }, (err) => {
        this.submitting = false;
        if (err.status === 404) {
          this.status = { success: false, msg: 'Cet événement semble ne déjà plus exister.' };
        } else {
          this.status = { success: false, msg: 'Le serveur rencontre des problèmes. Ré-essayez plus tard.' };
        }
      });
  }

  connected() {
    return this.authService.isConnected();
  }

  participate() {
    this.submitting = true;
    this.eventsService.participate(this.event.id, this.event.organizationId)
      .subscribe((event: Event) => {
        this.submitting = false;
        this.status = { success: true, msg: 'Vous êtes maintenant inscrit à cet événement' };
        this.event = event;
        this.participants.push(this.authService.getUserInfo().userId);
      }, (err) => {
        this.submitting = false;
        if (err.status === 400) {
          this.status = { success: false, msg: 'Il n\'y a plus de place' };
        } else {
          this.status = { success: false, msg: 'Le serveur rencontre des problèmes. Ré-essayez plus tard.'};
        }
      });
  }

  participating() {
    return this.participants.includes(this.authService.getUserInfo().userId);
  }

  stopParticipating() {
    this.submitting = true;
    this.eventsService.stopParticipating(this.event.id, this.event.organizationId)
      .subscribe(() => {
        this.submitting = false;
        this.participants = this.participants.filter(id => id !== this.authService.getUserInfo().userId);
        this.status = { success: true, msg: 'Vous ne participez plus à cet événement.' };
      }, (err) => {
        this.submitting = false;
        if (err.status === 400) {
          this.status = { success: false, msg: 'Il semblerai que cet événement n\'existe plus.'};
        } else {
          this.status = { success: false, msg: 'Le serveur rencontre des problèmes. Ré-essayez plus tard.' };
        }
      });
  }

  calendar(d: Date) {
    return moment(d, undefined, 'fr').calendar();
  }

}
