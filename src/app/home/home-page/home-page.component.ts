import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  isConnected() {
    return this.authService.isConnected();
  }

}
