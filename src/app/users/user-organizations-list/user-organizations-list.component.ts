import { Component, OnInit } from '@angular/core';
import {UsersService} from '../users.service';
import {Organization} from '../../organizations/organization';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-user-organizations-list',
  templateUrl: './user-organizations-list.component.html',
})
export class UserOrganizationsListComponent implements OnInit {

  organizations: Organization[];

  constructor(private usersService: UsersService, private authService: AuthService) { }

  ngOnInit(): void {
    this.usersService.getUserOrganizations(this.authService.getUserInfo().userId).subscribe((organizations) => {
      this.organizations = organizations;
    });
  }

}
