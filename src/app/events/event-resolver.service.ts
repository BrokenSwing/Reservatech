import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Event} from './event';
import {EMPTY, Observable, of} from 'rxjs';
import {EventsService} from './events.service';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventResolverService implements Resolve<Event> {

  constructor(private eventsService: EventsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event> | Promise<Event> | Event {
    const id = parseInt(route.paramMap.get('id'), 10);
    if (isNaN(id)) {
      return EMPTY;
    }

    return this.eventsService.getEvent(id).pipe(
      mergeMap((event) => {
        if (event) {
          return of(event);
        } else {
          this.router.navigate(['/events']);
          return EMPTY;
        }
      })
    );
  }
}
