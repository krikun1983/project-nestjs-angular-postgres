import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Entry {
  name: string;
  link: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public entries: Entry[] = [
    {
      name: 'Login',
      link: 'login',
    },
    {
      name: 'Register',
      link: 'register',
    },
  ];
  constructor(private router: Router) {}

  public navigateTo(path: string) {
    this.router.navigate(['../', path]);
  }
}
