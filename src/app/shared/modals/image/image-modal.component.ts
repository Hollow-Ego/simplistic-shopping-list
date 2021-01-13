import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageModalComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
