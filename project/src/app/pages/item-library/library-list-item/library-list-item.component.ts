import { Component, Input, OnInit } from '@angular/core';
import { LibraryItem } from '../../../shared/models/library-item.model';

@Component({
	selector: 'pxsl1-library-list-item',
	templateUrl: './library-list-item.component.html',
	styleUrls: ['./library-list-item.component.scss'],
})
export class LibraryListItemComponent implements OnInit {
	@Input() item: LibraryItem;
	constructor() {}

	ngOnInit() {}

	onAddToList() {}

	hasImage() {
		return this.item.imgData.webviewPath !== '';
	}
}
