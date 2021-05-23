import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
	IonItemSliding,
	ModalController,
	PopoverController,
} from '@ionic/angular';
import { ShoppingListService } from '../../../../services/shopping-list.service';

import { PopulatedItem } from '../../../../shared/models/populated-item.model';
import { ImageModalComponent } from '../../../modals/image-modal/image-modal.component';

@Component({
	selector: 'ssl-populated-item',
	templateUrl: './populated-item.component.html',
	styleUrls: ['./populated-item.component.scss'],
})
export class PopulatedItemComponent implements OnInit {
	@Input() item: PopulatedItem;
	@ViewChild('shoppingItem') shoppingItemRef: ElementRef;
	private lastOnStart = 0;
	private DOUBLE_CLICK_THRESHOLD = 500;

	constructor(
		private popoverCtrl: PopoverController,
		private modalCtrl: ModalController,
		private shoppingListService: ShoppingListService
	) {}

	ngOnInit() {}

	onStartDoubleClick() {
		const now = Date.now();
		if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
			// this.shoppingListService.removeItem(this.item[0]).subscribe(() => {
			// 	this.lastOnStart = 0;
			// });
		} else {
			this.lastOnStart = now;
		}
	}

	async onItemClick(title: string, imageUrl: string) {
		const popover = await this.popoverCtrl.create({
			component: ImageModalComponent,
			cssClass: 'image-modal',
			componentProps: {
				title,
				imageUrl,
			},
			showBackdrop: true,
			backdropDismiss: true,
		});
		await popover.present();
	}

	async onEditItem(item: PopulatedItem, slidingItem: IonItemSliding) {
		slidingItem.close();

		// const modal = await this.modalCtrl.create({
		// 	component: NewEditItemComponent,
		// 	componentProps: {
		// 		isEditMode: true,
		// 		item,
		// 	},
		// });
		// await modal.present();
	}
}
