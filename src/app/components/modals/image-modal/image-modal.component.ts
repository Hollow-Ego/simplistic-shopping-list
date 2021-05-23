import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'ssl-image',
	templateUrl: './image-modal.component.html',
	styleUrls: ['./image.component.scss'],
})
export class ImageModalComponent implements OnInit {
	@Input() imageUrl: string;
	@Input() title: string;

	constructor() {}

	ngOnInit() {}
}
