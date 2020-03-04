export class User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;

  constructor() {
    this.id = -1;
    this.firstName = '';
    this.lastName = '';
    this.email = null;
  }

}
