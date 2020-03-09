import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  expanded = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  isConnected() {
    return this.authService.isConnected();
  }

  disconnect() {
    this.authService.disconnect();
    this.router.navigate(['/']);
  }

  switchExpanded() {
    this.expanded = !this.expanded;
  }

}
