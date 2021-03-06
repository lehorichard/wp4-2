import {Component, OnInit} from '@angular/core';
import {Image} from '../../models/Image';
import {ImageService} from '../../services/image.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent implements OnInit {
  sessionId: string;

  name: string;
  description: string;

  id: string;
  image: Image;
  loading = true;

  constructor(
    private imageService: ImageService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private flashMessage: FlashMessagesService,
    private router: Router) {
    this.activatedRoute.paramMap.subscribe((data) => {
      // @ts-ignore
      this.id = data.params.imageId;
    });
    this.sessionId = this.authService.userData.userId;
  }

  ngOnInit(): void {
    this.imageService.getImage(this.id).subscribe(image => {
      // @ts-ignore
      const imageBase64 = this.arrayBufferToBase64(image.body.img.data.data);
      this.image = image.body;
      this.name = this.image.name;
      this.description = this.image.desc;
      this.image.img.data = imageBase64;
      if (this.image.user && this.image.user.id !== this.sessionId) {
        this.router.navigate(['/']);
      }
      this.loading = false;
    });
  }

  arrayBufferToBase64(buffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  updateImage(id): void {
    this.imageService.updateImage(id, this.name, this.description).subscribe(res => {
        if (res) {
          this.flashMessage.show('Image updated!', {cssClass: 'alert-success', timeout: 4000});

          this.router.navigate(['image-view', id]);
        }
      },
      err => this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 4000})
    );
  }
}
