import {Component, Input, OnInit} from '@angular/core';
import {Image} from '../../models/Image';
import {Router} from '@angular/router';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent implements OnInit {
  @Input() images: Image[];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  imageView(id: string): void {
    this.router.navigate(['image-view', id]);
  }
}
