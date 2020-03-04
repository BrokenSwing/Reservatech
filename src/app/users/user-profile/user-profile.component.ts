import {Component, OnInit} from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {

  model: User = new User();

  errorMessage?: string = null;
  successMessage?: string = null;
  submitting = false;

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.usersService.getConnectedUser().subscribe((user) => {
      this.model = { ... user};
    });
  }

  updateProfile(formData: NgForm) {
    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.usersService.updateUser(this.model.id, this.model).subscribe((user) => {
      this.model = user;
      this.submitting = false;
      formData.reset(this.model);
      this.successMessage = 'Profil mis à jour.';
    }, (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Email déjà utilisée.';
        } else {
          this.errorMessage = 'Le serveur rencontre un problème. Ré-essayez plus tard.';
        }
        this.submitting = false;
    });
  }

}
