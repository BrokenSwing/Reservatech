import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Organization} from './organization';
import {EMPTY, Observable, of} from 'rxjs';
import {OrganizationsService} from './organizations.service';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganizationResolverService implements Resolve<Organization> {

  constructor(private organizationsService: OrganizationsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Organization> | Promise<Organization> | Organization {
    const id = parseInt(route.paramMap.get('id'), 10);
    if (isNaN(id)) {
      return EMPTY;
    }

    return this.organizationsService.getOrganization(id).pipe(
      mergeMap((organization) => {
        if (organization) {
          return of(organization);
        } else {
          this.router.navigate(['/organizations']);
          return EMPTY;
        }
      })
    );
  }
}
