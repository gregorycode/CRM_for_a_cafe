import {Component, OnInit} from '@angular/core';
import {AuthService} from "./components/shared/services/auth.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit{

  constructor(private auth: AuthService, private titleService:Title) {}

  ngOnInit(): void {
    this.titleService.setTitle("My Cafe");
    const potentialToken = localStorage.getItem('authToken');

    if (potentialToken) {
      this.auth.setToken(potentialToken)
    }
  }
}
