import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../services/image.service';
import {Image} from '../../models/Image';
import {Router} from '@angular/router';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {
  images: Image[];

  constructor(private router: Router, private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.imageService.getImages().subscribe(images => {
      this.images = images.body;
    });
  }

  imageView(id: string): void {
    this.router.navigate(['image-view', id]);
  }
}
