import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  userId: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.verifyAuth().subscribe(res => this.isLoggedIn = res);
    this.userId = this.authService.userData.userId
  }

  onLogoutClick() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
