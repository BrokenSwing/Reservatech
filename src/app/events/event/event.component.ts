import { Component, OnInit } from '@angular/core';
import { Event } from '../event';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {OrganizationsService} from '../../organizations/organizations.service';
import {EventUpdateModel} from './event-update-model';
import {EventsService} from '../events.service';

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

}
