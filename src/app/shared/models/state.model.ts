import { ItemGroup } from '../classes/item-group.class';
import { ItemLibrary } from '../classes/item-library.class';
import { ShoppingList } from '../classes/shopping-list.class';

export interface State {
	isLoading: boolean;
	mode: Symbol;
	currentListIdx: number;
	itemLibrary: ItemLibrary;
	itemGroups: ItemGroup[];
	shoppingLists: ShoppingList[];
	errors: string[];
}
