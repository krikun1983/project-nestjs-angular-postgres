import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

type RegisterForm = {
  name: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
};

class CustomValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
    const regex = /\d/;
    return regex.test(control.value) && control.value !== null ? null : { passwordInvalid: true };
  }

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    return password === passwordConfirm && !!password && !!passwordConfirm
      ? null
      : { passwordsNoMatching: true };
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup<RegisterForm>;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthenticationService) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.registerForm = this.fb.group(
      {
        name: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        username: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        email: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email, Validators.minLength(6)],
        }),
        password: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3), CustomValidators.passwordContainsNumber],
        }),
        passwordConfirm: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: CustomValidators.passwordMatch,
      }
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.authService
      .register(this.registerForm.getRawValue())
      .pipe(tap(() => this.router.navigate(['login'])))
      .subscribe();
  }
}
