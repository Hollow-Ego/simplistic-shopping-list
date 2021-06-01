import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import * as SLActions from '../../store/shopping-list.actions';
import * as Modes from '../../shared/constants';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ItemGroup } from '../../shared/classes/item-group.class';
import { ItemLibrary } from '../../shared/classes/item-library.class';
import { ShoppingList } from '../../shared/classes/shopping-list.class';
import { AddEditModalComponent } from '../../components/modals/add-edit-modal/add-edit-modal.component';
import { AddLibraryItemProps } from '../../shared/models/action-props.model';

@Component({
	selector: 'pxsl1-item-library',
	templateUrl: './item-library.view.html',
	styleUrls: ['./item-library.view.scss'],
})
export class ItemLibraryComponent implements OnInit, OnDestroy {
	public itemLibrary: ItemLibrary;
	public itemGroups: ItemGroup[];
	public shoppingLists: ShoppingList[];

	public currentListIdx: number;
	public isLoading: boolean;

	private stateSub: Subscription;

	constructor(
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
		});
	}

	onSearchChange($event) {}

	async onNewLibraryItem() {
		const modal = await this.modalCtrl.create({
			component: AddEditModalComponent,
			componentProps: {
				availableTags: this.itemLibrary.getAllTags(),
			},
		});
		await modal.present();
		const {
			canceled,
			itemData,
		}: { canceled: boolean; itemData: AddLibraryItemProps } = await (
			await modal.onWillDismiss()
		).data;
		console.log(itemData);

		if (canceled) {
			return;
		}

		this.store.dispatch(SLActions.startAddLibraryItem(itemData));
	}

	ngOnDestroy() {
		this.stateSub.unsubscribe();
	}
}
