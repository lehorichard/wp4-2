import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ImageService} from '../../services/image.service';
import {Image} from '../../models/Image';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {
  faTimes = faTimes;
  ownImage = false;
  sessionId: string;

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
      this.image.img.data = imageBase64;
      if (this.image.user && this.image.user.id === this.sessionId) {
        this.ownImage = true;
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

  deleteImage(id): void {
    this.imageService.deleteImage(id).subscribe(res => {
        if (res) {
          this.flashMessage.show('Image deleted!', {cssClass: 'alert-success', timeout: 4000});

          this.router.navigate(['/']);
        }
      },
      err => this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 4000})
    );
  }

}
