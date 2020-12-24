import {Component, OnInit} from '@angular/core';
import {Image} from '../../models/Image';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-images',
  templateUrl: './user-images.component.html',
  styleUrls: ['./user-images.component.css']
})
export class UserImagesComponent implements OnInit {
  images: Image[];
  user: string;
  id: string;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((data) => {
      // @ts-ignore
      this.user = data.params.userName;
      // @ts-ignore
      this.id = data.params.userId;
    });
  }

  ngOnInit(): void {
    this.userService.getUserImages(this.id).subscribe(images => {
      this.images = images.body;
    });
  }
}
