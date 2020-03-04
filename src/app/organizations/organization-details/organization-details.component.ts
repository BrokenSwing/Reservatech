import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Organization} from '../organization';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
})
export class OrganizationDetailsComponent implements OnInit {

  organization: Organization;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: { organization: Organization}) => {
        this.organization = data.organization;
    });
  }

}
