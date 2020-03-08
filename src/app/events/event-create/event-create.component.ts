import { Component, OnInit } from '@angular/core';
import {Organization} from '../../organizations/organization';
import {UsersService} from '../../users/users.service';
import {AuthService} from '../../auth.service';
import {EventCreateModel} from './event-create-model';
import {EventsService} from '../events.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
})
export class EventCreateComponent implements OnInit {

  organizations: Organization[];
  model = new EventCreateModel('', '', 1, '', '', null);
  submitting = false;
  errorMessage?: string = null;

  constructor(private userService: UsersService, private authService: AuthService,
              private eventsService: EventsService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserOrganizations(this.authService.getUserInfo().userId)
      .subscribe((organizations) => {
        this.organizations = organizations;
        if (this.organizations.length > 0) {
          this.model.organizationId = this.organizations[0].id;
        }
      });
  }

  createEvent() {
    this.submitting = true;
    this.eventsService.createEvent(
      this.model.name,
      this.model.description,
      this.model.maxParticipants,
      this.model.beginning,
      this.model.end,
      this.model.organizationId,
    ).subscribe((event) => {
        this.submitting = false;
        this.router.navigate(['events', event.id]);
    }, (error) => {
        this.submitting = false;
        if (error.status === 400) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Le serveur rencontre des problèmes. Ré-essayez plus tard.';
        }
    });
  }

  areDateFilled() {
    return this.model.beginning.length === 16 && this.model.end.length === 16;
  }

}
