import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faLock = faLock;

  username: string;
  password: string;

  isLoggedIn = false;
  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.verifyAuth().subscribe(res => {
      if (res) {
        this.isLoggedIn = true;
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(res => {
      if (res) {
        this.flashMessage.show('Successful login!', { cssClass: 'alert-success', timeout: 4000 });

        this.router.navigate(['/']);
        window.location.reload();
      }
    },
      err => this.flashMessage.show(err.message, { cssClass: 'alert-danger', timeout: 4000 })
    );
  }
}
