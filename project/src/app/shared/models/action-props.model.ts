import { ItemGroup } from '../classes/item-group.class';
import { ItemLibrary } from '../classes/item-library.class';
import { LibraryItem } from './library-item.model';

import { ShoppingList } from '../classes/shopping-list.class';
import { Image } from './image.model';
import { ShoppingListItem } from './shopping-list-item.model';

export interface GeneralActionProps {
	mode: string;
	itemLibrary?: ItemLibrary;
	itemGroups?: ItemGroup[];
	shoppingLists?: ShoppingList[];
}

export interface GeneralReturnProps {
	mode?: Symbol;
	itemLibrary?: ItemLibrary;
	itemGroups?: ItemGroup[];
	shoppingLists?: ShoppingList[];
	errors?: string[];
}

export interface AddLibraryItemProps {
	name: string;
	amount: number;
	imgData: Image;
	tags: string[];
	unit: string;
	price: number;
	addToListIdx?: number;
}

export interface UpdateLibraryItemProps {
	item: LibraryItem;
}

export interface AddListItemProps {
	itemID: string;
	amount: number;
	listIdx: number;
	itemLibrary?: ItemLibrary;
}

export interface UpdateListItemProps {
	item: ShoppingListItem;
	listIdx: number;
}

export interface RemoveListItemProps {
	itemID: string;
	listIdx: number;
}

export interface LoadShoppingListProps {
	listIdx: number;
	fullReload?: boolean;
}

export interface ShoppingListReturnProps {
	list: ShoppingList;
}

export interface ItemGroupProps {
	itemID: string;
	groupIdx: number;
}

export interface AddItemShortProps {
	itemID: string;
}

export interface RemoveItemShortProps {
	itemID: string;
}
