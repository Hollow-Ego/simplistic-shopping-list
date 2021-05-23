import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ItemGroup } from '../../shared/classes/item-group.class';
import { ItemLibrary } from '../../shared/classes/item-library.class';
import { ShoppingList } from '../../shared/classes/shopping-list.class';
import { LanguageDetails } from '../../shared/i18n/language-details.model';
import { TranslationService } from '../../shared/i18n/translation.service';

import * as fromApp from '../../store/app.reducer';
import * as SLActions from '../../store/shopping-list.actions';
import * as Modes from '../../shared/constants';
import { AddEditModalComponent } from '../modals/add-edit-modal/add-edit-modal.component';

@Component({
	selector: 'ssl-shopping-list',
	templateUrl: './shopping-list.view.html',
	styleUrls: ['./shopping-list.view.scss'],
})
export class ShoppingListView implements OnInit, OnDestroy {
	public itemLibrary: ItemLibrary;
	public itemGroups: ItemGroup[];
	public shoppingLists: ShoppingList[];
	public language: string;
	public availableLanguages: LanguageDetails[];
	public currentListIdx: number;
	public isLoading: boolean;

	private stateSub: Subscription;

	constructor(
		private translate: TranslationService,
		private modalCtrl: ModalController,
		private store: Store<fromApp.AppState>
	) {}

	ngOnInit() {
		this.stateSub = this.store.select('shoppingList').subscribe(state => {
			if (!state) {
				return;
			}

			this.itemLibrary = state.itemLibrary;
			this.itemGroups = state.itemGroups;
			this.shoppingLists = state.shoppingLists;
			this.currentListIdx = state.currentListIdx;
			this.isLoading = state.isLoading;
			console.log(this.shoppingLists);
		});

		this.store.dispatch(SLActions.startInitialLoad({ mode: Modes.EDIT_MODE }));

		this.language = this.translate.currentLanguage;
		this.availableLanguages = this.translate.availableLanguages;

		// WIP
		this.onTestModal();
	}

	// async onEditItem(item: LibraryItem, slidingItem: IonItemSliding) {
	// 	slidingItem.close();

	// 	const modal = await this.modalCtrl.create({
	// 		component: NewEditItemComponent,
	// 		componentProps: {
	// 			isEditMode: true,
	// 			item,
	// 		},
	// 	});
	// 	await modal.present();
	// }

	onAddItem() {
		// this.store.dispatch(
		// 	SLActions.startAddListItem({
		// 		itemID: '0e34307a-a8aa-4499-a950-609a9980e693',
		// 		amount: null,
		// 		listIdx: 0,
		// 	})
		// );
		// const modal = await this.modalCtrl.create({
		// 	component: NewEditItemComponent,
		// });
		// await modal.present();
	}

	async onTestModal() {
		const modal = await this.modalCtrl.create({
			component: AddEditModalComponent,
		});
		await modal.present();
	}

	onLanguageChange() {
		this.translate.changeLanguage(this.language);
	}

	ngOnDestroy() {
		this.stateSub.unsubscribe();
	}
}
