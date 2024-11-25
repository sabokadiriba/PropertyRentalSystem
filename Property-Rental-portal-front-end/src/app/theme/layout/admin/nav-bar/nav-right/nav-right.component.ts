// Angular import
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  constructor(private router: Router) { }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('authentication/login');
  }
}
