export class RegisterFormModel {

  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public passwordConfirm: string
  ) {}

  isValid() {
    return this.firstName.length > 2 && this.lastName.length > 2 && this.email.length > 5
      && this.password.length >= 10 && this.password === this.passwordConfirm;
  }

}
