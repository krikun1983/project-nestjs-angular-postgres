import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';

type LoginForm = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  public loginForm!: FormGroup<LoginForm>;

  constructor(private authService: AuthenticationService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.minLength(6)],
      }),
      password: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.subscription = this.authService
      .login(this.loginForm.getRawValue())
      .pipe(tap(() => this.router.navigate(['admin'])))
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
