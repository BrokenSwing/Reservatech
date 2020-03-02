import { Component, OnInit } from '@angular/core';
import {RegisterFormModel} from './register-form-model';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent implements OnInit {

  model = new RegisterFormModel('', '', '', '', '');
  errorMessage?: string = null;
  successMessage?: string = null;
  submitting = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  submit() {
    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.authService.createAccount(this.model.firstName, this.model.lastName, this.model.email, this.model.password).subscribe(
      () => {
        this.successMessage = 'Compte créé. Vous pouvez vous connecter';
      },
      error => {
        this.submitting = false;
        if (error.status === 400) {
          this.errorMessage = 'Adresse email déjà utilisée';
        } else {
          this.errorMessage = 'Le serveur rencontre des problèmes. Ré-essayez plus tard';
        }
      }
    );
  }

}
