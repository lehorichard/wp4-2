import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  faLock = faLock;

  username: string;
  password: string;

  isLoggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.verifyAuth().subscribe(res => {
      if (res) {
        this.isLoggedIn = true;
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    this.authService.register(this.username, this.password).subscribe(res => {
      if (res) {
        this.flashMessage.show('Succesful registration!', { cssClass: 'alert-success', timeout: 4000 });

        this.router.navigate(['/login']);
      }
    },
      err => this.flashMessage.show(err.message, { cssClass: 'alert-danger', timeout: 4000 })
    );
  }
}
