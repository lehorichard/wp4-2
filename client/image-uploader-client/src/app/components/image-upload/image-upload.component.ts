import {Component, OnInit, ViewChild} from '@angular/core';
import {ImageService} from '../../services/image.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  name: string;
  description: string;
  picture: string = null;
  pictureSet = false;
  @ViewChild('imageForm', {static: false}) form: any;

  constructor(
    private imageService: ImageService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  onFileChanged(event): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.picture = reader.result.toString();
      this.pictureSet = true;
    };
  }

  onSubmit(): void {
    this.imageService.postImage(this.picture, this.name, this.description).subscribe(res => {
        this.flashMessage.show('Image successfully added', {cssClass: 'alert-success', timeout: 4000});
        const response = res.body as { id: string }
        this.router.navigate(['image-view', response.id]);
      },
      err => {
        this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 4000});
      }
    );
  }

  clear(): void {
    this.name = '';
    this.description = '';
    this.picture = null;
    this.pictureSet = false;
  }
}
