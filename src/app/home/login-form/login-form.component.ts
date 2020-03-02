import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {LoginFormModel} from './login-form-model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {

  model = new LoginFormModel('', '');
  connecting = false;
  errorMessage?: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  submit() {
    this.connecting = true;
    this.errorMessage = null;
    this.authService.connect(this.model.email, this.model.password).subscribe(
      () => {
        this.connecting = false;
      },
      error => {
        this.connecting = false;
        if (error.status === 401) {
          this.errorMessage = 'Mauvais identifiants';
        } else {
          this.errorMessage = 'Le serveur rencontre des difficultés. Ré-essayez plus tard.';
        }
      }
    );
  }

}
