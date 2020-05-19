import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  sub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Now you can enter the system using your credentials');
      } else if (params['accessDenied']) {
        MaterialService.toast('You need to authorize');
      } else if (params['sessionExpired']) {
        MaterialService.toast('Please, enter the system again');
      }
    });
  }

  onSubmit(): void {
    this.form.disable();
    // const user = {
    //   email: this.form.value.email,
    //   password: this.form.value.password
    // }

    this.sub = this.auth.login(this.form.value).subscribe(() =>
      this.router.navigate(['/overview']),
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
