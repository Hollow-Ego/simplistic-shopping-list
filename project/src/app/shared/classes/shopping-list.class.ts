import { ShoppingListItem } from '../models/shopping-list-item.model';

export class ShoppingList {
	constructor(private shoppingItems: Map<string, ShoppingListItem>) {}

	get(id: string) {
		return this.shoppingItems.get(id);
	}

	getAllItems() {
		return this.shoppingItems;
	}

	add(id: string, item: ShoppingListItem) {
		this.shoppingItems.set(id, item);
	}

	remove(id: string) {
		this.shoppingItems.delete(id);
	}

	update(id: string, item: ShoppingListItem) {
		this.shoppingItems.set(id, item);
	}
}
