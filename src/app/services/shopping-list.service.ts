import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { LibraryItem } from '../shared/models/library-item.model';
import { take, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';
import { Image } from '../shared/models/image.model';
import { Platform } from '@ionic/angular';
import { ImageService } from './image.service';
import { ItemLibrary } from '../shared/classes/item-library.class';
import { ShoppingList } from '../shared/classes/shopping-list.class';
import { ItemGroup } from '../shared/classes/item-group.class';
import * as Constants from '../shared/constants';
import {
	AddLibraryItemProps,
	AddListItemProps,
	ItemGroupProps,
} from '../shared/models/action-props.model';
import { ShoppingListItem } from '../shared/models/shopping-list-item.model';

@Injectable({
	providedIn: 'root',
})
export class ShoppingListService {
	constructor(
		private storage: Storage,
		private platform: Platform,
		private imageService: ImageService
	) {}

	addLibraryItem(data: AddLibraryItemProps, itemLibrary: ItemLibrary) {
		try {
			const newLibrary: ItemLibrary = this.cloneItemLibrary(itemLibrary);
			const { name, imgData, tags } = data;

			const newID: string = uuidv4();
			const newItem: LibraryItem = { itemID: newID, name, imgData, tags };

			newLibrary.add(newID, newItem);
			return from(this.storage.set(Constants.LIBRARY_KEY, newLibrary));
		} catch (error) {
			return throwError(error);
		}
	}

	updateLibraryItem(item: LibraryItem, itemLibrary: ItemLibrary) {
		try {
			const newLibrary: ItemLibrary = this.cloneItemLibrary(itemLibrary);
			newLibrary.update(item.itemID, item);
			return from(this.storage.set(Constants.LIBRARY_KEY, newLibrary));
		} catch (error) {
			return throwError(error);
		}
	}

	removeLibraryItem(itemID: string, itemLibrary: ItemLibrary) {
		try {
			const newLibrary: ItemLibrary = this.cloneItemLibrary(itemLibrary);
			newLibrary.remove(itemID);
			return from(this.storage.set(Constants.LIBRARY_KEY, newLibrary));
		} catch (error) {
			return throwError(error);
		}
	}

	addListItem(data: AddListItemProps, shoppingLists: ShoppingList[]) {
		try {
			const { itemID, amount, listIdx } = data;
			const newShoppingLists: ShoppingList[] = [...shoppingLists];
			const newItem = { itemID: itemID, amount };

			let activeList: ShoppingList = newShoppingLists[listIdx];
			if (!activeList) {
				activeList = new ShoppingList(new Map());
				const newIdx = newShoppingLists.length;
				newShoppingLists[newIdx] = activeList;
			}
			activeList.add(itemID, newItem);
			return from(
				this.storage.set(Constants.SHOPPING_LIST_KEY, newShoppingLists)
			);
		} catch (error) {
			return throwError(error);
		}
	}

	updateListItem(
		item: ShoppingListItem,
		listIdx: number,
		shoppingLists: ShoppingList[]
	) {
		try {
			const newShoppingLists: ShoppingList[] = [...shoppingLists];
			let activeList: ShoppingList = newShoppingLists[listIdx];
			activeList.update(item.itemID, item);
			return from(
				this.storage.set(Constants.SHOPPING_LIST_KEY, newShoppingLists)
			);
		} catch (error) {
			return throwError(error);
		}
	}

	removeListItem(
		itemID: string,
		listIdx: number,
		shoppingLists: ShoppingList[]
	) {
		try {
			const newShoppingLists: ShoppingList[] = [...shoppingLists];
			let activeList: ShoppingList = newShoppingLists[listIdx];
			activeList.remove(itemID);
			return from(
				this.storage.set(Constants.SHOPPING_LIST_KEY, newShoppingLists)
			);
		} catch (error) {
			return throwError(error);
		}
	}

	addToItemGroup(data: ItemGroupProps, itemGroups: ItemGroup[]) {
		try {
			const newItemGroup: ItemGroup[] = [...itemGroups];
			const { itemID, groupIdx } = data;
			let activeGroup = newItemGroup[groupIdx];
			activeGroup.add(itemID);
			return from(this.storage.set(Constants.ITEM_GROUP_KEY, newItemGroup));
		} catch (error) {
			return throwError(error);
		}
	}

	removeFromItemGroup(data: ItemGroupProps, itemGroups: ItemGroup[]) {
		try {
			const newItemGroup: ItemGroup[] = [...itemGroups];
			const { itemID, groupIdx } = data;
			let activeGroup = newItemGroup[groupIdx];
			activeGroup.remove(itemID);
			return from(this.storage.set(Constants.ITEM_GROUP_KEY, newItemGroup));
		} catch (error) {
			return throwError(error);
		}
	}

	cloneItemLibrary(sourceLib: ItemLibrary) {
		const newLibrary: ItemLibrary = new ItemLibrary(new Map());
		Object.assign(newLibrary, sourceLib);
		return newLibrary;
	}
}
