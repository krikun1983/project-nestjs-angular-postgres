import { Component, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  private subscription?: Subscription;
  constructor(private authService: AuthenticationService) {}

  login() {
    this.subscription = this.authService.login('krikun@mail.ru', 'simplePassword').subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
