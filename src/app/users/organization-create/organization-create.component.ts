import { Component, OnInit } from '@angular/core';
import {OrganizationModel} from './organization-model';
import {OrganizationsService} from '../../organizations/organizations.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create.component.html',
})
export class OrganizationCreateComponent implements OnInit {

  error?: string = null;
  model = new OrganizationModel('', '');
  submitting = false;

  constructor(private organizationsService: OrganizationsService, private router: Router) { }

  ngOnInit(): void {
  }

  create() {
    this.submitting = true;
    this.organizationsService.createOne(this.model.name, this.model.description).subscribe(
      (org) => {
        this.router.navigate(['organizations', org.id]);
      },
      (err) => {
        this.submitting = false;
        this.model.name = this.model.name.trim();
        this.model.description = this.model.description.trim();
        if (err.status === 400) {
          this.error = 'Le nom est requis et la description doit faire au moins 20 caractères.';
        } else {
          this.error = 'Un problème est survenu sur le serveur. Ré-essayez plus tard.';
        }
      }
    );
  }

}
