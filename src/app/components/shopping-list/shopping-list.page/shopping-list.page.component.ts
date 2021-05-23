import { Component, Input, OnInit } from '@angular/core';
import { ItemLibrary } from '../../../shared/classes/item-library.class';
import { ShoppingList } from '../../../shared/classes/shopping-list.class';
import { PopulatedItem } from '../../../shared/models/populated-item.model';

@Component({
	selector: 'ssl-shopping-list-page',
	templateUrl: './shopping-list.page.component.html',
	styleUrls: ['./shopping-list.page.component.scss'],
})
export class ShoppingListPageComponent implements OnInit {
	@Input() shoppingList: ShoppingList;
	@Input() library: ItemLibrary;
	public items: PopulatedItem[] = [];

	constructor() {}

	ngOnInit() {
		const itemMap = this.shoppingList.getAllItems();
		itemMap.forEach((listItem, key) => {
			const libItem = this.library.get(listItem.itemID);
			const amount = listItem.amount;
			const populatedItem: PopulatedItem = { ...libItem, amount };

			this.items.push(populatedItem);
		});
	}
}
