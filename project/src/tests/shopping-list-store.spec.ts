import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '../app/shared/models/state.model';
import * as Modes from '../app/shared/constants';
import * as SLActions from '../app/store/shopping-list.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { ShoppingListEffects } from '../app/store/shopping-list.effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { IonicStorageModule } from '@ionic/storage';
import { ItemLibrary } from '../app/shared/classes/item-library.class';
import {
	selectItemGroups,
	selectItemLibrary,
	selectShoppingLists,
} from '../app/store/shopping-list.selectors';
import { LibraryItem } from '../app/shared/models/library-item.model';

import { ShoppingList } from '../app/shared/classes/shopping-list.class';
import { ItemGroup } from '../app/shared/classes/item-group.class';
import { ShoppingListItem } from '../app/shared/models/shopping-list-item.model';

describe('ShoppingListStore', () => {
	let store: MockStore;
	let effects: ShoppingListEffects;
	let actions$ = new Observable<Action>();

	const initialState: State = {
		isLoading: false,
		mode: Modes.EDIT_MODE,
		currentListIdx: 0,
		itemLibrary: null,
		itemGroups: null,
		shoppingLists: null,
		errors: null,
	};

	const testRawLibraryItem = {
		name: 'Testname',
		imgData: {
			fileName: 'filename.png',
			filepath: 'filepath',
			webviewPath: 'webviewpath',
		},
		tags: [],
	};

	const testFullLibraryItem = {
		itemID: 'test-id-041',
		name: 'Testname',
		imgData: {
			fileName: 'filename.png',
			filepath: 'filepath',
			webviewPath: 'webviewpath',
		},
		tags: [],
	};

	const testShoppingListItem = {
		itemID: 'shopping-list-item-test',
		amount: '10',
	};

	const testGroupItemID = 'group-test-id';

	beforeEach(() => {
		const lib = new ItemLibrary(new Map<string, LibraryItem>());
		lib.add(testFullLibraryItem.itemID, testFullLibraryItem);

		const lists = [new ShoppingList(new Map())];
		lists[0].add(testShoppingListItem.itemID, testShoppingListItem);

		const groups = [new ItemGroup('Test Group', [])];
		groups[0].add(testGroupItemID);

		TestBed.configureTestingModule({
			imports: [IonicStorageModule.forRoot()],
			providers: [
				provideMockStore({
					initialState,
					selectors: [
						{
							selector: selectItemLibrary,
							value: lib,
						},
						{
							selector: selectShoppingLists,
							value: lists,
						},
						{
							selector: selectItemGroups,
							value: groups,
						},
					],
				}),
				provideMockActions(() => actions$),
				ShoppingListEffects,
			],
		});

		store = TestBed.inject(MockStore);
		effects = TestBed.inject(ShoppingListEffects);
	});

	it('should load the ItemLibrary from storage', done => {
		actions$ = of(SLActions.startInitialLoad);

		effects.startInitialLoad$.subscribe(res => {
			expect(res.itemLibrary).toBeInstanceOf(ItemLibrary);
			done();
		});
	});

	it('should load the ItemGroups from storage', done => {
		actions$ = of(SLActions.startInitialLoad);

		effects.startInitialLoad$.subscribe(res => {
			expect(res.itemGroups).toBeInstanceOf(Array);
			done();
		});
	});

	it('should add a LibraryItem', done => {
		actions$ = of(SLActions.startAddLibraryItem(testRawLibraryItem));

		effects.startAddLibraryItem$.subscribe(res => {
			const generatedItem: LibraryItem = res.itemLibrary.values().next().value;
			const checkItem: LibraryItem = {
				...testRawLibraryItem,
				itemID: generatedItem.itemID,
			};
			expect(generatedItem).toEqual(checkItem);
			done();
		});
	});

	it('should dispatch endAddLibraryItem after adding one', done => {
		actions$ = of(SLActions.startAddLibraryItem);

		effects.startAddLibraryItem$.subscribe(res => {
			expect(res.type).toEqual(SLActions.endAddLibraryItem.type);
			done();
		});
	});

	it('should updated a LibraryItem', done => {
		actions$ = of(
			SLActions.startUpdateLibraryItem({
				item: { ...testFullLibraryItem, name: 'Updated Name' },
			})
		);

		effects.startUpdateLibraryItem$.subscribe(res => {
			const updatedItem: LibraryItem = res.itemLibrary.get(
				testFullLibraryItem.itemID
			);

			expect(updatedItem).not.toEqual(testFullLibraryItem);
			done();
		});
	});

	it('should remove a LibraryItem', done => {
		actions$ = of(
			SLActions.startRemoveLibraryItem({
				itemID: testFullLibraryItem.itemID,
			})
		);

		effects.startRemoveLibraryItem$.subscribe(res => {
			const removedItem: LibraryItem = res.itemLibrary.get(
				testFullLibraryItem.itemID
			);

			expect(removedItem).not.toBeDefined();
			done();
		});
	});

	it('should add a ListItem to first shopping list', done => {
		actions$ = of(
			SLActions.startAddListItem({ ...testShoppingListItem, listIdx: 0 })
		);

		effects.startAddListItem$.subscribe(res => {
			expect(res.shoppingLists[0].get(testShoppingListItem.itemID)).toEqual(
				testShoppingListItem
			);
			done();
		});
	});

	it('should add a ListItem to new shopping list', done => {
		actions$ = of(
			SLActions.startAddListItem({ ...testShoppingListItem, listIdx: 1 })
		);

		effects.startAddListItem$.subscribe(res => {
			expect(res.shoppingLists[1].get(testShoppingListItem.itemID)).toEqual(
				testShoppingListItem
			);
			done();
		});
	});

	it('should update a ListItems amount', done => {
		actions$ = of(
			SLActions.startUpdateListItem({
				item: { ...testShoppingListItem, amount: '1' },
				listIdx: 0,
			})
		);

		effects.startUpdateListItem$.subscribe(res => {
			const updatedItem: ShoppingListItem = res.shoppingLists[0].get(
				testShoppingListItem.itemID
			);

			expect(updatedItem.amount).not.toEqual(testShoppingListItem.amount);
			done();
		});
	});

	it('should remove a ListItem', done => {
		actions$ = of(
			SLActions.startRemoveListItem({
				itemID: testShoppingListItem.itemID,
				listIdx: 0,
			})
		);

		effects.startRemoveListItem$.subscribe(res => {
			const removedItem: ShoppingListItem = res.shoppingLists[0].get(
				testShoppingListItem.itemID
			);

			expect(removedItem).not.toBeDefined();
			done();
		});
	});

	it('should dispatch endAddListItem after adding one', done => {
		actions$ = of(
			SLActions.startAddListItem({ ...testShoppingListItem, listIdx: 0 })
		);

		effects.startAddListItem$.subscribe(res => {
			expect(res.type).toEqual(SLActions.endAddListItem.type);
			done();
		});
	});

	it('should add an item to the first group', done => {
		actions$ = of(
			SLActions.startAddToItemGroup({ itemID: testGroupItemID, groupIdx: 0 })
		);

		effects.startAddToItemGroup$.subscribe(res => {
			expect(res.type).toEqual(SLActions.endAddToItemGroup.type);
			done();
		});
	});

	it('should dispatch raiseError when GroupIndex out of bounds', done => {
		actions$ = of(
			SLActions.startAddToItemGroup({ itemID: testGroupItemID, groupIdx: 3 })
		);

		effects.startAddToItemGroup$.subscribe(res => {
			expect(res.type).toEqual(SLActions.raiseGeneralError.type);
			done();
		});
	});

	it('should remove an item from a group', done => {
		actions$ = of(
			SLActions.startRemoveFromItemGroup({
				itemID: testGroupItemID,
				groupIdx: 0,
			})
		);

		effects.startRemoveFromItemGroup$.subscribe(res => {
			const group = res.itemGroups[0];
			expect(group.groupMembers.includes(testGroupItemID)).toBeFalse();
			done();
		});
	});
});
